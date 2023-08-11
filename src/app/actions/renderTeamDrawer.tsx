"use server";
import dynamic from "next/dynamic";

import { Loading } from "~/components/loading/Loading";

/* The drawer has to be dynamically loaded to prevent the entire table from being put into a loading state when the
   drawer is opened. */
const TeamDrawer = dynamic(() => import("~/components/drawers/TeamDrawer"), {
  loading: () => <Loading loading={true} />,
});

interface RenderTeamDrawerParams {
  readonly id: string;
}

export const renderTeamDrawer = async ({ id }: RenderTeamDrawerParams) => <TeamDrawer teamId={id} />;
