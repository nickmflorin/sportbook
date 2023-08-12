import { prisma } from "~/prisma/client";
import {
  type GameWithResult,
  type TeamWithStats,
  Sport,
  type League,
  HockeyLeagueStandingsMethod,
  type Team,
  type TeamStats,
  GameStatus,
} from "~/prisma/model";

import { getLeagueConfig, type LeagueConfig } from "./config";
import { type TeamGameMap, generateTeamStats } from "./teams";

type Comparator = (
  a: TeamWithStats<Team, Exclude<keyof TeamStats, "leagueRank">>,
  b: TeamWithStats<Team, Exclude<keyof TeamStats, "leagueRank">>,
) => number;

const Comparators: { [key in HockeyLeagueStandingsMethod]: Comparator } = {
  [HockeyLeagueStandingsMethod.POINTS]: (a, b) => b.stats.points.total - a.stats.points.total,
  [HockeyLeagueStandingsMethod.RECORD]: (a, b) => b.stats.points.total - a.stats.points.total,
};

export const rankHockeyTeams = async <T extends Team>(
  teams: T[],
  config: LeagueConfig<"HOCKEY">,
): Promise<TeamWithStats<T>[]> => {
  if (teams.length === 0) {
    return [];
  }
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
  /* The number of league IDs will only be 0 if there are no teams - which we already validated in the initial line of
     the function.  If there are more than one league IDs, it means that the provided teams belong to more than one
     league. */
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
    .reduce(
      (
        prev: TeamWithStats<T>[],
        tm: TeamWithStats<T, Exclude<keyof TeamStats, "leagueRank">>,
        i,
      ): TeamWithStats<T>[] => [...prev, { ...tm, stats: { ...tm.stats, leagueRank: i + 1 } }],
      [],
    );
};

export const rankTeams = async <T extends Team, S extends Sport = Sport>(
  teams: T[],
  config: LeagueConfig<S>,
): Promise<TeamWithStats<T>[]> => {
  switch (config.sport) {
    case Sport.HOCKEY:
      return await rankHockeyTeams(teams, config);
  }
};

export async function getLeagueStandings(league: League | League["id"]): Promise<TeamWithStats[]>;

export async function getLeagueStandings<T extends Team>(
  league: League | League["id"],
  teams: T[],
): Promise<TeamWithStats<T>[]>;

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

const argIsOptions = (arg: League | { strict: boolean }): arg is { strict: boolean } =>
  (arg as { strict: boolean }).strict !== undefined;

export async function getTeamStats(team: string, options: { strict: false }): Promise<TeamStats | null>;
export async function getTeamStats(team: Team | string): Promise<TeamStats>;
export async function getTeamStats(team: Team, league: League): Promise<TeamStats>;
export async function getTeamStats(team: Team, league: League, teams: Team[]): Promise<TeamStats>;

export async function getTeamStats(
  arg1: Team | string,
  arg2?: League | { strict: false } | undefined,
  arg3?: Team[],
): Promise<TeamStats | null> {
  const safeReturn = async (id: string, promise: Promise<TeamWithStats[]>): Promise<TeamStats> => {
    const awaited = await promise;
    const result = awaited.find(t => t.id === id);
    if (!result) {
      throw new Error(`Team with ID '${id}' not found in team standings for league!`);
    }
    return result.stats;
  };
  if (typeof arg1 === "string") {
    if (arg2 && !argIsOptions(arg2)) {
      throw new Error("Invalid arguments provided to getTeamStats.");
    }
    let team: Team & { readonly league: League & { readonly teams: Team[] } };
    // The query should only be treated as not strict if explicitly specified as false.
    if (arg2?.strict === false) {
      const _team = await prisma.team.findUnique({
        where: { id: arg1 },
        include: { league: { include: { teams: true } } },
      });
      if (_team) {
        team = _team;
      } else {
        return null;
      }
    } else {
      team = await prisma.team.findUniqueOrThrow({
        where: { id: arg1 },
        include: { league: { include: { teams: true } } },
      });
    }
    return safeReturn(team.id, getLeagueStandings(team.league, team.league.teams));
  } else if (arg2 && !argIsOptions(arg2)) {
    if (arg1.leagueId !== arg2.id) {
      throw new Error(`The provided team '${arg1.id}' does not belong to the provided league '${arg2.id}'.`);
    } else if (arg3) {
      return safeReturn(arg1.id, getLeagueStandings(arg2, arg3));
    }
    return safeReturn(arg1.id, getLeagueStandings(arg2));
  }
  throw new Error("Invalid arguments provided to getTeamStats.");
}
