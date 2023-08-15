import dynamic from "next/dynamic";

import { Page } from "~/components/layout/Page";
import { Loading } from "~/components/loading/Loading";
import { TableView } from "~/components/views/TableView";
import { TableViewHeader } from "~/components/views/TableViewHeader";
import { getAuthUser } from "~/server/auth";

import { LeaguesFilterBar } from "./LeaguesFilterBar";

const CreateLeagueButton = dynamic(() => import("./CreateLeagueButton"));

const ServerCreateLeagueDrawer = dynamic(() => import("./ServerCreateLeagueDrawer"), {
  loading: () => <Loading loading={true} />,
});

interface LeaguesProps {
  readonly children: React.ReactNode;
}

export default async function Leagues({ children }: LeaguesProps) {
  const user = await getAuthUser({ strict: true });
  return (
    <Page
      title="Leagues"
      headerProps={{
        /* Note: This method causes the locations to be fetched for the drawer immediately when the page is loaded, even
           if the drawer is not opened.  Unfortunately, since the drawer is opened client side, there isn't an easy way
           to fetch the locations only when the drawer is opened unless we opened the drawer with query params.  For
           now, we will leave this as is - and revisit later. */
        actions: [<CreateLeagueButton key="0" drawer={<ServerCreateLeagueDrawer user={user} />} />],
      }}
    >
      <TableView
        header={
          <TableViewHeader
            title="Your Leagues"
            description="Leagues you are participating in."
            filterBar={<LeaguesFilterBar />}
          />
        }
      >
        {children}
      </TableView>
      ;
    </Page>
  );
}
