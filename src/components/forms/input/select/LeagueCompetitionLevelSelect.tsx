import { type LeagueCompetitionLevel, LeagueCompetitionLevels } from "~/prisma";

import { EnumSelect, type EnumSelectProps } from "./abstract";

export type LeagueCompetitionLevelSelectProps = Omit<
  EnumSelectProps<typeof LeagueCompetitionLevel>,
  "loading" | "data" | "getLabel" | "model"
>;

export const LeagueCompetitionLevelSelect = (props: LeagueCompetitionLevelSelectProps) => (
  <EnumSelect placeholder="Competition Level" {...props} model={LeagueCompetitionLevels} />
);
