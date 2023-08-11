import dynamic from "next/dynamic";

import { prisma } from "~/prisma/client";
import { Page } from "~/components/layout/Page";
import { Loading } from "~/components/loading/Loading";
import { TableView } from "~/components/views/TableView";
import { TableViewHeader } from "~/components/views/TableViewHeader";
import { getAuthUser } from "~/server/auth";

import { LeaguesFilterBar } from "./LeaguesFilterBar";

const CreateLeagueButton = dynamic(() => import("./CreateLeagueButton"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

const CreateLeagueDrawer = dynamic(() => import("~/components/drawers/CreateLeagueDrawer"), {
  ssr: false,
  loading: () => <Loading loading={true} style={{ width: 400 }} />,
});

interface LeaguesProps {
  readonly children: React.ReactNode;
}

export default async function Leagues({ children }: LeaguesProps) {
  return (
    <Page
      title="Leagues"
      headerProps={{
        actions: [
          <CreateLeagueButton
            key="0"
            renderDrawer={async () => {
              "use server";
              const user = await getAuthUser({ strict: true });
              const locations = await prisma.location.findMany({ where: { createdById: user.id } });
              return <CreateLeagueDrawer locations={locations} />;
            }}
          />,
        ],
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
