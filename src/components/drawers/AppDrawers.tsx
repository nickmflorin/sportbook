import dynamic from "next/dynamic";

import { renderCreateLeagueDrawer, renderTeamDrawer } from "./renderers";

const ClientAppDrawers = dynamic(() => import("./ClientAppDrawers"), { ssr: false });

export const AppDrawers = () => (
  <ClientAppDrawers
    drawers={{
      createLeague: {
        render: renderCreateLeagueDrawer,
        params: [],
      },
      leagueTeam: {
        render: renderTeamDrawer,
        params: ["teamId"],
      },
    }}
  />
);
