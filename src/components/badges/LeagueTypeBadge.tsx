import { type LeagueType, LeagueTypes, type LeagueWithConfig, type LeagueConfig } from "~/prisma/model";

import { Badge, type BadgeProps } from "./Badge";

type L = LeagueConfig | LeagueWithConfig | LeagueType;

export interface LeagueTypeBadgeProps extends Omit<BadgeProps, "color" | "backgroundColor" | "children" | "icon"> {
  readonly value: L;
  readonly withIcon?: boolean;
}

const getValue = (value: L): LeagueType =>
  typeof value === "string"
    ? value
    : (value as LeagueConfig).leagueType !== undefined
    ? (value as LeagueConfig).leagueType
    : (value as LeagueWithConfig).config.leagueType;

export const LeagueTypeBadge = ({ value, withIcon, ...props }: LeagueTypeBadgeProps): JSX.Element => (
  <Badge
    {...props}
    color={LeagueTypes.getBadgeColor(getValue(value))}
    backgroundColor={LeagueTypes.getBadgeBackgroundColor(getValue(value))}
    icon={withIcon ? LeagueTypes.getIcon(getValue(value)) : undefined}
  >
    {LeagueTypes.getLabel(getValue(value))}
  </Badge>
);
