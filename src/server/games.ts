import { type Team, type Game } from "@prisma/client";

import { GameLocation, type MinimumViableStatGame, GameResultType } from "~/prisma/model";

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
  (game.awayTeamId === _getTeamId(team, game) && game.result.awayScore < game.result.homeScore);

export const getGameResultType = (team: Team | Team["id"], game: MinimumViableStatGame): GameResultType => {
  if (gameWasWon(team, game)) {
    return GameResultType.WIN;
  } else if (gameWasLost(team, game)) {
    return GameResultType.LOSS;
  } else if (gameWasTied(team, game)) {
    return GameResultType.TIE;
  }
  throw new Error("Unexpected Condition: Game was never lost, tied or won.");
};
