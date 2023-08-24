import React from "react";

import { teamUiFormHasStats, teamUiFormHasPlayers, type TeamUiForm } from "~/prisma/model";
import { Badge, type BadgeProps } from "~/components/badges/Badge";
import { TeamAvatar, type TeamAvatarProps } from "~/components/images/TeamAvatar";
import { type SingleDescription } from "~/components/typography";
import { TeamStatsText, type TeamStatsTextProps } from "~/components/typography/TeamStatsText";
import { InfoView, type InfoViewProps } from "~/components/views/InfoView";

export type TeamInfoViewAvatarProps<T extends TeamUiForm = TeamUiForm> = Pick<TeamAvatarProps<T>, "fontSize" | "size">;

export interface TeamInfoViewProps<T extends TeamUiForm> extends Omit<InfoViewProps, "title" | "image" | "tags"> {
  readonly team: T;
  readonly avatarProps?: TeamInfoViewAvatarProps<T>;
  readonly badgeSize?: BadgeProps["size"];
  readonly showStats?: boolean;
  readonly teamStatsSize?: TeamStatsTextProps["size"];
}

export const TeamInfoView = <T extends TeamUiForm>({
  team,
  avatarProps,
  teamStatsSize = "xs",
  badgeSize = "xxs",
  showStats = true,
  description,
  ...props
}: TeamInfoViewProps<T>): JSX.Element => {
  let desc: SingleDescription[] =
    teamUiFormHasStats(team) && showStats ? [<TeamStatsText key="0" stats={team.stats} size={teamStatsSize} />] : [];
  desc = [...desc, ...(Array.isArray(description) ? description : [description])];
  return (
    <InfoView
      {...props}
      title={team.name}
      description={desc}
      image={<TeamAvatar fontSize="sm" size={50} {...avatarProps} team={team} />}
      tags={teamUiFormHasPlayers(team) ? [<Badge key="0" size={badgeSize}>{`${team.numPlayers} Players`}</Badge>] : []}
    />
  );
};

export default TeamInfoView;
