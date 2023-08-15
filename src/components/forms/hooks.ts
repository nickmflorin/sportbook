import { type z } from "zod";

import { LeagueSchema, LeagueCompetitionLevel, LeagueType, InvitePlayersSchema } from "~/prisma/model";

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

export type InvitePlayersFormValues = z.infer<typeof InvitePlayersSchema>;

export const useInvitePlayersForm = () =>
  useForm<InvitePlayersFormValues>({
    schema: InvitePlayersSchema,
    defaultValues: {
      userIds: [],
      teamId: "",
    },
  });
