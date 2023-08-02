import {
  type LeagueCompetitionLevel,
  LeagueCompetitionLevels,
  type LeagueWithConfig,
  type LeagueConfig,
} from "~/prisma/model";

import { EnumBadge, type EnumBadgeProps } from "./EnumBadge";

type L = LeagueConfig | LeagueWithConfig | LeagueCompetitionLevel;

const getValue = (value: L): LeagueCompetitionLevel =>
  typeof value === "string"
    ? value
    : (value as LeagueConfig).competitionLevel !== undefined
    ? (value as LeagueConfig).competitionLevel
    : (value as LeagueWithConfig).config.competitionLevel;

export interface LeagueCompetitionLevelBadgeProps extends Omit<EnumBadgeProps<typeof LeagueCompetitionLevel>, "value"> {
  readonly value: L;
}

export const LeagueCompetitionLevelBadge = ({ value, ...props }: LeagueCompetitionLevelBadgeProps): JSX.Element => (
  <EnumBadge {...props} model={LeagueCompetitionLevels} value={getValue(value)} />
);
