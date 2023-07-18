import { type LeagueCompetitionLevel, LeagueCompetitionLevels } from "~/prisma";

import { EnumSelect, type EnumSelectProps } from "./abstract";

export type LeagueCompetitionLevelSelectProps = Omit<
  EnumSelectProps<typeof LeagueCompetitionLevel, "single", null>,
  "loading" | "data" | "getLabel" | "model" | "mode" | "clearable"
>;

export const LeagueCompetitionLevelSelect = (props: LeagueCompetitionLevelSelectProps) => (
  <EnumSelect
    placeholder="Competition Level"
    {...props}
    mode="single"
    model={LeagueCompetitionLevels}
    clearable={false}
  />
);
