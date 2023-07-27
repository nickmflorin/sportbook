import { type PlayerWithUser } from "~/prisma/model";

import { DataTable, type DataTableProps, type Column } from "./DataTable";

export enum PlayersTableColumn {
  USER,
  PLAYER_TYPE,
}

const PlayersTableColumns: { [key in PlayersTableColumn]: Column<PlayerWithUser> } = {
  [PlayersTableColumn.USER]: {
    title: "User",
    accessor: "user.name",
    textAlignment: "left",
    render: (player: PlayerWithUser) => player.user.firstName,
  },
  [PlayersTableColumn.PLAYER_TYPE]: {
    title: "User",
    accessor: "user.name",
    textAlignment: "left",
    render: (player: PlayerWithUser) => player.playerType,
  },
};

export interface PlayersTableProps extends Omit<DataTableProps<PlayerWithUser>, "onRowEdit" | "columns"> {
  readonly columns?: PlayersTableColumn[];
}

export const PlayersTable = ({
  columns = [PlayersTableColumn.USER, PlayersTableColumn.PLAYER_TYPE],
  ...props
}: PlayersTableProps): JSX.Element => (
  <DataTable<PlayerWithUser> {...props} columns={columns.map(name => PlayersTableColumns[name])} />
);
