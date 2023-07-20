import { type LeagueType, LeagueTypes } from "~/prisma/model";

import { EnumSelect, type EnumSelectProps } from "./abstract";

export type LeagueTypeSelectProps = Omit<
  EnumSelectProps<typeof LeagueType, "single", null>,
  "loading" | "mode" | "data" | "getLabel" | "model" | "clearable"
>;

export const LeagueTypeSelect = (props: LeagueTypeSelectProps) => (
  <EnumSelect placeholder="League Type" {...props} mode="single" model={LeagueTypes} clearable={false} />
);
