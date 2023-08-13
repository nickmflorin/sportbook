"use server";
import dynamic from "next/dynamic";

import { PlayerDrawer } from "~/components/drawers/PlayerDrawer";
import { Loading } from "~/components/loading/Loading";

/* The drawer has to be dynamically loaded to prevent the entire table from being put into a loading state when the
   drawer is opened. */
/* const PlayerDrawer = dynamic(() => import("~/components/drawers/PlayerDrawer"), {
     loading: () => <Loading loading={true} />,
   }); */

interface RenderPlayerDrawerParams {
  readonly id: string;
}

export const renderPlayerDrawer = async ({ id }: RenderPlayerDrawerParams) => <PlayerDrawer playerId={id} />;
