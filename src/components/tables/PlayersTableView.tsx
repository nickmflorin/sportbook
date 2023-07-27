"use client";
import { type PlayerWithUser } from "~/prisma/model";

import { PlayersTable, type PlayersTableProps } from "./PlayersTable";
import { TableView, type TableViewProps } from "./TableView";

export interface PlayersTableViewProps
  extends Omit<PlayersTableProps, "style" | "className" | "sx" | "data">,
    Pick<TableViewProps, "title" | "description" | "actions" | "className" | "style"> {
  readonly data: PlayerWithUser[];
}

export const PlayersTableView = ({
  data,
  style,
  className,
  title = "Standings",
  description,
  ...props
}: PlayersTableViewProps): JSX.Element => (
  <TableView title={title} description={description} style={style} className={className}>
    <PlayersTable {...props} data={data} />
  </TableView>
);

export default PlayersTableView;
