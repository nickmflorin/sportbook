import { LeagueCompetitionLevel, LeagueType } from "@prisma/client";
import { z } from "zod";

export const LocationSchema = z.object({
  name: z.string({ required_error: "The name of the location is required." }),
  primaryStreetAddress: z.string({ required_error: "A location must specify a primary address." }),
  secondaryStreetAddress: z.string().optional(),
  zipCode: z.string({ required_error: "A location must specify a zip code." }),
  city: z.string({ required_error: "A location must specify the city." }),
  state: z.string({ required_error: "A location must specify a state." }),
});

// TODO: Include league requirements and league registration parameters.
export const LeagueSchema = z.object({
  name: z.string({ required_error: "The name of the league is required." }),
  description: z.string().optional(),
  leagueStart: z.date().optional(),
  leagueEnd: z.date().optional(),
  // TODO: Should we enforce that each league be associated with a least one location?  How do we do this in the DB?
  locations: z.array(LocationSchema).optional(),
  leagueType: z.nativeEnum(LeagueType).optional(), // Defaults to Pickup
  // sportId: z.string({ required_error: "A league must belong to a sport." }).uuid(),
  isPublic: z.boolean().optional(), // Defaults to true
  competitionLevel: z.nativeEnum(LeagueCompetitionLevel).optional(), // Defaults to SOCIAL
});
