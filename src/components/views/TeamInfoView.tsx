import React from "react";

import { teamUiFormHasStats, teamUiFormHasPlayers, type TeamUiForm } from "~/prisma/model";
import { Badge } from "~/components/badges/Badge";
import { TeamAvatar, type TeamAvatarProps } from "~/components/images/TeamAvatar";
import { TeamStatsText } from "~/components/typography/TeamStatsText";
import { InfoView } from "~/components/views/InfoView";

export interface TeamInfoViewProps<T extends TeamUiForm> {
  readonly team: T;
  readonly avatarProps?: Pick<TeamAvatarProps<T>, "fontSize" | "size">;
}

export const TeamInfoView = <T extends TeamUiForm>({ team, avatarProps }: TeamInfoViewProps<T>): JSX.Element => (
  <InfoView
    title={team.name}
    description={teamUiFormHasStats(team) ? [<TeamStatsText key="0" stats={team.stats} size="xs" />] : []}
    image={<TeamAvatar fontSize="sm" size={50} {...avatarProps} team={team} />}
    tags={teamUiFormHasPlayers(team) ? [<Badge key="0" size="xxs">{`${team.numPlayers} Players`}</Badge>] : []}
  />
);

export default TeamInfoView;
