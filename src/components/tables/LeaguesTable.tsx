import { type League } from "~/prisma";
import { LeagueCompetitionLevelBadge, LeagueTypeBadge } from "~/components/display/badges";
import { Text, DateTimeText } from "~/components/typography";

import { DataTable, type DataTableProps, type Column } from "./DataTable";

type LeagueTableLeagueFields =
  | "id"
  | "name"
  | "description"
  | "leagueStart"
  | "leagueEnd"
  | "leagueType"
  | "competitionLevel";
export type LeagueDatum = Pick<League, LeagueTableLeagueFields>;

export enum LeaguesTableColumn {
  NAME,
  START,
  END,
  LEAGUE_TYPE,
  COMPETITION_LEVEL,
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
  [LeaguesTableColumn.START]: {
    title: "Starts",
    accessor: "leagueStart",
    render: ({ leagueStart }) => (leagueStart ? <DateTimeText value={leagueStart} /> : <></>),
  },
  [LeaguesTableColumn.END]: {
    title: "Ends",
    accessor: "leagueEnd",
    render: ({ leagueEnd }) => (leagueEnd ? <DateTimeText value={leagueEnd} /> : <></>),
  },
  [LeaguesTableColumn.IS_PUBLIC]: { accessor: "isPublic", title: "Public" },
  [LeaguesTableColumn.LEAGUE_TYPE]: {
    textAlignment: "center",
    accessor: "leagueType",
    title: "Type",
    render: (c: LeagueDatum) => <LeagueTypeBadge size="xs" value={c.leagueType} />,
  },
  [LeaguesTableColumn.COMPETITION_LEVEL]: {
    textAlignment: "center",
    accessor: "competitionLevel",
    title: "Competition Level",
    render: (c: LeagueDatum) => <LeagueCompetitionLevelBadge size="xs" value={c.competitionLevel} />,
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
    LeaguesTableColumn.COMPETITION_LEVEL,
    LeaguesTableColumn.START,
    LeaguesTableColumn.END,
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
