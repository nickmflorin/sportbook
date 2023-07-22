import { type GameWithResult } from "~/prisma/model";
import { GameScore } from "~/components/games/GameScore";

import { Tile, type TileProps } from "./Tile";

export type ScoreTileProps = Omit<TileProps, "title" | "description"> & {
  readonly game: GameWithResult;
};

export const ScoreTile = ({ game, ...props }: ScoreTileProps): JSX.Element => (
  <Tile {...props}>
    <GameScore game={game} />
  </Tile>
);
