import { type Team } from "~/prisma/model";

import { TeamTile, type TeamTileProps } from "./tiles";
import { TilesView, type TilesViewDataProps } from "./TilesView";
import { type WithViewProps } from "./View";

type Tm = Pick<Team, "name" | "color"> & {
  readonly fileUrl: string | null;
};

export type TeamTilesViewProps = WithViewProps<Omit<TilesViewDataProps<Tm, Omit<TeamTileProps, "team">>, "renderItem">>;

export const TeamTilesView = ({ data, ...props }: TeamTilesViewProps): JSX.Element => (
  <TilesView
    {...props}
    data={data}
    renderTile={{ renderer: (team, params) => <TeamTile {...params} team={team} />, isDefault: true }}
  />
);

export default TeamTilesView;
