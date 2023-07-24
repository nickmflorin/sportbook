import { Sport, type League, HockeyLeagueStandingsMethod, type Team, GameStatus } from "@prisma/client";

import { prisma } from "~/prisma/client";
import { type GameWithResult, type TeamWithStats, type TeamStanding } from "~/prisma/model";

import { type TeamGameMap, generateTeamStats } from "../teams";

import { getLeagueConfig, type LeagueConfig } from "./config";

type Comparator = (a: TeamWithStats, b: TeamWithStats) => number;

const Comparators: { [key in HockeyLeagueStandingsMethod]: Comparator } = {
  [HockeyLeagueStandingsMethod.POINTS]: (a, b) => b.stats.points.total - a.stats.points.total,
  [HockeyLeagueStandingsMethod.RECORD]: (a, b) => b.stats.points.total - a.stats.points.total,
};

export const rankHockeyTeams = async <T extends Team>(
  teams: T[],
  config: LeagueConfig<"HOCKEY">,
): Promise<TeamStanding<T>[]> => {
  const games = (await prisma.game.findMany({
    include: { result: true },
    where: {
      result: { isNot: null },
      status: GameStatus.FINAL,
      OR: [{ homeTeamId: { in: teams.map(t => t.id) } }, { awayTeamId: { in: teams.map(t => t.id) } }],
    },
    // Prisma does not seem to recognize the { result: { isNot: null } } argument in terms of the resulting type.
  })) as GameWithResult[];

  // Sanity Checks -- These may be temporary
  const leagueIds = new Set(teams.map(team => team.leagueId));
  if (leagueIds.size !== 1) {
    throw new Error("The provided teams belong to multiple different leagues.");
  }
  const leagueId = [...leagueIds][0];
  games.forEach(game => {
    if (game.leagueId !== leagueId) {
      throw new Error(
        `Detected a game with ID '${game.id}' that does not belong to same league as teams, '${leagueId}'.`,
      );
    } else if (game.homeTeamId === game.awayTeamId) {
      throw new Error(`Detected a game with ID '${game.id}' that has the same team as the away and home team.`);
    }
  });

  const initialMap: TeamGameMap<GameWithResult> = teams.reduce(
    (prev: TeamGameMap<GameWithResult>, curr: T) => ({ ...prev, [curr.id]: [] as GameWithResult[] }),
    {},
  );
  // Note: A single game will belong to multiple teams.
  const gameMap: TeamGameMap<GameWithResult> = games.reduce(
    (prev: TeamGameMap<GameWithResult>, curr: GameWithResult) => ({
      ...prev,
      [curr.homeTeamId]: [...(prev[curr.homeTeamId] || []), curr],
      [curr.awayTeamId]: [...(prev[curr.awayTeamId] || []), curr],
    }),
    initialMap,
  );
  if (new Set(teams.map(t => t.id)).size !== teams.length) {
    throw new Error("Detected duplicate teams when generating league standings.");
  }
  const teamsWithStats = teams.map(team => ({ ...team, stats: generateTeamStats(team, gameMap) }));
  // TODO: We need to configure tie breakers.
  return teamsWithStats
    .sort(Comparators[config.standingsMethod])
    .reduce((prev: TeamStanding<T>[], tm: TeamWithStats<T>, i) => [...prev, { ...tm, leagueRank: i + 1 }], []);
};

export const rankTeams = async <T extends Team, S extends Sport = Sport>(
  teams: T[],
  config: LeagueConfig<S>,
): Promise<TeamStanding<T>[]> => {
  switch (config.sport) {
    case Sport.HOCKEY:
      return await rankHockeyTeams(teams, config);
  }
};

export async function getLeagueStandings(league: League | League["id"]): Promise<TeamStanding[]>;

export async function getLeagueStandings<T extends Team>(
  league: League | League["id"],
  teams: T[],
): Promise<TeamStanding<T>[]>;

export async function getLeagueStandings<T extends Team>(league: League | League["id"], teams?: T[]) {
  const config = await getLeagueConfig(league);
  const leagueId = typeof league === "string" ? league : league.id;
  if (teams) {
    const teamsNotInLeague = teams.filter(team => team.leagueId !== leagueId);
    if (teamsNotInLeague.length !== 0) {
      throw new Error(`Detected team(s) '${teamsNotInLeague.join(", ")}' that do not belong to league '${leagueId}'.`);
    }
    return rankTeams(teams, config);
  }
  const _teams = await prisma.team.findMany({ where: { leagueId: typeof league === "string" ? league : league.id } });
  return rankTeams(_teams, config);
}
