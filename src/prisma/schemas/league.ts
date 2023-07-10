import { z } from "zod";
import { LeagueCompetitionLevel, LeagueType, Sport } from "@prisma/client";

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
  description: z.string().nullable(),
  leagueStart: z.date().nullable(),
  leagueEnd: z.date().nullable(),
  // TODO: Should we enforce that each league be associated with a least one location?  How do we do this in the DB?
  locations: z.array(LocationSchema),
  leagueType: z.nativeEnum(LeagueType).optional(), // Defaults to Pickup
  sport: z.nativeEnum(Sport, { required_error: "A league must belong to a sport." }),
  isPublic: z.boolean().optional(), // Defaults to true
  competitionLevel: z.nativeEnum(LeagueCompetitionLevel).optional(), // Defaults to SOCIAL
});
