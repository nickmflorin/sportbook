"use client";
import { type TeamStanding, type WithFileUrl } from "~/prisma/model";

import { TableView, type TableViewProps } from "./TableView";
import { TeamStandingsTable, type TeamStandingsTableProps } from "./TeamStandingsTable";

export interface TeamStandingsTableViewProps
  extends Omit<TeamStandingsTableProps, "style" | "className" | "sx" | "data">,
    Pick<TableViewProps, "title" | "description" | "actions" | "className" | "style"> {
  readonly data: WithFileUrl<TeamStanding>[];
}

export const TeamStandingsTableView = ({
  data,
  style,
  className,
  title = "Standings",
  description,
  ...props
}: TeamStandingsTableViewProps): JSX.Element => (
  <TableView title={title} description={description} style={style} className={className}>
    <TeamStandingsTable {...props} data={data} />
  </TableView>
);

export default TeamStandingsTableView;
