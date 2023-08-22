import { type Team, type GameResult, type Game } from "@prisma/client";

import { type ModelWithFileUrl } from "./base";

export enum GameResultType {
  WIN = "win",
  LOSS = "loss",
  TIE = "tie",
}

export enum GameLocation {
  HOME = "home",
  AWAY = "away",
}

export type GameWithResult = Game & {
  readonly result: GameResult;
  readonly homeTeam: ModelWithFileUrl<"Team">;
  readonly awayTeam: ModelWithFileUrl<"Team">;
};

export type GameWithTeams = GameWithResult & { readonly awayTeam: Team; readonly homeTeam: Team };

export type TeamGame<G extends GameWithResult = GameWithResult> = G & {
  readonly resultType: GameResultType;
  readonly score: number;
  readonly opponentScore: number;
  readonly opponentId: string;
};

export type TeamGameWithOpponent<G extends GameWithResult = GameWithResult> = G & {
  readonly resultType: GameResultType;
  readonly score: number;
  readonly opponentScore: number;
  readonly opponentId: string;
  readonly opponent: Team;
};
