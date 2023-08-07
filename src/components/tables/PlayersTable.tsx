"use client";
import { useMemo } from "react";

import { type PlayerWithUser, type Team, type ModelWithFileUrl } from "~/prisma/model";
import { LeaguePlayerTypeBadge } from "~/components/badges/LeaguePlayerTypeBadge";
import { TeamAvatar } from "~/components/images/TeamAvatar";
import { UserAvatar } from "~/components/images/UserAvatar";
import { useMutableSearchParams } from "~/hooks/useMutableSearchParams";

import { type Column } from "./columns";
import { DataTable, type DataTableProps } from "./DataTable";

export enum PlayersTableColumn {
  USER,
  PLAYER_TYPE,
  TEAM,
}

export type BasePlayer =
  | PlayerWithUser
  | (PlayerWithUser & { readonly team: Team })
  | (PlayerWithUser & { readonly team: ModelWithFileUrl<Team> });

export const hasTeam = (
  p: BasePlayer,
): p is (PlayerWithUser & { readonly team: Team }) | (PlayerWithUser & { readonly team: ModelWithFileUrl<Team> }) =>
  (p as PlayerWithUser & { readonly team: Team }).team !== undefined;

const PlayersTableColumns = <P extends BasePlayer>(
  teamPathGetter: (teamId: string) => string,
): { [key in PlayersTableColumn]: Column<P> } => ({
  [PlayersTableColumn.USER]: {
    title: "Name",
    accessor: "user.name",
    textAlignment: "left",
    render: (player: P) => <UserAvatar user={player.user} displayName={true} size={30} />,
  },
  [PlayersTableColumn.PLAYER_TYPE]: {
    title: "",
    accessor: "playerType",
    textAlignment: "left",
    render: (player: P) => <LeaguePlayerTypeBadge value={player.playerType} withIcon size="xs" />,
  },
  [PlayersTableColumn.TEAM]: {
    title: "Team",
    accessor: "team",
    textAlignment: "left",
    render: (player: P) =>
      hasTeam(player) ? (
        <TeamAvatar team={player.team} href={teamPathGetter(player.team.id)} size={30} displayName={true} />
      ) : (
        <></>
      ),
  },
});

export interface PlayersTableProps<P extends BasePlayer> extends Omit<DataTableProps<P>, "onRowEdit" | "columns"> {
  readonly columns?: PlayersTableColumn[];
}

export const PlayersTable = <P extends BasePlayer>({
  columns = [PlayersTableColumn.USER, PlayersTableColumn.PLAYER_TYPE, PlayersTableColumn.TEAM],
  ...props
}: PlayersTableProps<P>): JSX.Element => {
  const { updateParams } = useMutableSearchParams();
  const cols = useMemo(
    () =>
      PlayersTableColumns(teamId => {
        const { path } = updateParams({ drawerId: "leagueTeam", teamId });
        return path;
      }),
    [updateParams],
  );
  return <DataTable<P> {...props} columns={columns.map(name => cols[name])} />;
};

export default PlayersTable;
