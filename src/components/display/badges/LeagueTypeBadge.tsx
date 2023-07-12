import { type LeagueType, LeagueTypes } from "~/prisma";

import { Badge, type BadgeProps } from "./Badge";

export interface LeagueTypeBadgeProps extends Omit<BadgeProps, "color" | "backgroundColor"> {
  readonly leagueType: LeagueType;
}

export const LeagueTypeBadge = ({ leagueType, ...props }: LeagueTypeBadgeProps): JSX.Element => (
  <Badge
    {...props}
    color={LeagueTypes.getBadgeColor(leagueType)}
    backgroundColor={LeagueTypes.getBadgeBackgroundColor(leagueType)}
  >
    {LeagueTypes.getLabel(leagueType)}
  </Badge>
);
