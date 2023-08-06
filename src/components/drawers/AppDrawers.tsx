import dynamic from "next/dynamic";

import { renderCreateLeagueDrawer } from "./ServerCreateLeagueDrawer";

const ClientAppDrawers = dynamic(() => import("./ClientAppDrawers"), { ssr: false });

export const AppDrawers = () => (
  <ClientAppDrawers drawerContent={{ createLeague: renderCreateLeagueDrawer, leagueTeam: null }} />
);
