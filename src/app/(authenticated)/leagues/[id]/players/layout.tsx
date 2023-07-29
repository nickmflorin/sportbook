import { TableView } from "~/components/tables/TableView";
import { TableViewHeader } from "~/components/tables/TableViewHeader";

import { PlayersFilterBar } from "./PlayersFilterBar";

interface LeaguePlayersLayoutProps {
  readonly params: { id: string };
  readonly children: React.ReactNode;
}

export default async function LeaguePlayersLayout({ children, params: { id } }: LeaguePlayersLayoutProps) {
  return (
    <TableView
      header={
        <TableViewHeader
          title="Players"
          description="The players who are currently registered in this league."
          filterBar={<PlayersFilterBar leagueId={id} />}
        />
      }
    >
      {children}
    </TableView>
  );
}
