import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { getAuthUser } from "~/server/auth";
import { LeagueFilterBar } from "~/components/filters/LeagueFilterBar";
import { Loading } from "~/components/loading/Loading";

const TableView = dynamic(() => import("~/components/views/TableView"), {
  loading: () => <Loading loading={true} />,
  ssr: false,
});

const InfoView = dynamic(() => import("~/components/views/InfoView"), {
  loading: () => <Loading loading={true} />,
  ssr: false,
});

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
