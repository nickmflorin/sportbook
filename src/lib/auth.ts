import { type User as ClerkUser, type EmailAddress } from "@clerk/clerk-sdk-node";
import { auth, getAuth } from "@clerk/nextjs/server";

import { NotAuthenticatedError } from "~/application/errors";
import { throwIfClient } from "~/lib/server";
import { type User } from "~/prisma";
import { prisma } from "~/prisma/client";

export const getClerkEmailAddress = (u: ClerkUser): EmailAddress | null => {
  /* The only reason our User model has a nullable email field is due to the fact that the ClerkUser's primary email
     address ID is nullable.  Eventually, we will need to find a way to enforce that the User model always has a valid
     email address. */
  if (u.primaryEmailAddressId) {
    const email = u.emailAddresses.find(e => e.id === u.primaryEmailAddressId);
    if (!email) {
      throw new Error(
        `No email address for Clerk user '${u.id}' matches the primary email address ID, '${u.primaryEmailAddressId}'.`,
      );
    }
    return email;
  }
  return null;
};

export const getAuthUserFromRequest = async (...args: Parameters<typeof getAuth>) => {
  throwIfClient();
  const { userId } = getAuth(...args);
  if (!userId) {
    return null;
  }
  return await prisma.user.findUniqueOrThrow({ where: { clerkId: userId } });
};

export async function getAuthUser(options: { strict: true }): Promise<User>;
export async function getAuthUser(options?: { strict?: false }): Promise<User | null>;
export async function getAuthUser(options?: { strict?: boolean }) {
  throwIfClient();
  const { userId } = auth();
  if (!userId) {
    if (options?.strict === true) {
      throw new NotAuthenticatedError();
    }
    return null;
  }
  return await prisma.user.findUniqueOrThrow({ where: { clerkId: userId } });
}
