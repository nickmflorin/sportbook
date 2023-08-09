import dynamic from "next/dynamic";

import { Loading } from "~/components/loading/Loading";

import { ServerCreateLeagueDrawer, ServerTeamDrawer } from "./renderers";

const ClientAppDrawers = dynamic(() => import("./ClientAppDrawers"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

export const AppDrawers = () => (
  <ClientAppDrawers
    drawers={{
      createLeague: {
        render: ServerCreateLeagueDrawer,
        params: [],
      },
      leagueTeam: {
        render: ServerTeamDrawer,
        params: ["teamId"],
      },
    }}
  />
);
