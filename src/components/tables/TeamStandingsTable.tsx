import { type TeamStanding, type WithFileUrl } from "~/prisma/model";
import { Flex } from "~/components/structural";
import { Text } from "~/components/typography";

import { ModelImage } from "../images";

import { DataTable, type DataTableProps, type Column } from "./DataTable";

export enum TeamStandingsTableColumn {
  RANK,
  TEAM,
  WINS,
  LOSSES,
  TIES,
  POINTS,
  GAMES_PLAYED,
}

const TeamStandingsTableColumns: { [key in TeamStandingsTableColumn]: Column<WithFileUrl<TeamStanding>> } = {
  [TeamStandingsTableColumn.RANK]: {
    title: "Rank",
    accessor: "leagueRank",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamStanding>) => standing.leagueRank,
  },
  [TeamStandingsTableColumn.TEAM]: {
    title: "Team",
    accessor: "name",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamStanding>) => (
      <Flex direction="row" gap="md">
        <ModelImage fallbackInitials={standing.name} src={standing.fileUrl} fontSize="sm" size={40} />
        <Text>{standing.name}</Text>
      </Flex>
    ),
  },
  [TeamStandingsTableColumn.WINS]: {
    title: "Wins",
    accessor: "stats.wins.total",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamStanding>) => standing.stats.wins.total,
  },
  [TeamStandingsTableColumn.LOSSES]: {
    title: "Losses",
    accessor: "stats.losses.total",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamStanding>) => standing.stats.losses.total,
  },
  [TeamStandingsTableColumn.TIES]: {
    title: "Ties",
    accessor: "stats.ties.total",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamStanding>) => standing.stats.ties.total,
  },
  [TeamStandingsTableColumn.GAMES_PLAYED]: {
    title: "Games Played",
    accessor: "stats.gamesPlayed.total",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamStanding>) => standing.stats.gamesPlayed.total,
  },
  [TeamStandingsTableColumn.POINTS]: {
    title: "Points",
    accessor: "stats.points.total",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamStanding>) => standing.stats.points.total,
  },
};

export interface TeamStandingsTableProps
  extends Omit<DataTableProps<WithFileUrl<TeamStanding>>, "onRowEdit" | "columns"> {
  readonly columns?: TeamStandingsTableColumn[];
}

export const TeamStandingsTable = ({
  columns = [
    TeamStandingsTableColumn.RANK,
    TeamStandingsTableColumn.TEAM,
    TeamStandingsTableColumn.GAMES_PLAYED,
    TeamStandingsTableColumn.WINS,
    TeamStandingsTableColumn.LOSSES,
    TeamStandingsTableColumn.TIES,
    TeamStandingsTableColumn.POINTS,
  ],
  ...props
}: TeamStandingsTableProps): JSX.Element => (
  <DataTable<WithFileUrl<TeamStanding>> {...props} columns={columns.map(name => TeamStandingsTableColumns[name])} />
);
