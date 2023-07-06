"use client";
import { type Sport, type League } from "@prisma/client";

import { Paper } from "~/components/structural/Paper";
import { DataTableStyle } from "~/components/tables/DataTable";
import { LeaguesTable } from "~/components/tables/LeaguesTable";

export interface SportLeaguesViewProps {
  readonly sport: Sport;
  readonly leagues: League[];
}

export const SportLeaguesView = async ({ sport, leagues }: SportLeaguesViewProps) => (
  <Paper title={sport.name} collapsable={true} p="sm">
    <LeaguesTable records={leagues} tableStyle={DataTableStyle.SMALL} />
  </Paper>
);
