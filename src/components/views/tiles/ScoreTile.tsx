import { GameScore } from "~/components/views/GameScore";
import { type GameWithResult } from "~/prisma/model";

import { Tile, type TileProps } from "./Tile";

export type ScoreTileProps = Omit<TileProps, "title" | "description"> & {
  readonly game: GameWithResult;
};

export const ScoreTile = ({ game, ...props }: ScoreTileProps): JSX.Element => (
  <Tile {...props}>
    <GameScore game={game} />
  </Tile>
);
