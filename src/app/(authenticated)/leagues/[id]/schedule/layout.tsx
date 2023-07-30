import { TableView } from "~/components/tables/TableView";
import { TableViewHeader } from "~/components/tables/TableViewHeader";

interface LeaguePlayersLayoutProps {
  readonly params: { id: string };
  readonly children: React.ReactNode;
}

export default async function LeaguePlayersLayout({ children, params: { id } }: LeaguePlayersLayoutProps) {
  return (
    <TableView
      header={
        <TableViewHeader
          title="Schedule"
          description="Upcoming games for this league."
          // filterBar={<PlayersFilterBar leagueId={id} />}
        />
      }
    >
      {children}
    </TableView>
  );
}
