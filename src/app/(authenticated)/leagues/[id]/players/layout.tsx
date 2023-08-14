import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { Loading } from "~/components/loading/Loading";
import { TableView } from "~/components/views/TableView";
import { TableViewHeader } from "~/components/views/TableViewHeader";
import { getAuthUser } from "~/server/auth";

import { LeagueFilterBar } from "../LeagueFilterBar";

const CreatePlayerButton = dynamic(() => import("./CreatePlayerButton"), {
  ssr: false,
  // TODO: Do we need the loading indicator here?
  loading: () => <Loading loading={true} />,
});

/* const CreatePlayerDrawer = dynamic(() => import("~/components/drawers/CreatePlayerDrawer"), {
     ssr: false,
     loading: () => <Loading loading={true} style={{ width: 400 }} />,
   }); */

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
          actions={[
            <CreatePlayerButton
              key="0"
              renderDrawer={async () => {
                "use server";
                return <></>;
              }}
            />,
          ]}
        />
      }
    >
      {children}
    </TableView>
  );
}
