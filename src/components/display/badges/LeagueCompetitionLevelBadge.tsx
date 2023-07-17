import { type LeagueCompetitionLevel, LeagueCompetitionLevels, type League } from "~/prisma";

import { Badge, type BadgeProps } from "./Badge";

export interface LeagueCompetitionLevelBadgeProps extends Omit<BadgeProps, "color" | "backgroundColor" | "children"> {
  readonly value: Pick<League, "competitionLevel"> | LeagueCompetitionLevel;
}

export const LeagueCompetitionLevelBadge = ({ value, ...props }: LeagueCompetitionLevelBadgeProps): JSX.Element => (
  <Badge
    {...props}
    color={LeagueCompetitionLevels.getBadgeColor(typeof value === "string" ? value : value.competitionLevel)}
    backgroundColor={LeagueCompetitionLevels.getBadgeBackgroundColor(
      typeof value === "string" ? value : value.competitionLevel,
    )}
  >
    {LeagueCompetitionLevels.getLabel(typeof value === "string" ? value : value.competitionLevel)}
  </Badge>
);
