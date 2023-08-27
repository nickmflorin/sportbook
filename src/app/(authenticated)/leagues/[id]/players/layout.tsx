import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { getAuthUser } from "~/server/auth";
import { LeagueFilterBar } from "~/components/filters/LeagueFilterBar";
import { Loading } from "~/components/loading/Loading";

import { getLeague } from "../getLeague";

const CreatePlayerButton = dynamic(() => import("./InvitePlayersButton"));

const TableView = dynamic(() => import("~/components/views/TableView"), {
  loading: () => <Loading loading={true} />,
  ssr: false,
});

const InfoView = dynamic(() => import("~/components/views/InfoView"), {
  loading: () => <Loading loading={true} />,
  ssr: false,
});

interface LeaguePlayersLayoutProps {
  readonly params: { id: string };
  readonly children: React.ReactNode;
}

export default async function LeaguePlayersLayout({ children, params: { id } }: LeaguePlayersLayoutProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  // We might want to reconsider making this query/fetch - the benefit is the 404 redirection...
  const league = await getLeague(id, user);

  return (
    <TableView
      header={[
        <InfoView
          key="0"
          title="Players"
          description="The players who are currently registered in this league."
          actions={[<CreatePlayerButton key="0" leagueId={league.id} />]}
        />,
        <LeagueFilterBar key="1" league={league.id} user={user} />,
      ]}
    >
      {children}
    </TableView>
  );
}
