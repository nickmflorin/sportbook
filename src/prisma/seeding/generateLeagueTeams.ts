/* eslint-disable no-console -- This script runs outside of the logger context. */
import chunk from "lodash.chunk";
import { type User, type League, TeamColor, LeaguePlayerRole, type Team } from "@prisma/client";

import { ensuresDefinedValue } from "~/lib/util";
import {
  infiniteLoopSelection,
  selectAtRandom,
  selectArrayAtRandom,
  infiniteLoop,
  selectAtRandomFrequency,
} from "~/lib/util/random";

import { prisma } from "../client";
import { getModelMeta } from "../model";

import { json } from "./fixtures";
import { type SeedContext } from "./types";

const MIN_PLAYERS_PER_LEAGUE = 50;
const MAX_PLAYERS_PER_LEAGUE = 100;

/* The number of teams per league depends on the number of participants available for that league and the number of
   players per team.  The more participants in a league, and the fewer players per team, the more teams that can be
   created.  So, we try to optimize the number of teams per league first based on lowering the number of players per
   team until we have the desired number of teams per league.  If that does not work, we then try lowering the number
   of teams per league.

   Note: The minimum number of participants per league must be 3 - one participant for an admin, referee and at least
   one for a player. */
const MIN_PLAYERS_PER_TEAM = 3;
const MAX_PLAYERS_PER_TEAM = 10;

const MAX_TEAMS_PER_LEAGUE = 6;
const MIN_TEAMS_PER_LEAGUE = 4;

const chunkUsersPerTeam = (league: League, users: User[]): User[][] => {
  if (users.length === 0) {
    console.warn(`Cannot bucket users for team in league '${league.name}' because there are no users.`);
    return [];
  }
  const _chunk = (minTeamsPerLeague: number): User[][] | null => {
    for (let i = MAX_PLAYERS_PER_TEAM; i >= MIN_PLAYERS_PER_TEAM; i--) {
      const chunked = chunk(users, i).filter(ch => {
        /* This is okay - and it will happen.  There will usually be 1 leftover chunk that holds the remaining users,
           and that chunk may be smaller than the minimum participants depending on the value of the remainder when
           dividing the number of users by the number of participants per team. */
        if (ch.length < MIN_PLAYERS_PER_TEAM) {
          console.info(
            `Ignoring chunk of ${ch.length} users for team in league '${league.name}' because it is too small.`,
          );
          return false;
        }
        return true;
      });
      if (chunked.length >= minTeamsPerLeague) {
        return chunked;
      }
    }
    return null;
  };
  for (let i = MAX_TEAMS_PER_LEAGUE; i >= MIN_TEAMS_PER_LEAGUE; i--) {
    const c = _chunk(i);
    if (c) {
      if (i !== MAX_TEAMS_PER_LEAGUE) {
        console.warn(
          `There were not enough users for league '${league.name}' to create the desired number of teams, ` +
            `'${MAX_TEAMS_PER_LEAGUE}'.  Instead, '${c.length}' teams were created.`,
        );
      }
      return c;
    }
  }
  return [];
};

async function generateLeagueTeam(name: string, players: User[], league: League) {
  // Use a restricted getUser method that will only return users that are on the team for the meta fields.
  const getPlayer = infiniteLoop<User>(players);

  return await prisma.team.create({
    data: {
      ...getModelMeta("Team", { getUser: getPlayer }),
      name,
      leagueId: league.id,
      color: selectAtRandom(Object.values(TeamColor)),
      players: {
        create: [
          ...players.map(user => ({
            ...getModelMeta("LeaguePlayer", { getUser: getPlayer }),
            user: { connect: { id: user.id } },
            /* We may need to introduce restrictions on the number of captains and/or co-captains per team down the
               line. */
            role: selectAtRandomFrequency([
              { value: LeaguePlayerRole.CAPTAIN, frequency: 0.05 },
              { value: LeaguePlayerRole.CO_CAPTAIN, frequency: 0.05 },
              { value: LeaguePlayerRole.PLAYER, frequency: 1.0 },
            ]),
          })),
        ],
      },
    },
  });
}

export default async function generateLeagueTeams(league: League, ctx: SeedContext): Promise<[Team[], User[]]> {
  /* Generate the users that will be associated with the league.  Right now, we will assume that all seeded users can
     be used for all leagues in the seed process - but eventually, we may want to differentiate users between
     leagues. */
  const leagueUsers = infiniteLoopSelection<User, string>(ctx.getUser, {
    duplicationKey: (u: User) => u.id,
    length: { min: MIN_PLAYERS_PER_LEAGUE, max: MAX_PLAYERS_PER_LEAGUE },
  });
  // Chunk the generated users into distinct, unique sets that can be used to construct the teams.
  let chunks = chunkUsersPerTeam(league, leagueUsers);
  if (chunks.length === 0) {
    console.error(`There were not enough players to create any teams for league '${league.name}'.`);
    return [[], leagueUsers];
  }
  // If there are not enough team names to generate a unique name for each team in the league, an error will be thrown.
  const teamNames = selectArrayAtRandom(json.teamNames, {
    length: chunks.length,
    duplicationKey: v => v.trim(),
  });
  if (teamNames.length !== chunks.length) {
    if (teamNames.length > chunks.length) {
      throw new Error("Unexpected Condition: Expected the number of team names to not exceed the number of teams.");
    }
    console.warn(
      `Only ${teamNames.length} could be generated from the JSON data, but there are ${chunks.length} sets of ` +
        "teams to generate.  This will cause a unique constraint violation on the team name.  To avoid this, the " +
        `number of teams created will be restricted to ${teamNames.length}, the number of unique team names that ` +
        "were generated.",
    );
    chunks = chunks.slice(0, teamNames.length - 1);
  }
  const teams = await Promise.all(
    chunks.map((players, i) => generateLeagueTeam(ensuresDefinedValue(teamNames[i]), players, league)),
  );
  console.info(`Generated ${teams.length} teams for league '${league.name}' in the database.`);
  return [teams, leagueUsers];
}
