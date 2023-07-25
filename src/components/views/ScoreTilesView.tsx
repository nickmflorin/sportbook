import { type GameWithResult } from "~/prisma/model";

import { ScoreTile } from "./tiles";
import { TilesView, type TilesViewDataProps } from "./TilesView";
import { type WithViewProps } from "./View";

export type ScoreTilesViewProps = WithViewProps<Omit<TilesViewDataProps<GameWithResult>, "renderItem">>;

export const ScoreTilesView = ({ data, ...props }: ScoreTilesViewProps): JSX.Element => (
  <TilesView {...props} data={data} renderTile={(game, params) => <ScoreTile {...params} game={game} />} />
);

export default ScoreTilesView;
