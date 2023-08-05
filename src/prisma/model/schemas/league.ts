import { z } from "zod";
import { LeagueCompetitionLevel, LeagueType, Sport } from "@prisma/client";

import { LocationSchema } from "./location";

const UnsavedLocationIdSchema = z.custom<`unsaved-${string}`>(
  data => typeof data === "string" && data.startsWith("unsaved-"),
);

// TODO: Include league requirements and league registration parameters.
export const LeagueSchema = z
  .object({
    name: z.string({ required_error: "The league's name is a required field." }).superRefine((val, ctx) => {
      if (val.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The league's name is a required field.",
        });
        return z.NEVER;
      } else if (val.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 3,
          type: "string",
          message: "The league's name must be at least 3 characers long.",
          inclusive: true,
        });
        return z.NEVER;
      }
    }),
    description: z
      .string()
      .nullable()
      .superRefine((val, ctx) => {
        if (val && val.length !== 0 && val.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: 3,
            type: "string",
            message: "The league's description must be at least 3 characers long.",
            inclusive: true,
          });
          return z.NEVER;
        }
      }),
    leagueStart: z.date().nullable(),
    leagueEnd: z.date().nullable(),
    // TODO: Should we enforce that each league be associated with a least one location?  How do we do this in the DB?
    locations: z.array(z.union([LocationSchema.extend({ id: UnsavedLocationIdSchema }), z.string().uuid()])),
    sport: z.nativeEnum(Sport, {
      required_error: "A league must belong to a sport.",
    }),
    isPublic: z.boolean().optional(),
    competitionLevel: z.nativeEnum(LeagueCompetitionLevel),
    leagueType: z.nativeEnum(LeagueType),
  })
  .refine(data => !data.leagueStart || !data.leagueEnd || data.leagueEnd > data.leagueStart, {
    message: "The league's start date must be before the end date.",
    path: ["leagueStart"],
  });
