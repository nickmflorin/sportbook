import dynamic from "next/dynamic";
import { headers } from "next/headers";

import { parseQueryParams } from "~/lib/util/urls";
import { type QueryParamDrawerType } from "~/components/drawers/Drawer";
import { Loading } from "~/components/loading/Loading";

/* The drawer has to be dynamically loaded to prevent the entire table from being put into a loading state when the
   drawer is opened. */
const TeamDrawer = dynamic(() => import("~/components/drawers/TeamDrawer"), {
  loading: () => <Loading loading={true} />,
});

const PlayerDrawer = dynamic(() => import("~/components/drawers/PlayerDrawer"), {
  loading: () => <Loading loading={true} />,
});

const Drawer = dynamic(() => import("~/components/drawers/Drawer"), {
  loading: () => <Loading loading={true} />,
}) as QueryParamDrawerType;

export const LeagueDrawers = async () => {
  /* Note: We cannot use the 'useSearchParams' (or related) hooks from next/navigation in a layout - which is slightly
     problematic because our drawers need to be rendered in the layout so that they persist between page changes for
     pages inside of the layout.  Additionally, this would mean that when a user visits a page with a drawer-related
     query string parameter in the URL, the content will be prerendered without the drawer (since it requires the query
     parameters) and then the drawer will appear once the page is rendered in the client and the component can access
     the query parameters required to render the drawer.  Instead, if a user visits a URL that has query parameters in
     it that should cause a specific drawer that depends on those parameters to appear, we want the query parameters in
     the URL to be used to render the initial, server pre-rendered drawer content, such that the drawer does not appear
     after the prerender in an unpleasing fashion.

     To do this, we can parse the query parameters off of the  headers and use those parameters to initialize the drawer
     content on the page so it is included in the pre-rendered, server content.  However, this should *only* be used for
     the initial content of the drawer - because the 'next-url' will only be available on the first render (the server
      side pre-render).  */
  const headersData = headers();
  const teamParsed = parseQueryParams(headersData, { params: ["teamid"] });
  const playerParsed = parseQueryParams(headersData, { params: ["playerid"] });

  let initialTeamContent: JSX.Element | null = null;
  let initialPlayerContent: JSX.Element | null = null;
  if (teamParsed) {
    initialTeamContent = <TeamDrawer teamId={teamParsed.teamid} />;
  }
  if (playerParsed) {
    initialPlayerContent = <PlayerDrawer playerId={playerParsed.playerid} />;
  }
  return (
    <>
      <Drawer<"teamid">
        instanceId="team-drawer"
        initial={teamParsed !== null ? { content: initialTeamContent, params: teamParsed } : undefined}
        insideView={false}
        params={["teamid"]}
      >
        {async params => {
          "use server";
          return <TeamDrawer teamId={params.teamid} />;
        }}
      </Drawer>
      <Drawer<"playerid">
        instanceId="player-drawer"
        initial={playerParsed !== null ? { content: initialPlayerContent, params: playerParsed } : undefined}
        insideView={false}
        params={["playerid"]}
      >
        {async params => {
          "use server";
          return <PlayerDrawer playerId={params.playerid} />;
        }}
      </Drawer>
    </>
  );
};

export default LeagueDrawers;
