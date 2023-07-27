"use client";
import { PlayersTable, type PlayersTableProps, type BasePlayer } from "./PlayersTable";
import { TableView, type TableViewProps } from "./TableView";

export interface PlayersTableViewProps<P extends BasePlayer>
  extends Omit<PlayersTableProps<P>, "style" | "className" | "data">,
    Pick<TableViewProps, "title" | "description" | "actions" | "className" | "style"> {
  readonly data: P[];
}

export const PlayersTableView = <P extends BasePlayer>({
  data,
  style,
  className,
  title = "Standings",
  description,
  ...props
}: PlayersTableViewProps<P>): JSX.Element => (
  <TableView title={title} description={description} style={style} className={className}>
    <PlayersTable {...props} data={data} />
  </TableView>
);

export default PlayersTableView;
