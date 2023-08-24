"use client";
import React from "react";

import { TeamAvatar } from "~/components/images/TeamAvatar";
import { type TeamWithStatsUiForm } from "~/prisma/model";

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

const TeamStandingsTableColumns = <T extends TeamWithStatsUiForm>(): {
  [key in TeamStandingsTableColumn]: Column<T>;
} => ({
  [TeamStandingsTableColumn.RANK]: {
    title: "Rank",
    accessor: "stats.leagueRank",
    textAlignment: "left",
    render: (standing: T) => standing.stats.leagueRank,
  },
  [TeamStandingsTableColumn.TEAM]: {
    title: "Team",
    accessor: "name",
    textAlignment: "left",
    render: (standing: T) => <TeamAvatar withButton team={standing} />,
  },
  [TeamStandingsTableColumn.WINS]: {
    title: "Wins",
    accessor: "stats.wins.total",
    textAlignment: "left",
    render: (standing: T) => standing.stats.wins.total,
  },
  [TeamStandingsTableColumn.LOSSES]: {
    title: "Losses",
    accessor: "stats.losses.total",
    textAlignment: "left",
    render: (standing: T) => standing.stats.losses.total,
  },
  [TeamStandingsTableColumn.TIES]: {
    title: "Ties",
    accessor: "stats.ties.total",
    textAlignment: "left",
    render: (standing: T) => standing.stats.ties.total,
  },
  [TeamStandingsTableColumn.GAMES_PLAYED]: {
    title: "Games Played",
    accessor: "stats.gamesPlayed.total",
    textAlignment: "left",
    render: (standing: T) => standing.stats.gamesPlayed.total,
  },
  [TeamStandingsTableColumn.POINTS]: {
    title: "Points",
    accessor: "stats.points.total",
    textAlignment: "left",
    render: (standing: T) => standing.stats.points.total,
  },
});

export interface TeamStandingsTableProps<T extends TeamWithStatsUiForm>
  extends Omit<DataTableProps<T>, "onRowEdit" | "columns"> {
  readonly columns?: TeamStandingsTableColumn[];
}

export const TeamStandingsTable = <T extends TeamWithStatsUiForm>({
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
}: TeamStandingsTableProps<T>): JSX.Element => (
  <DataTable<T> {...props} columns={columns.map(name => TeamStandingsTableColumns<T>()[name])} />
);

export default TeamStandingsTable;
