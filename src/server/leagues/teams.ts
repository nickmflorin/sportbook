import { type Team } from "@prisma/client";

import { prisma } from "~/prisma/client";
import {
  type TeamStats,
  TeamStatMetric,
  GameLocation,
  GameResultType,
  type MinimumViableStatGame,
} from "~/prisma/model";

import { getGameResultType, getGameLocation } from "../games";

const GameResultPoints: { [key in GameResultType]: number } = {
  [GameResultType.WIN]: 2,
  [GameResultType.LOSS]: 0,
  [GameResultType.TIE]: 1,
};

const INITIAL_TEAM_STATS: Omit<TeamStats, "leagueRank"> = {
  [TeamStatMetric.WINS]: {
    [GameLocation.HOME]: 0,
    [GameLocation.AWAY]: 0,
    total: 0,
  },
  [TeamStatMetric.LOSSES]: {
    [GameLocation.HOME]: 0,
    [GameLocation.AWAY]: 0,
    total: 0,
  },
  [TeamStatMetric.TIES]: {
    [GameLocation.HOME]: 0,
    [GameLocation.AWAY]: 0,
    total: 0,
  },
  [TeamStatMetric.POINTS]: {
    [GameLocation.HOME]: 0,
    [GameLocation.AWAY]: 0,
    total: 0,
  },
  [TeamStatMetric.GAMES_PLAYED]: {
    [GameLocation.HOME]: 0,
    [GameLocation.AWAY]: 0,
    total: 0,
  },
};

const getFinishedTeamGames = async (team: Team | Team["id"]): Promise<MinimumViableStatGame[]> => {
  const teamId = typeof team === "string" ? team : team.id;
  return (await prisma.game.findMany({
    include: { result: true },
    where: {
      result: { isNot: null },
      OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
    },
  })) as MinimumViableStatGame[];
};

export type TeamGameMap<G extends MinimumViableStatGame> = Record<Team["id"], G[]>;

export type TeamGameInfo<G extends MinimumViableStatGame> = TeamGameMap<G> | G[];

const _generateTeamStats = <G extends MinimumViableStatGame>(team: Team | Team["id"], games: G[]) =>
  games.reduce((prev: Omit<TeamStats, "leagueRank">, game: G) => {
    const resultType = getGameResultType(team, game);
    if (typeof team !== "string" && game.leagueId !== team.leagueId) {
      throw new Error(
        `The provided team '${team.id}' does not belong to the same league, '${game.leagueId}', as the game, '${game.id}'.`,
      );
    }
    let newStats = { ...prev };
    switch (resultType) {
      case GameResultType.WIN:
        newStats = {
          ...newStats,
          [TeamStatMetric.WINS]: {
            ...prev[TeamStatMetric.WINS],
            [getGameLocation(team, game)]: newStats[TeamStatMetric.WINS][getGameLocation(team, game)] + 1,
            total: newStats[TeamStatMetric.WINS].total + 1,
          },
        };
        break;
      case GameResultType.LOSS:
        newStats = {
          ...newStats,
          [TeamStatMetric.LOSSES]: {
            ...newStats[TeamStatMetric.LOSSES],
            [getGameLocation(team, game)]: newStats[TeamStatMetric.LOSSES][getGameLocation(team, game)] + 1,
            total: newStats[TeamStatMetric.LOSSES].total + 1,
          },
        };
        break;
      case GameResultType.TIE:
        newStats = {
          ...newStats,
          [TeamStatMetric.TIES]: {
            ...prev[TeamStatMetric.TIES],
            [getGameLocation(team, game)]: newStats[TeamStatMetric.TIES][getGameLocation(team, game)] + 1,
            total: newStats[TeamStatMetric.TIES].total + 1,
          },
        };
        break;
    }
    return {
      ...newStats,
      [TeamStatMetric.POINTS]: {
        ...newStats[TeamStatMetric.POINTS],
        [getGameLocation(team, game)]:
          newStats[TeamStatMetric.POINTS][getGameLocation(team, game)] + GameResultPoints[resultType],
        total: newStats[TeamStatMetric.POINTS].total + GameResultPoints[resultType],
      },
      [TeamStatMetric.GAMES_PLAYED]: {
        ...newStats[TeamStatMetric.GAMES_PLAYED],
        [getGameLocation(team, game)]: newStats[TeamStatMetric.GAMES_PLAYED][getGameLocation(team, game)] + 1,
        total: newStats[TeamStatMetric.GAMES_PLAYED].total + 1,
      },
    };
  }, INITIAL_TEAM_STATS);

/* If the games are provided as an array, they must all be valid games for that team.  An error will be thrown in the
   above logic if they are not. */
export const generateTeamStats = <G extends MinimumViableStatGame>(team: Team | Team["id"], games: TeamGameInfo<G>) => {
  if (Array.isArray(games)) {
    if (new Set(games.map(game => game.id)).size !== games.length) {
      throw new Error("Detected duplicate games when generating team stats.");
    }
    return _generateTeamStats(team, games);
  }
  const teamId = typeof team === "string" ? team : team.id;
  const _games = games[teamId];
  if (_games === undefined) {
    throw new Error(`The provided mapping of games does not include a set of games for team with ID '${teamId}'.`);
  } else if (new Set(_games.map(game => game.id)).size !== _games.length) {
    throw new Error("Detected duplicate games when generating team stats.");
  }
  return _generateTeamStats(team, _games);
};

export const fetchTeamStats = async <G extends MinimumViableStatGame>(
  team: Team | Team["id"],
): Promise<Omit<TeamStats, "leagueRank">> => {
  const games = (await getFinishedTeamGames(team)) as G[];
  return generateTeamStats(team, games);
};
