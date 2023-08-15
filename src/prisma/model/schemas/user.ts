import { z } from "zod";
import { Gender } from "@prisma/client";

/* Note:  At this point in time, this schema is only being used for the creation of Players.  Eventually, that flow will
   be more closely tied to the registration/invite process, and the usage of this schema and its properties may be
   subject to change.

   - The Clerk ID will be generated by the server when the user is created, but this may be adjusted in the future so
     users are created after they are created in Clerk via webhooks or middleware.
   - Eventually, we will need to incorporate the organization.  For now, we are assuming organization-less users.
   - Missing: roles, clerkId, org, orgId, ...

   This is currently not being used, but is serving as a placeholder. */
export const UserSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  emailAddress: z.string().email(),
  gender: z.nativeEnum(Gender),
});
