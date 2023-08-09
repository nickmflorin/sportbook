"use client";
import { useMemo } from "react";

import { type TeamWithStats, type WithFileUrl } from "~/prisma/model";
import { TeamAvatar } from "~/components/images/TeamAvatar";
import { useMutableSearchParams } from "~/hooks/useMutableSearchParams";

import { type Column } from "./columns";
import { DataTable, type DataTableProps } from "./DataTable";

export enum TeamStandingsTableColumn {
  RANK,
  TEAM,
  WINS,
  LOSSES,
  TIES,
  POINTS,
  GAMES_PLAYED,
}

const TeamStandingsTableColumns: (teamPathGetter: (teamId: string) => string) => {
  [key in TeamStandingsTableColumn]: Column<WithFileUrl<TeamWithStats>>;
} = teamPathGetter => ({
  [TeamStandingsTableColumn.RANK]: {
    title: "Rank",
    accessor: "stats.leagueRank",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamWithStats>) => standing.stats.leagueRank,
  },
  [TeamStandingsTableColumn.TEAM]: {
    title: "Team",
    accessor: "name",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamWithStats>) => (
      <TeamAvatar displayName href={teamPathGetter(standing.id)} team={standing} />
    ),
  },
  [TeamStandingsTableColumn.WINS]: {
    title: "Wins",
    accessor: "stats.wins.total",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamWithStats>) => standing.stats.wins.total,
  },
  [TeamStandingsTableColumn.LOSSES]: {
    title: "Losses",
    accessor: "stats.losses.total",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamWithStats>) => standing.stats.losses.total,
  },
  [TeamStandingsTableColumn.TIES]: {
    title: "Ties",
    accessor: "stats.ties.total",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamWithStats>) => standing.stats.ties.total,
  },
  [TeamStandingsTableColumn.GAMES_PLAYED]: {
    title: "Games Played",
    accessor: "stats.gamesPlayed.total",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamWithStats>) => standing.stats.gamesPlayed.total,
  },
  [TeamStandingsTableColumn.POINTS]: {
    title: "Points",
    accessor: "stats.points.total",
    textAlignment: "left",
    render: (standing: WithFileUrl<TeamWithStats>) => standing.stats.points.total,
  },
});

export interface TeamStandingsTableProps
  extends Omit<DataTableProps<WithFileUrl<TeamWithStats>>, "onRowEdit" | "columns"> {
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
}: TeamStandingsTableProps): JSX.Element => {
  const { updateParams } = useMutableSearchParams();
  const cols = useMemo(
    () =>
      TeamStandingsTableColumns(teamId => {
        const { path } = updateParams({ drawerId: "leagueTeam", teamId });
        return path;
      }),
    [updateParams],
  );
  return <DataTable<WithFileUrl<TeamWithStats>> {...props} columns={columns.map(name => cols[name])} />;
};

export default TeamStandingsTable;
