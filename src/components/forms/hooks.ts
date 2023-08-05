import { type z } from "zod";

import { LeagueSchema, LeagueCompetitionLevel, LeagueType } from "~/prisma/model";

import { useForm } from "./useForm";

export type LeagueFormValues = z.infer<typeof LeagueSchema>;

export const useLeagueForm = () =>
  useForm<LeagueFormValues>({
    schema: LeagueSchema,
    defaultValues: {
      name: "",
      description: "",
      competitionLevel: LeagueCompetitionLevel.SOCIAL,
      leagueType: LeagueType.PICKUP,
      locations: [],
      leagueStart: null,
      leagueEnd: null,
    },
  });
