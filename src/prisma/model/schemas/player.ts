import { z } from "zod";
import { LeaguePlayerRole } from "@prisma/client";

/* Note: Eventually, the CRUD operations related to players will be tied more closely to a registration/invite flow,
   where the user is provided to the player as a part of the actual player creation.  For now, we will just create both
   the player and the user at the same time, when the player is created via CRUD operations in the app. */
export const PlayerSchema = z.object({
  userId: z.string({ required_error: "The user is required." }).uuid(),
  role: z.nativeEnum(LeaguePlayerRole),
  teamId: z.string({ required_error: "The team that the player belongs to is required." }).uuid(),
});

// See comment above regarding PlayerSchema.
export const InvitePlayersSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1, "At least one user must be selected."),
  teamId: z.string({ required_error: "The team that the player belongs to is required." }).uuid(),
});
