"use client";
import { type Sport, type League } from "@prisma/client";

import { Paper } from "~/components/structural/Paper";
import { DataTableStyle } from "~/components/tables/DataTable";
import { LeaguesTable } from "~/components/tables/LeaguesTable";
import { Sports } from "~/prisma/enums";

export interface SportLeaguesViewProps {
  readonly sport: Sport;
  readonly leagues: League[];
}

const SportLeaguesView = async ({ sport, leagues }: SportLeaguesViewProps) => (
  <Paper title={Sports.getLabel(sport)} collapsable={true}>
    <LeaguesTable records={leagues} tableStyle={DataTableStyle.SMALL} />
  </Paper>
);

export default SportLeaguesView;
