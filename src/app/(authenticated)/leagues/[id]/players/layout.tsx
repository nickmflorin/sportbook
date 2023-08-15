import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { Loading } from "~/components/loading/Loading";
import { TableView } from "~/components/views/TableView";
import { TableViewHeader } from "~/components/views/TableViewHeader";
import { getAuthUser } from "~/server/auth";

import { getLeague } from "../getLeague";
import { LeagueFilterBar } from "../LeagueFilterBar";

const CreatePlayerButton = dynamic(() => import("./InvitePlayersButton"), {
  ssr: false,
  // TODO: Do we need the loading indicator here?
  loading: () => <Loading loading={true} />,
});

const ServerInvitePlayersDrawer = dynamic(() => import("./ServerInvitePlayersDrawer"), {
  loading: () => <Loading loading={true} />,
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
      header={
        <TableViewHeader
          title="Players"
          description="The players who are currently registered in this league."
          filterBar={<LeagueFilterBar league={id} user={user} />}
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
        />
      }
    >
      {children}
    </TableView>
  );
}
