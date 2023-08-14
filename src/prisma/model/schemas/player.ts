import { z } from "zod";
import { LeagueCompetitionLevel, LeagueType, Sport } from "@prisma/client";

/* model Player {
     id         String            @id @default(uuid()) @db.Uuid
     user       User              @relation("players", fields: [userId], references: [id])
     userId     String            @db.Uuid
     createdAt  DateTime          @default(now())
     updatedAt  DateTime          @updatedAt
     playerType LeaguePlayerType? @default(value: PLAYER)
     // Note: We will have to figure out a way to ensure that participants of type PLAYER always belong to a team.  The
     // team needs to be optional for cases where the participant is of type ADMIN or REFEREE.
     team       Team              @relation("players", fields: [teamId], references: [id])
     teamId     String            @db.Uuid */

/*   @@unique([userId, teamId])
   } */

/* Note: Eventually, the CRUD operations related to players will be tied more closely to a registration/invite flow,
   where the user is provided to the player as a part of the actual player creation.  For now, we will just create both
   the player and the user at the same time, when the player is created via CRUD operations in the app. */
export const PlayerSchema = z.object({});
