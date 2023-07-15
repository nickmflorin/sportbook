import { type User as ClerkUser, type EmailAddress } from "@clerk/clerk-sdk-node";
import { auth, getAuth } from "@clerk/nextjs/server";

import { throwIfClient } from "~/lib/server";
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

export const getAuthUser = async () => {
  throwIfClient();
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  return await prisma.user.findUniqueOrThrow({ where: { clerkId: userId } });
};
