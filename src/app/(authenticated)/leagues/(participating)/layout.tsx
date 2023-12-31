import dynamic from "next/dynamic";

import { getAuthUser } from "~/server/auth";
import { Page } from "~/components/layout/Page";
import { InfoView } from "~/components/views/InfoView";
import { TableView } from "~/components/views/TableView";

import { LeaguesFilterBar } from "./LeaguesFilterBar";
import { ServerCreateLeagueDrawer } from "./ServerCreateLeagueDrawer";

const CreateLeagueButton = dynamic(() => import("./CreateLeagueButton"));

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
        header={[
          <InfoView key="0" title="Your Leagues" description="Leagues you are participating in." />,
          <LeaguesFilterBar key="1" />,
        ]}
      >
        {children}
      </TableView>
      ;
    </Page>
  );
}
