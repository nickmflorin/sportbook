import { auth, getAuth } from "@clerk/nextjs/server";

import { NotAuthenticatedError } from "~/application/errors";
import { throwIfClient } from "~/lib/server";
import { prisma } from "~/prisma/client";
import { type User } from "~/prisma/model";

export const getAuthUserFromRequest = async (...args: Parameters<typeof getAuth>) => {
  throwIfClient();
  const { userId } = getAuth(...args);
  if (!userId) {
    return null;
  }
  return await prisma.user.findUniqueOrThrow({ where: { clerkId: userId } });
};

export async function getAuthUser(options: { whenNotAuthenticated: () => never }): Promise<User>;
export async function getAuthUser(options: { strict: true }): Promise<User>;
export async function getAuthUser(options?: { strict?: false }): Promise<User | null>;
export async function getAuthUser(options?: { strict?: boolean } | { whenNotAuthenticated: () => never }) {
  throwIfClient();

  const { userId } = auth();
  if (!userId) {
    if (options && (options as { strict: true }).strict === true) {
      throw new NotAuthenticatedError();
    } else if (options && (options as { whenNotAuthenticated: () => never }).whenNotAuthenticated !== undefined) {
      (options as { whenNotAuthenticated: () => never }).whenNotAuthenticated();
    }
    return null;
  }

  return await prisma.user.findUniqueOrThrow({ where: { clerkId: userId } });
}
