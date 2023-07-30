/* eslint-disable no-console -- This script runs outside of the logger context. */
import { type League, type Team, type Game, GameStatus, GameVisitationType } from "@prisma/client";

import { permutationsAtCount } from "~/lib/util/math";
import {
  randomInt,
  selectAtRandom,
  selectAtRandomFrequency,
  generateRandomDate,
  selectArrayAtRandom,
  getLength,
} from "~/lib/util/random";

import { prisma } from "../client";
import { getModelMeta } from "../model";

import { type SeedContext, type GetUser } from "./types";

/**
 * A matchup, {@link Matchup}, is defined as a set of two distinct teams, where one {@link Team} is home (the first
 * element in the array) and the other {@link Team} is away (the second element in the array).
 */
type Matchup = [Team, Team];

/**
 * A Visitation Pair is defined as a set of two {@link Matchup}(s) between a set of two of the same teams, where each
 * team is home and away once.  In other words, a Visitation Pair of Team A and Team B would look like the following:
 *
 *   [Team A, Team B], [Team B, Team A]
 *
 * This variable defines the number of Visitation Pair(s) that are generated for each set of 2 distinct {@link Team}(s)
 * in the league, {@link League}, when seeding.
 */
const NUM_MATCHUP_VISITATION_PAIRS = 2;

/* The number of matchups that do not have an associated GameResult.  Their statuses will still be FINAL, but they will
   not have a GameResult record.  This allows the number of "Games Played" for a given Team to be randomly different to
   a slight degree than other Team(s) in the same League. */
const NUM_UNPLAYED_MATCHUPS = { min: 0.4, max: 0.6 };

// The number of additional matchups that should be included with randomly generated, non-FINAL statuses.
const NUM_ADDITIONAL_MATCHUPS = { min: 1, max: 4 };

const CANCELLATION_REASONS = [
  "Not enough players that wanted to play.",
  "Anticipating bad weather!",
  "There is a holiday that day and we will wait until people are back in town.",
  null,
];

// Eventually, these will likely depend on the specific sport the league and teams are associated with.
const MAX_SCORE = 7;
const MIN_SCORE = 0;

const getForfeitingTeamVisitation = ({
  hasBeenForfeited,
}: {
  hasBeenForfeited?: boolean;
}): GameVisitationType | null => {
  // The result is being forced to a forfeiting team.
  if (hasBeenForfeited === true) {
    return selectAtRandomFrequency([
      { value: GameVisitationType.HOME, frequency: 0.5 },
      { value: GameVisitationType.AWAY, frequency: 0.5 },
    ]);
  } else if (hasBeenForfeited === false) {
    return null;
  } else {
    return selectAtRandomFrequency([
      { value: GameVisitationType.HOME, frequency: 0.05 },
      { value: GameVisitationType.AWAY, frequency: 0.05 },
      { value: null, frequency: 0.9 },
    ]);
  }
};

