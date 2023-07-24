import { type UserResource } from "@clerk/types/dist/user";
import { type User } from "@prisma/client";

import { logger } from "~/application/logger";

export type BaseUser = Pick<User, "firstName" | "lastName" | "emailAddress"> | UserResource;

const userIsResource = (user: BaseUser): user is UserResource => Array.isArray((user as UserResource).emailAddresses);

export const parseUserEmailAddress = (user: BaseUser): string | null => {
  if (!userIsResource(user)) {
    return user.emailAddress;
  }
  const primaryAddressId = user.primaryEmailAddressId;
  if (primaryAddressId !== null) {
    const primaryEmail = user.emailAddresses.find(e => primaryAddressId === e.id);
    if (primaryEmail) {
      return primaryEmail.emailAddress;
    }
  }
  logger.warn({ clerkUserId: user.id }, "User does not have a primary email address associated with Clerk.");
  return null;
};

/**
 * Returns a string display name for the {@link User} based first on the 'firstName' and/or 'lastName' and then the
 * 'emailAddress' as a fallback.
 *
 * @template {U} user
 *   The generic form of the user that is being provided, which must contain a 'firstName', 'lastName' and
 *   'emailAddress' field.
 *
 * @param {U} user The user for which the display name should be parsed.
 * @returns {string}
 */
export const parseUserDisplayName = <U extends BaseUser = BaseUser, FB extends string | null = null>(
  user: U,
  options?: { fallback?: FB },
): string | FB => {
  const firstName = user.firstName ? user.firstName.trim() : null;
  const lastName = user.lastName ? user.lastName.trim() : null;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  }
  const email = parseUserEmailAddress(user);
  if (email) {
    return email;
  }
  return options?.fallback === undefined ? (null as FB) : options?.fallback;
};
