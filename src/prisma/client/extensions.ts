import { type EmailAddress, type User as ClerkUser } from "@clerk/clerk-sdk-node";
import { DateTime } from "luxon";
import { type User, type PrismaClient } from "@prisma/client";

import { logger } from "~/application/logger";
import { getClerkEmailAddress } from "~/lib/clerk";

import { isPrismaDoesNotExistError } from "./errors";

type RequiredClerkField = "emailAddress" | "firstName" | "lastName";
type ClerkField = RequiredClerkField | "profileImageUrl";

const REQUIRED_CLERK_FIELDS: Exclude<RequiredClerkField, "emailAddress">[] = ["firstName", "lastName"];

type ClerkOriginalFieldType<F extends ClerkField> = (Pick<ClerkUser, Exclude<ClerkField, "emailAddress">> & {
  emailAddress: EmailAddress | null;
})[F];

type ClerkValidatedFieldType<F extends ClerkField> = F extends RequiredClerkField
  ? Exclude<ClerkOriginalFieldType<F>, null>
  : ClerkOriginalFieldType<F>;

type ClerkValidatedFields = { [key in RequiredClerkField]: ClerkValidatedFieldType<key> };

type ClerkTransformedFields = {
  [key in Exclude<ClerkField, "emailAddress">]: ClerkValidatedFieldType<key>;
} & {
  emailAddress: string;
};

type ClerkFieldCheck<F extends RequiredClerkField = RequiredClerkField> = F extends RequiredClerkField
  ? { field: F; value: ClerkOriginalFieldType<F> }
  : never;

const getClerkUserValidatedFields = (u: ClerkUser): ClerkValidatedFields => {
  /* We may have to revisit whether or not this makes sense - but for now we are enforcing that the emailAddress,
     firstName and lastName are on our User model, and have simultaneously also enforced that the first name, last name
     and email address are required fields via Clerk for signup.  That being said, even though those fields are
     configured to be required, it is not typed that way - as corrupted Clerk settings can lead to them being
     undefined. */
  const clerkFields: ClerkFieldCheck[] = [
    { field: "emailAddress", value: getClerkEmailAddress(u) },
    ...REQUIRED_CLERK_FIELDS.map((f: Exclude<RequiredClerkField, "emailAddress">) => ({ field: f, value: u[f] })),
  ];
  const missingFields = clerkFields.filter(check => check.value === null).map(check => check.field);
  if (missingFields.length !== 0) {
    const missingFieldsString = missingFields.join(", ");
    /* TODO: We might have to log here instead, and simply assume empty strings for the values.  Throwing an error here
       may introduce problems if the fields were ever optional and then subsequently changed to being required in
       Clerk. */
    throw new Error(
      `Detected a user in Clerk with missing field(s), '${missingFieldsString}', the user cannot be created in the database.`,
    );
  }
  return clerkFields.reduce((acc, check) => ({ ...acc, [check.field]: check.value }), {} as ClerkValidatedFields);
};

export const userModelExtension = (prisma: PrismaClient) => ({
  _getTransformedClerkData: (u: ClerkUser): ClerkTransformedFields => {
    const clerkFields = getClerkUserValidatedFields(u);
    return {
      ...clerkFields,
      profileImageUrl: u.profileImageUrl,
      emailAddress: clerkFields.emailAddress.emailAddress,
    };
  },
  async upsertFromClerk(u: ClerkUser) {
    return prisma.user.upsert({
      where: { clerkId: u.id },
      update: {
        ...this._getTransformedClerkData(u),
        lastUpdatedFromClerk: new Date(),
      },
      create: {
        ...this._getTransformedClerkData(u),
        clerkId: u.id,
      },
    });
  },
  async createFromClerk(u: ClerkUser) {
    return prisma.user.create({
      data: {
        ...this._getTransformedClerkData(u),
        clerkId: u.id,
      },
    });
  },
  async syncWithClerk(u: ClerkUser) {
    let user: User | null = null;
    try {
      user = await prisma.user.findUniqueOrThrow({ where: { clerkId: u.id } });
    } catch (e) {
      if (isPrismaDoesNotExistError(e)) {
        logger.info({ clerkId: u.id }, `User does not exist for Clerk ID '${u.id}'... creating a new User.`);
        return this.upsertFromClerk(u);
      } else {
        throw e;
      }
    }
    // TODO: Time zone considerations?
    const lastUpdated = DateTime.fromJSDate(user.lastUpdatedFromClerk);
    const hoursSinceLastUpdate = DateTime.local().diff(lastUpdated).hours;
    // TODO: Make me an environment variable.
    if (hoursSinceLastUpdate > 2) {
      logger.info({ clerkId: u.id }, `User exists for Clerk ID '${u.id}' but requires update, updating the User.`);
      return this.upsertFromClerk(u);
    }
    return user;
  },
});
