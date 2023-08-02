import {
  type LeagueCompetitionLevel,
  LeagueCompetitionLevels,
  type LeagueWithConfig,
  type LeagueConfig,
} from "~/prisma/model";

import { Badge, type BadgeProps } from "./Badge";

type L = LeagueConfig | LeagueWithConfig | LeagueCompetitionLevel;

export interface LeagueCompetitionLevelBadgeProps
  extends Omit<BadgeProps, "color" | "backgroundColor" | "children" | "icon"> {
  readonly value: L;
  readonly withIcon?: boolean;
}

const getValue = (value: L): LeagueCompetitionLevel =>
  typeof value === "string"
    ? value
    : (value as LeagueConfig).competitionLevel !== undefined
    ? (value as LeagueConfig).competitionLevel
    : (value as LeagueWithConfig).config.competitionLevel;

export const LeagueCompetitionLevelBadge = ({
  value,
  withIcon,
  ...props
}: LeagueCompetitionLevelBadgeProps): JSX.Element => (
  <Badge
    {...props}
    color={LeagueCompetitionLevels.getBadgeColor(getValue(value))}
    backgroundColor={LeagueCompetitionLevels.getBadgeBackgroundColor(getValue(value))}
    icon={withIcon ? LeagueCompetitionLevels.getIcon(getValue(value)) : undefined}
  >
    {LeagueCompetitionLevels.getLabel(getValue(value))}
  </Badge>
);