const createGame = async (
  league: League,
  matchup: Matchup,
  {
    status,
    hasBeenPlayed,
    hasBeenForfeited,
    ...ctx
  }: SeedContext & {
    getParticipant: GetUser;
    status?: GameStatus;
    hasBeenPlayed?: boolean;
    hasBeenForfeited?: boolean;
  },
): Promise<Game> => {
  let cancellationReason: Game["cancellationReason"] = null;

  if (matchup[0].id === matchup[1].id) {
    throw new Error("The home team cannot be the same as the away team.");
  }
  // If the game status is not provided, randomly generate a status with the below probability distribution.
  const gameStatus =
    status ||
    selectAtRandomFrequency([
      { value: GameStatus.CANCELLED, frequency: 0.05 },
      { value: GameStatus.PROPOSED, frequency: 0.25 },
      { value: GameStatus.FINAL, frequency: 0.6 },
      { value: GameStatus.POSTPONED, frequency: 0.1 },
    ]);
  if (gameStatus === GameStatus.CANCELLED) {
    cancellationReason = selectAtRandom(CANCELLATION_REASONS);
  }
  const game = await prisma.game.create({
    data: {
      ...getModelMeta("Game", { getUser: ctx.getParticipant }),
      status: gameStatus,
      cancellationReason,
      dateTime: generateRandomDate(),
      leagueId: league.id,
      homeTeamId: matchup[0].id,
      awayTeamId: matchup[1].id,
    },
  });
  if (gameStatus === GameStatus.FINAL) {
    /* A GameStatus of FINAL does not mean the Game has been played - it just means the Game is not cancelled,
       postponed, or still in a proposed state.  The determination of whether or not the Game has been played is made
       based on the presence of the associated GameResult model. */
    const _hasBeenPlayed =
      hasBeenPlayed !== undefined
        ? hasBeenPlayed
        : selectAtRandomFrequency([
            { value: true, frequency: 0.7 },
            { value: false, frequency: 0.3 },
          ]);
    if (_hasBeenPlayed) {
      await prisma.gameResult.create({
        data: {
          ...getModelMeta("GameResult", { getUser: ctx.getParticipant }),
          gameId: game.id,
          homeScore: randomInt({ min: MIN_SCORE, max: MAX_SCORE }),
          awayScore: randomInt({ min: MIN_SCORE, max: MAX_SCORE }),
          forfeitingTeamVisitation: getForfeitingTeamVisitation({ hasBeenForfeited }),
        },
      });
    }
  }
  return game;
};

export default async function generateLeagueGames(
  league: League,
  teams: Team[],
  ctx: SeedContext & { readonly getParticipant: GetUser },
) {
  if (teams.length < 2) {
    console.error(`There are not enough teams to create any games for league '${league.name}'.`);
    return [];
  }
  /* For each league, generate permutations of all sets of 2 teams in the league.  Each set will be used to generate the
     home team and away team for each created game in the league - ensuring that each team plays each other the same
     number of times. */
  const teamMatchupPermutations: Matchup[] = permutationsAtCount(teams, 2) as Matchup[];
  // Duplicate the set of matchups based on teh NUM_MATCHUPS parameter.
  const teamMatchups = Array(NUM_MATCHUP_VISITATION_PAIRS)
    .fill(0)
    .reduce((prev: Matchup[]) => [...prev, ...teamMatchupPermutations], [] as Matchup[]);
  // Randomly select a subset of the matchups to be unplayed (but will still have GameStatus = FINAL)
  const unplayedMatchupIndicies = selectArrayAtRandom(
    Array(teamMatchups.length)
      .fill(0)
      .map((_, i) => i),
    {
      duplicationKey: i => i,
      length: {
        min: Math.floor(NUM_UNPLAYED_MATCHUPS.min * teamMatchups.length),
        max: Math.floor(NUM_UNPLAYED_MATCHUPS.max & teamMatchups.length),
      },
    },
  );
  const playedMatchups = teamMatchups.filter((matchup, i) => !unplayedMatchupIndicies.includes(i));
  const unplayedMatchups = unplayedMatchupIndicies.reduce(
    (prev: Matchup[], i) => [...prev, teamMatchups[i] as Matchup],
    [] as Matchup[],
  );
  const games = await Promise.all([
    ...playedMatchups.map(matchup =>
      createGame(league, matchup, { ...ctx, hasBeenPlayed: true, hasBeenForfeited: false }),
    ),
    ...unplayedMatchups.map(matchup =>
      createGame(league, matchup, { ...ctx, hasBeenPlayed: false, hasBeenForfeited: false }),
    ),
    ...Array(getLength(NUM_ADDITIONAL_MATCHUPS))
      .fill(0)
      .map(() => {
        const matchup = selectAtRandom(teamMatchups);
        const status = selectAtRandomFrequency([
          // Frequencies will be normalized to 1.0, so each frequency is 1/3.
          { value: GameStatus.CANCELLED, frequency: 1 },
          { value: GameStatus.PROPOSED, frequency: 1 },
          { value: GameStatus.POSTPONED, frequency: 1 },
        ]);
        return createGame(league, matchup, { ...ctx, status });
      }),
  ]);
  console.info(`Generated ${games.length} games for league '${league.name}' in the database.`);
  return games;
}
