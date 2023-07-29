"use client";
import { type PlayerWithUser, type Team, type ModelWithFileUrl } from "~/prisma/model";
import { TeamAvatar } from "~/components/images/TeamAvatar";
import { UserAvatar } from "~/components/images/UserAvatar";

import { DataTable, type DataTableProps, type Column } from "./DataTable";

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

const PlayersTableColumns = <P extends BasePlayer>(): { [key in PlayersTableColumn]: Column<P> } => ({
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
    render: (player: P) => player.playerType,
  },
  [PlayersTableColumn.TEAM]: {
    title: "Team",
    accessor: "team",
    textAlignment: "left",
    render: (player: P) => (hasTeam(player) ? <TeamAvatar team={player.team} size={30} displayName={true} /> : <></>),
  },
});

export interface PlayersTableProps<P extends BasePlayer> extends Omit<DataTableProps<P>, "onRowEdit" | "columns"> {
  readonly columns?: PlayersTableColumn[];
}

export const PlayersTable = <P extends BasePlayer>({
  columns = [PlayersTableColumn.USER, PlayersTableColumn.PLAYER_TYPE, PlayersTableColumn.TEAM],
  ...props
}: PlayersTableProps<P>): JSX.Element => (
  <DataTable<P> {...props} columns={columns.map(name => PlayersTableColumns()[name])} />
);

export default PlayersTable;
