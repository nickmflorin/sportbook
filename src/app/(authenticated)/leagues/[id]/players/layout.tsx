import { redirect } from "next/navigation";

import { TableView } from "~/components/views/TableView";
import { TableViewHeader } from "~/components/views/TableViewHeader";
import { getAuthUser } from "~/server/auth";

import { LeagueFilterBar } from "../LeagueFilterBar";

interface LeaguePlayersLayoutProps {
  readonly params: { id: string };
  readonly children: React.ReactNode;
}

export default async function LeaguePlayersLayout({ children, params: { id } }: LeaguePlayersLayoutProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  return (
    <TableView
      header={
        <TableViewHeader
          title="Players"
          description="The players who are currently registered in this league."
          filterBar={<LeagueFilterBar league={id} user={user} />}
        />
      }
    >
      {children}
    </TableView>
  );
}
