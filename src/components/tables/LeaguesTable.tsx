import { type League } from "~/prisma/model";
import { LeagueCompetitionLevelBadge, LeagueTypeBadge } from "~/components/badges";
import { AlternateButton } from "~/components/buttons";
import { Flex } from "~/components/structural";
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
type LeagueDatum = Pick<League, LeagueTableLeagueFields>;

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
    textAlignment: "left",
    width: 350,
    render: (league: LeagueDatum) => {
      const lines = (league.description || "")
        .split("\n")
        .filter(l => l.trim() !== "")
        .join(" ");
      return (
        <Flex direction="column" align="left" gap="sm">
          <AlternateButton.Secondary href={`/leagues/${league.id}`} size="sm">
            {league.name}
          </AlternateButton.Secondary>
          {lines.length !== 0 && (
            <Text lineClamp={3} size="xs" color="gray.5">
              {lines}
            </Text>
          )}
        </Flex>
      );
    },
  },
  [LeaguesTableColumn.START]: {
    title: "Starts",
    accessor: "leagueStart",
    width: 150,
    render: ({ leagueStart }) => (leagueStart ? <DateTimeText value={leagueStart} /> : <></>),
  },
  [LeaguesTableColumn.END]: {
    title: "Ends",
    accessor: "leagueEnd",
    width: 150,
    render: ({ leagueEnd }) => (leagueEnd ? <DateTimeText value={leagueEnd} /> : <></>),
  },
  [LeaguesTableColumn.IS_PUBLIC]: { accessor: "isPublic", title: "Public", width: 100 },
  [LeaguesTableColumn.LEAGUE_TYPE]: {
    textAlignment: "center",
    accessor: "leagueType",
    width: 120,
    title: "Type",
    render: (c: LeagueDatum) => <LeagueTypeBadge size="xs" value={c.leagueType} />,
  },
  [LeaguesTableColumn.COMPETITION_LEVEL]: {
    textAlignment: "center",
    accessor: "competitionLevel",
    width: 180,
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
  <DataTable<L> {...props} columns={columns.map(name => LeaguesTableColumns[name])} />
);
