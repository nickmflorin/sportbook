"use client";
import { useState } from "react";

import { Text } from "@mantine/core";
import { type League } from "@prisma/client";

import { LeagueTypeBadge } from "~/components/display/badges";
import { DateTimeDisplay } from "~/components/display/DateTimeDisplay";

import { DataTable, type DataTableProps, type Column } from "./DataTable";

export enum LeaguesTableColumn {
  NAME,
  CREATED_AT,
  LEAGUE_START,
  LEAGUE_END,
  LEAGUE_TYPE,
  // COMPETITION_LEVEL,
  IS_PUBLIC,
}

const LeaguesTableColumns: { [key in LeaguesTableColumn]: Column<League> } = {
  [LeaguesTableColumn.NAME]: {
    title: "Name",
    accessor: "name",
    render: (league: League) => (
      <>
        <Text>{league.name}</Text>
        {league.description && (
          <Text size="xs" color="gray.6">
            {league.description}
          </Text>
        )}
      </>
    ),
  },
  [LeaguesTableColumn.CREATED_AT]: {
    title: "Created",
    accessor: "createdAt",
    render: ({ createdAt }) => <DateTimeDisplay value={createdAt} />,
  },
  [LeaguesTableColumn.LEAGUE_START]: {
    title: "Starts",
    accessor: "leagueStart",
    render: ({ leagueStart }) => (leagueStart ? <DateTimeDisplay value={leagueStart} /> : <></>),
  },
  [LeaguesTableColumn.LEAGUE_END]: {
    title: "Ends",
    accessor: "leagueEnd",
    render: ({ leagueEnd }) => (leagueEnd ? <DateTimeDisplay value={leagueEnd} /> : <></>),
  },
  [LeaguesTableColumn.IS_PUBLIC]: { accessor: "isPublic", title: "Public" },
  [LeaguesTableColumn.LEAGUE_TYPE]: {
    textAlignment: "center",
    accessor: "leagueType",
    title: "Type",
    render: (c: League) => (c.leagueType ? <LeagueTypeBadge size="xs" px="xs" leagueType={c.leagueType} /> : <></>),
  },
};

export interface LeaguesDataTableProps extends Omit<DataTableProps<League>, "onRowEdit" | "columns"> {
  readonly rowEditable?: boolean;
  readonly columns?: LeaguesTableColumn[];
  readonly onUpdated?: (League: League) => void;
}

export const LeaguesTable = ({
  rowEditable,
  columns = [
    LeaguesTableColumn.NAME,
    LeaguesTableColumn.LEAGUE_TYPE,
    LeaguesTableColumn.LEAGUE_START,
    LeaguesTableColumn.LEAGUE_END,
    LeaguesTableColumn.IS_PUBLIC,
    LeaguesTableColumn.CREATED_AT,
  ],
  onUpdated,
  ...props
}: LeaguesDataTableProps): JSX.Element => {
  const [leagueToEdit, setLeagueToEdit] = useState<League | null>(null);

  return (
    <DataTable<League>
      errorMessage="There was an error loading the Leagues."
      emptyMessage="There are no Leagues."
      {...props}
      columns={columns.map(name => LeaguesTableColumns[name])}
      onRowEdit={rowEditable ? League => setLeagueToEdit(League) : undefined}
    />
  );
};
