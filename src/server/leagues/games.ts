import { type Team, type Game } from "@prisma/client";

import {
  GameLocation,
  type GameWithResult,
  type GameResult,
  GameResultType,
  type GameWithTeams,
  type TeamGame,
  type TeamGameWithOpponent,
} from "~/prisma/model";

export type MinimumViableStatGame = Pick<Game, "id" | "awayTeamId" | "homeTeamId" | "leagueId"> & {
  readonly result: Pick<GameResult, "homeScore" | "awayScore">;
};

const _getTeamId = (team: Team | Team["id"], game: Pick<Game, "id" | "awayTeamId" | "homeTeamId">): string => {
  const teamId = typeof team === "string" ? team : team.id;
  if (teamId !== game.homeTeamId && teamId !== game.awayTeamId) {
    throw new Error(
      `The team ID '${teamId}' is not associated with either the home team ID '${game.homeTeamId}' or the away team ID '${game.awayTeamId}' in game with ID ${game.id}.'`,
    );
  } else if (game.homeTeamId === game.awayTeamId) {
    throw new Error(
      `The home team ID '${game.homeTeamId}' and the away team ID '${game.awayTeamId}' are the same in game with ID ${game.id}.'`,
    );
  }
  return teamId;
};

export const getGameLocation = (
  team: Team | Team["id"],
  game: Pick<Game, "id" | "awayTeamId" | "homeTeamId">,
): GameLocation => (game.homeTeamId === _getTeamId(team, game) ? GameLocation.HOME : GameLocation.AWAY);

export const gameWasHome = (team: Team | Team["id"], game: Pick<Game, "id" | "awayTeamId" | "homeTeamId">): boolean =>
  getGameLocation(team, game) === GameLocation.HOME;

export const gameWasAway = (team: Team | Team["id"], game: Pick<Game, "id" | "awayTeamId" | "homeTeamId">): boolean =>
  getGameLocation(team, game) === GameLocation.AWAY;

export const gameWasWon = (team: Team | Team["id"], game: MinimumViableStatGame): boolean =>
  (game.homeTeamId === _getTeamId(team, game) && game.result.homeScore > game.result.awayScore) ||
  (game.awayTeamId === _getTeamId(team, game) && game.result.awayScore > game.result.homeScore);

export const gameWasLost = (team: Team | Team["id"], game: MinimumViableStatGame): boolean =>
  (game.homeTeamId === _getTeamId(team, game) && game.result.homeScore < game.result.awayScore) ||
  (game.awayTeamId === _getTeamId(team, game) && game.result.awayScore < game.result.homeScore);

export const gameWasTied = (team: Team | Team["id"], game: MinimumViableStatGame): boolean =>
  (game.homeTeamId === _getTeamId(team, game) && game.result.homeScore === game.result.awayScore) ||
  (game.awayTeamId === _getTeamId(team, game) && game.result.awayScore === game.result.homeScore);

export const getGameResultType = (team: Team | Team["id"], game: MinimumViableStatGame): GameResultType => {
  if (gameWasWon(team, game)) {
    return GameResultType.WIN;
  } else if (gameWasLost(team, game)) {
    return GameResultType.LOSS;
  } else if (gameWasTied(team, game)) {
    return GameResultType.TIE;
  }
  const teamId = typeof team === "string" ? team : team.id;
  throw new Error(`Unexpected Condition: Game '${game.id}' was never lost, tied or won, by team '${teamId}'.`);
};

const _isGameWithTeams = (game: GameWithResult | GameWithTeams): game is GameWithTeams =>
  (game as GameWithTeams).homeTeam !== undefined && (game as GameWithTeams).awayTeam !== undefined;

type PerspectiveGameRT<G extends GameWithResult | GameWithTeams> = G extends GameWithTeams
  ? TeamGameWithOpponent<G>
  : TeamGame<G>;

export function putGameInTeamPerspective<G extends GameWithResult | GameWithTeams>(
  team: Team | string,
  game: G,
): PerspectiveGameRT<G> {
  const loc = getGameLocation(team, game);
  const data: TeamGame<G> = {
    ...game,
    resultType: getGameResultType(team, game),
    score: loc === GameLocation.AWAY ? game.result.awayScore : game.result.homeScore,
    opponentScore: loc === GameLocation.AWAY ? game.result.homeScore : game.result.awayScore,
    opponentId: loc === GameLocation.AWAY ? game.homeTeamId : game.awayTeamId,
  };
  if (_isGameWithTeams(game)) {
    const withOpponent: TeamGameWithOpponent<G> = {
      ...data,
      opponent: loc === GameLocation.AWAY ? game.homeTeam : game.awayTeam,
    };
    return withOpponent as PerspectiveGameRT<G>;
  }
  return data as PerspectiveGameRT<G>;
}
