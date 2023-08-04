import { type LeagueType, LeagueTypes, type LeagueWithConfig, type LeagueConfig } from "~/prisma/model";

type L = LeagueConfig | LeagueWithConfig | LeagueType;

const getValue = (value: L): LeagueType =>
  typeof value === "string"
    ? value
    : (value as LeagueConfig).leagueType !== undefined
    ? (value as LeagueConfig).leagueType
    : (value as LeagueWithConfig).config.leagueType;

import { EnumBadge, type EnumBadgeProps } from "./EnumBadge";

export interface LeagueTypeBadgeProps extends Omit<EnumBadgeProps<typeof LeagueType>, "value" | "model"> {
  readonly value: L;
}

export const LeagueTypeBadge = ({ value, ...props }: LeagueTypeBadgeProps): JSX.Element => (
  <EnumBadge {...props} model={LeagueTypes} value={getValue(value)} />
);
