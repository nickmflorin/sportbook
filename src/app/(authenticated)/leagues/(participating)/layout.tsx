import dynamicImport from "next/dynamic";

import { prisma } from "~/prisma/client";
import { Page } from "~/components/layout/Page";
import { Loading } from "~/components/loading";
import { TableView } from "~/components/tables/TableView";
import { TableViewHeader } from "~/components/tables/TableViewHeader";
import { getAuthUser } from "~/server/auth";

import { LeaguesFilterBar } from "./LeaguesFilterBar";

const CreateLeagueButton = dynamicImport(() => import("./CreateLeagueButton"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

interface LeaguesProps {
  readonly children: React.ReactNode;
}

export const dynamic = "force-dynamic";

export default async function Leagues({ children }: LeaguesProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });

  const locations = await prisma.location.findMany({ where: { createdById: user.id } });

  return (
    <Page
      title="Leagues"
      headerProps={{
        actions: [<CreateLeagueButton key="0" locations={locations} />],
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
