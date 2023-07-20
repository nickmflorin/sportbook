import { type LeagueType, LeagueTypes, type League } from "~/prisma/model";

import { Badge, type BadgeProps } from "./Badge";

export interface LeagueTypeBadgeProps extends Omit<BadgeProps, "color" | "backgroundColor" | "children"> {
  readonly value: LeagueType | Pick<League, "leagueType">;
}

export const LeagueTypeBadge = ({ value, ...props }: LeagueTypeBadgeProps): JSX.Element => (
  <Badge
    {...props}
    color={LeagueTypes.getBadgeColor(typeof value === "string" ? value : value.leagueType)}
    backgroundColor={LeagueTypes.getBadgeBackgroundColor(typeof value === "string" ? value : value.leagueType)}
  >
    {LeagueTypes.getLabel(typeof value === "string" ? value : value.leagueType)}
  </Badge>
);
