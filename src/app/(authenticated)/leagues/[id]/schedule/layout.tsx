import { redirect } from "next/navigation";

import { TableView } from "~/components/tables/TableView";
import { TableViewHeader } from "~/components/tables/TableViewHeader";
import { getAuthUser } from "~/server/auth";

import { LeagueFilterBar } from "../LeagueFilterBar";

interface LeagueScheduleLayoutProps {
  readonly params: { id: string };
  readonly children: React.ReactNode;
}

export default async function LeagueScheduleLayout({ children, params: { id } }: LeagueScheduleLayoutProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  return (
    <TableView
      header={
        <TableViewHeader
          title="Schedule"
          description="Upcoming games for this league."
          filterBar={<LeagueFilterBar league={id} user={user} />}
        />
      }
    >
      {children}
    </TableView>
  );
}
