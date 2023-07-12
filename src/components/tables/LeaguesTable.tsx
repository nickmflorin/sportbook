import { type League } from "~/prisma";
import { LeagueTypeBadge } from "~/components/display/badges";
import { DateTimeDisplay } from "~/components/display/DateTimeDisplay";
import { Text } from "~/components/typography";

import { DataTable, type DataTableProps, type Column } from "./DataTable";

type LeagueTableLeagueFields = "name" | "description" | "leagueStart" | "leagueEnd" | "leagueType";
export type LeagueDatum = Pick<League, LeagueTableLeagueFields>;

export enum LeaguesTableColumn {
  NAME,
  LEAGUE_START,
  LEAGUE_END,
  LEAGUE_TYPE,
  // COMPETITION_LEVEL,
  IS_PUBLIC,
}

const LeaguesTableColumns: { [key in LeaguesTableColumn]: Column<LeagueDatum> } = {
  [LeaguesTableColumn.NAME]: {
    title: "Name",
    accessor: "name",
    render: (league: LeagueDatum) => (
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
    render: (c: LeagueDatum) => (c.leagueType ? <LeagueTypeBadge size="xs" leagueType={c.leagueType} /> : <></>),
  },
};

export interface LeaguesTableProps<L extends LeagueDatum = LeagueDatum>
  extends Omit<DataTableProps<L>, "onRowEdit" | "columns"> {
  readonly columns?: LeaguesTableColumn[];
}

export const LeaguesTable = <L extends LeagueDatum = LeagueDatum>({
  columns = [
    LeaguesTableColumn.NAME,
    LeaguesTableColumn.LEAGUE_TYPE,
    LeaguesTableColumn.LEAGUE_START,
    LeaguesTableColumn.LEAGUE_END,
    LeaguesTableColumn.IS_PUBLIC,
  ],
  ...props
}: LeaguesTableProps<L>): JSX.Element => (
  <DataTable<L>
    errorMessage="There was an error loading the Leagues."
    emptyMessage="There are no Leagues."
    {...props}
    columns={columns.map(name => LeaguesTableColumns[name])}
  />
);
