"use client";
import { type League, type LeagueWithParticipation } from "~/prisma/model";
import { LeagueCompetitionLevelBadge, LeagueTypeBadge } from "~/components/badges";
import { AlternateButton } from "~/components/buttons/AlternateButton";
import { Flex } from "~/components/structural";
import { DateTimeText } from "~/components/typography/DateTimeText";
import { Text } from "~/components/typography/Text";

import { type Column } from "./columns";
import { DataTable, type DataTableProps } from "./DataTable";

type LeagueTableLeagueFields = "id" | "name" | "description" | "numParticipants" | "teams" | "config";

type OriginalLeagueFields = keyof League & LeagueTableLeagueFields;
type OptionalLeagueFields = Exclude<LeagueTableLeagueFields, OriginalLeagueFields> & keyof LeagueWithParticipation;

type LeagueDatum = { [key in OriginalLeagueFields]: League[key] } & {
  [key in OptionalLeagueFields]?: LeagueWithParticipation[key];
};

export enum LeaguesTableColumn {
  NAME,
  START,
  END,
  LEAGUE_TYPE,
  COMPETITION_LEVEL,
  IS_PUBLIC,
  NUM_PARTICIPANTS,
  NUM_TEAMS,
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
          <AlternateButton.Secondary href={`/leagues/${league.id}`} size="sm" style={{ textAlign: "left" }}>
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
  [LeaguesTableColumn.NUM_PARTICIPANTS]: {
    title: "# Players",
    accessor: "numParticipants",
    width: 150,
    render: ({ numParticipants }) => (numParticipants !== undefined ? `${numParticipants} Players` : <></>),
  },
  [LeaguesTableColumn.NUM_TEAMS]: {
    title: "# Teams",
    accessor: "numTeams",
    width: 150,
    render: ({ teams }) => (teams !== undefined ? `${teams.length} Teams` : <></>),
  },
  [LeaguesTableColumn.START]: {
    title: "Starts",
    accessor: "leagueStart",
    width: 150,
    render: ({ config }) => (config && config?.leagueStart ? <DateTimeText value={config.leagueStart} /> : <></>),
  },
  [LeaguesTableColumn.END]: {
    title: "Ends",
    accessor: "leagueEnd",
    width: 150,
    render: ({ config }) => (config && config.leagueEnd ? <DateTimeText value={config.leagueEnd} /> : <></>),
  },
  [LeaguesTableColumn.IS_PUBLIC]: { accessor: "isPublic", title: "Public", width: 100 },
  [LeaguesTableColumn.LEAGUE_TYPE]: {
    textAlignment: "center",
    accessor: "leagueType",
    width: 120,
    title: "Type",
    render: (c: LeagueDatum) =>
      c.config?.leagueType ? <LeagueTypeBadge size="xs" value={c.config.leagueType} /> : <></>,
  },
  [LeaguesTableColumn.COMPETITION_LEVEL]: {
    textAlignment: "center",
    accessor: "competitionLevel",
    width: 180,
    title: "Competition Level",
    render: (c: LeagueDatum) =>
      c.config?.competitionLevel ? <LeagueCompetitionLevelBadge size="xs" value={c.config.competitionLevel} /> : <></>,
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
    LeaguesTableColumn.NUM_TEAMS,
    LeaguesTableColumn.NUM_PARTICIPANTS,
  ],
  ...props
}: LeaguesTableProps<L>): JSX.Element => (
  <DataTable<L> {...props} columns={columns.map(name => LeaguesTableColumns[name])} />
);

export default LeaguesTable;
