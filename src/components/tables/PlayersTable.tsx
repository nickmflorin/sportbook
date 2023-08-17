"use client";
import { type LeaguePlayerWithUser, type Team, type ModelWithFileUrl } from "~/prisma/model";
import { LeaguePlayerRoleBadge } from "~/components/badges/LeaguePlayerRoleBadge";
import { PlayerAvatar } from "~/components/images/PlayerAvatar";
import { TeamAvatar } from "~/components/images/TeamAvatar";

import { type Column } from "./columns";
import { DataTable, type DataTableProps } from "./DataTable";

export enum PlayersTableColumn {
  USER,
  PLAYER_ROLE,
  TEAM,
}

export type BasePlayer =
  | LeaguePlayerWithUser
  | (LeaguePlayerWithUser & { readonly team: Team })
  | (LeaguePlayerWithUser & { readonly team: ModelWithFileUrl<Team> });

export const hasTeam = (
  p: BasePlayer,
): p is
  | (LeaguePlayerWithUser & { readonly team: Team })
  | (LeaguePlayerWithUser & { readonly team: ModelWithFileUrl<Team> }) =>
  (p as LeaguePlayerWithUser & { readonly team: Team }).team !== undefined;

const PlayersTableColumns = <P extends BasePlayer>(): { [key in PlayersTableColumn]: Column<P> } => ({
  [PlayersTableColumn.USER]: {
    title: "Name",
    accessor: "user.name",
    textAlignment: "left",
    render: (player: P) => <PlayerAvatar player={player} withButton size={30} />,
  },
  [PlayersTableColumn.PLAYER_ROLE]: {
    title: "",
    accessor: "role",
    textAlignment: "left",
    render: (player: P) => <LeaguePlayerRoleBadge value={player.role} withIcon size="xs" />,
  },
  [PlayersTableColumn.TEAM]: {
    title: "Team",
    accessor: "team",
    textAlignment: "left",
    render: (player: P) => (hasTeam(player) ? <TeamAvatar team={player.team} size={30} withButton={true} /> : <></>),
  },
});

export interface PlayersTableProps<P extends BasePlayer> extends Omit<DataTableProps<P>, "onRowEdit" | "columns"> {
  readonly columns?: PlayersTableColumn[];
}

export const PlayersTable = <P extends BasePlayer>({
  columns = [PlayersTableColumn.USER, PlayersTableColumn.PLAYER_ROLE, PlayersTableColumn.TEAM],
  ...props
}: PlayersTableProps<P>): JSX.Element => (
  <DataTable<P> {...props} columns={columns.map(name => PlayersTableColumns()[name])} />
);

export default PlayersTable;
