import { type TeamStanding } from "~/prisma/model";

import { DataTable, type DataTableProps, type Column } from "./DataTable";

export enum TeamStandingsTableColumn {
  RANK,
  TEAM_NAME,
  WINS,
  LOSSES,
  TIES,
  POINTS,
  GAMES_PLAYED,
}

const TeamStandingsTableColumns: { [key in TeamStandingsTableColumn]: Column<TeamStanding> } = {
  [TeamStandingsTableColumn.RANK]: {
    title: "Rank",
    accessor: "leagueRank",
    textAlignment: "left",
    render: (standing: TeamStanding) => standing.leagueRank,
  },
  [TeamStandingsTableColumn.TEAM_NAME]: {
    title: "Name",
    accessor: "name",
    textAlignment: "left",
    render: (standing: TeamStanding) => standing.name,
  },
  [TeamStandingsTableColumn.WINS]: {
    title: "Wins",
    accessor: "stats.wins.total",
    textAlignment: "left",
    render: (standing: TeamStanding) => standing.stats.wins.total,
  },
  [TeamStandingsTableColumn.LOSSES]: {
    title: "Losses",
    accessor: "stats.losses.total",
    textAlignment: "left",
    render: (standing: TeamStanding) => standing.stats.losses.total,
  },
  [TeamStandingsTableColumn.TIES]: {
    title: "Ties",
    accessor: "stats.ties.total",
    textAlignment: "left",
    render: (standing: TeamStanding) => standing.stats.ties.total,
  },
  [TeamStandingsTableColumn.GAMES_PLAYED]: {
    title: "Games Played",
    accessor: "stats.gamesPlayed.total",
    textAlignment: "left",
    render: (standing: TeamStanding) => standing.stats.gamesPlayed.total,
  },
  [TeamStandingsTableColumn.POINTS]: {
    title: "Points",
    accessor: "stats.points.total",
    textAlignment: "left",
    render: (standing: TeamStanding) => standing.stats.points.total,
  },
};

export interface TeamStandingsTableProps extends Omit<DataTableProps<TeamStanding>, "onRowEdit" | "columns"> {
  readonly columns?: TeamStandingsTableColumn[];
}

export const TeamStandingsTable = ({
  columns = [
    TeamStandingsTableColumn.RANK,
    TeamStandingsTableColumn.TEAM_NAME,
    TeamStandingsTableColumn.GAMES_PLAYED,
    TeamStandingsTableColumn.WINS,
    TeamStandingsTableColumn.LOSSES,
    TeamStandingsTableColumn.TIES,
    TeamStandingsTableColumn.POINTS,
  ],
  ...props
}: TeamStandingsTableProps): JSX.Element => (
  <DataTable<TeamStanding> {...props} columns={columns.map(name => TeamStandingsTableColumns[name])} />
);
