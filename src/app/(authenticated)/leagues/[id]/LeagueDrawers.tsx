import dynamic from "next/dynamic";

import { type QueryParamDrawerType } from "~/components/drawers/QueryParamDrawer";
import { Loading } from "~/components/loading/Loading";

/* The drawer has to be dynamically loaded to prevent the entire table from being put into a loading state when the
   drawer is opened. */
const TeamDrawer = dynamic(() => import("~/components/drawers/TeamDrawer"), {
  loading: () => <Loading loading={true} />,
  ssr: false,
});

const PlayerDrawer = dynamic(() => import("~/components/drawers/PlayerDrawer"), {
  loading: () => <Loading loading={true} />,
  ssr: false,
});

const QueryParamDrawer = dynamic(() => import("~/components/drawers/QueryParamDrawer"), {
  loading: () => <Loading loading={true} />,
  ssr: false,
}) as QueryParamDrawerType;

export const Drawers = () => (
  <>
    <QueryParamDrawer<"teamId">
      drawerProps={{ slot: 1, insideView: false, instanceId: "team-drawer" }}
      params={["teamId"]}
    >
      {async params => {
        "use server";
        return <TeamDrawer {...params} />;
      }}
    </QueryParamDrawer>
    <QueryParamDrawer<"playerId">
      drawerProps={{ slot: 2, insideView: false, instanceId: "player-drawer" }}
      params={["playerId"]}
    >
      {async params => {
        "use server";
        return <PlayerDrawer {...params} />;
      }}
    </QueryParamDrawer>
  </>
);

export default Drawers;
