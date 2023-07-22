import { type Game, type Team } from "~/prisma/model";
import { ModelImage } from "~/components/images/ModelImage";

import { Tile, type TileProps } from "./Tile";
import { Versus } from "./Versus";

type TeamWithImage = Team & {
  readonly fileUrl: string | null;
};

export type GameTileGame = Game & { readonly homeTeam: TeamWithImage; readonly awayTeam: TeamWithImage };

export type GameTileProps = Omit<TileProps, "title" | "description"> & {
  readonly game: GameTileGame;
};

export const GameTile = ({ game, ...props }: GameTileProps): JSX.Element => (
  <Tile {...props}>
    <Versus style={{ height: 70 }} homeTeam={game.homeTeam} awayTeam={game.awayTeam} />
  </Tile>
);
