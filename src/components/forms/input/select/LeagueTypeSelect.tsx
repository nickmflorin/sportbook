import { type LeagueType, LeagueTypes } from "~/prisma";

import { EnumSelect, type EnumSelectProps } from "./abstract";

export type LeagueTypeSelectProps = Omit<EnumSelectProps<typeof LeagueType>, "loading" | "data" | "getLabel" | "model">;

export const LeagueTypeSelect = (props: LeagueTypeSelectProps) => (
  <EnumSelect placeholder="League Type" {...props} model={LeagueTypes} />
);
