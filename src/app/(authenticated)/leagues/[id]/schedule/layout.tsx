import { redirect } from "next/navigation";

import { getAuthUser } from "~/server/auth";
import { InfoView } from "~/components/views/InfoView";
import { TableView } from "~/components/views/TableView";

import { LeagueFilterBar } from "../LeagueFilterBar";

interface LeagueScheduleLayoutProps {
  readonly params: { id: string };
  readonly children: React.ReactNode;
}

export default async function LeagueScheduleLayout({ children, params: { id } }: LeagueScheduleLayoutProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  return (
    <TableView
      header={[
        <InfoView key="0" title="Schedule" description="Upcoming games for this league." />,
        <LeagueFilterBar key="1" league={id} user={user} />,
      ]}
    >
      {children}
    </TableView>
  );
}
