import { type Game, type GameResult } from "@prisma/client";

import { type ModelWithFileUrl } from "./types";

export type GameWithResult = Game & {
  readonly result: GameResult;
  readonly homeTeam: ModelWithFileUrl<"Team">;
  readonly awayTeam: ModelWithFileUrl<"Team">;
};
