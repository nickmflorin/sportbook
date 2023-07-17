import { zodResolver } from "@mantine/form";
import { type z } from "zod";

import { LeagueSchema, LeagueCompetitionLevel, LeagueType } from "~/prisma";

import { useForm } from "./useForm";

export type LeagueFormInput = z.input<typeof LeagueSchema>;
export type LeagueFormOutput = z.output<typeof LeagueSchema>;

export const useLeagueForm = () =>
  useForm<LeagueFormInput, LeagueFormOutput>({
    validate: zodResolver(LeagueSchema),
    initialValues: {
      name: "",
      description: "",
      competitionLevel: LeagueCompetitionLevel.SOCIAL,
      leagueType: LeagueType.PICKUP,
      sport: null,
      locations: [],
      leagueStart: null,
      leagueEnd: null,
    },
  });
