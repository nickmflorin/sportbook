import { type Team } from "~/prisma/model";

import { TeamTile } from "./tiles";
import { TilesView, type TilesViewDataProps } from "./TilesView";
import { type WithViewProps } from "./View";

type Tm = Pick<Team, "name" | "color"> & {
  readonly fileUrl: string | null;
};

export type TeamTilesViewProps = WithViewProps<Omit<TilesViewDataProps<Tm>, "renderItem">>;

export const TeamTilesView = ({ data, ...props }: TeamTilesViewProps): JSX.Element => (
  <TilesView {...props} data={data} renderItem={team => <TeamTile team={team} />} />
);

export default TeamTilesView;
