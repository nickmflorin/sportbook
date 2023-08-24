import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { getAuthUser } from "~/server/auth";
import { LeagueFilterBar } from "~/components/filters/LeagueFilterBar";
import { Loading } from "~/components/loading/Loading";

import { getLeague } from "../getLeague";

import { ServerInvitePlayersDrawer } from "./ServerInvitePlayersDrawer";

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
  const league = await getLeague(id, user);

  return (
    <TableView
      header={[
        <InfoView
          key="0"
          title="Players"
          description="The players who are currently registered in this league."
          actions={[
            <CreatePlayerButton
              key="0"
              /* Note: This method causes the users and the teams to be fetched for the drawer immediately when the page
                 is loaded, even if the drawer is not opened.  Unfortunately, since the drawer is opened client side,
                 there isn't an easy way to fetch the data only when the drawer is opened unless we opened the drawer
                 with query params.  For now, we will leave this as is - and revisit later. */
              drawer={<ServerInvitePlayersDrawer league={league} />}
            />,
          ]}
        />,
        <LeagueFilterBar key="1" league={id} user={user} />,
      ]}
    >
      {children}
    </TableView>
  );
}
