import { GameTile, type GameTileGame } from "./tiles";
import { TilesView, type TilesViewDataProps } from "./TilesView";
import { type WithViewProps } from "./View";

export type GameTilesViewProps = WithViewProps<Omit<TilesViewDataProps<GameTileGame>, "renderItem">>;

export const GameTilesView = ({ data, ...props }: GameTilesViewProps): JSX.Element => (
  <TilesView {...props} data={data} renderItem={game => <GameTile game={game} />} />
);

export default GameTilesView;
