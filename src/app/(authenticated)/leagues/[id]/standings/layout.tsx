import { TableView } from "~/components/tables/TableView";
import { TableViewHeader } from "~/components/tables/TableViewHeader";

interface LeagueStandingsLayoutProps {
  readonly children: React.ReactNode;
}

export default async function LeagueStandingsLayout({ children }: LeagueStandingsLayoutProps) {
  return <TableView header={<TableViewHeader title="Standings" />}>{children}</TableView>;
}
