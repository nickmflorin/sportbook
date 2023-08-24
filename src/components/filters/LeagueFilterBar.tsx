import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { prisma, isPrismaInvalidIdError, isPrismaDoesNotExistError } from "~/prisma/client";
import { type League, type Team, type User } from "~/prisma/model";

import { FilterBar } from "./FilterBar";
import { type LeagueWithTeams, type LeagueWithTeamAndPlayers } from "./TeamFilter";

const TeamFilter = dynamic(() => import("~/components/filters/TeamFilter"), { ssr: false });
const SearchBar = dynamic(() => import("~/components/filters/SearchBar"));

type LeagueProp = League | string | LeagueWithTeams | LeagueWithTeamAndPlayers;

const isLeagueWithTeams = (league: LeagueProp): league is LeagueWithTeams =>
  typeof league !== "string" &&
  Array.isArray((league as LeagueWithTeams).teams) &&
  (league as LeagueWithTeamAndPlayers).teams.every(team => team.players === undefined);

const isLeagueWithTeamsAndPlayers = (league: LeagueProp): league is LeagueWithTeamAndPlayers =>
  typeof league !== "string" &&
  Array.isArray((league as LeagueWithTeams).teams) &&
  (league as LeagueWithTeamAndPlayers).teams.every(team => team.players !== undefined);

interface LeagueFilterBarProps {
  readonly user: User;
  readonly league: LeagueProp;
}

const getLeagueTeams = (league: LeagueWithTeamAndPlayers | LeagueWithTeams | League) => {
  if (isLeagueWithTeams(league) || isLeagueWithTeamsAndPlayers(league)) {
    return league.teams;
  }
  return undefined;
};

const getPlayersTeam = async (league: LeagueWithTeamAndPlayers | LeagueWithTeams | League, user: User) => {
  if (isLeagueWithTeamsAndPlayers(league)) {
    const playerTeams = league.teams.filter(team => team.players.some(player => player.userId === user.id));
    if (playerTeams.length > 1) {
      throw new Error(
        `Detected multiple teams for which the player with user ID '${user.id}' belongs to in the same league, ` +
          `'${league.id}'.`,
      );
    }
    return playerTeams[0];
  } else if (isLeagueWithTeams(league)) {
    const teamIds = league.teams.flatMap(team => team.id);
    // The team may be null if the user is a staff member of the league but not a player on any team.
    const teamsWithPlayers = await prisma.team.findMany({
      where: { id: { in: teamIds }, leagueId: league.id, players: { some: { userId: user.id } } },
    });
    if (teamsWithPlayers.length > 1) {
      throw new Error(`Detected multiple teams for player with user ID '${user.id}' in league '${league.id}'.`);
    }
    return teamsWithPlayers[0];
  }
  // The team may be null if the user is a staff member of the league but not a player on any team.
  const playerTeams = await prisma.team.findMany({
    where: { leagueId: league.id, players: { some: { userId: user.id } } },
  });
  if (playerTeams.length > 1) {
    throw new Error(`Detected multiple teams for player with user ID '${user.id}' in league '${league.id}'.`);
  }
  return playerTeams[0];
};

// TODO: Should we dynamically load the search bar?  Or use suspense around it?
export const LeagueFilterBar = async ({ league: _league, user }: LeagueFilterBarProps) => {
  let league: LeagueWithTeamAndPlayers | LeagueWithTeams | League;
  // The team may be null if the user is a staff member of the league but not a player on any team.
  let playersTeam: Team | undefined = undefined;
  if (typeof _league === "string") {
    try {
      league = await prisma.league.findFirstOrThrow({
        include: { teams: { include: { players: { select: { userId: true } } } } },
        where: {
          id: _league,
          OR: [
            { staff: { some: { userId: user.id } } },
            { teams: { some: { players: { some: { userId: user.id } } } } },
          ],
        },
      });
    } catch (e) {
      if (isPrismaInvalidIdError(e) || isPrismaDoesNotExistError(e)) {
        notFound();
      } else {
        throw e;
      }
    }
    playersTeam = await getPlayersTeam(league as LeagueWithTeamAndPlayers, user);
  } else {
    playersTeam = await getPlayersTeam(_league, user);
    league = _league;
  }
  return (
    <FilterBar>
      <SearchBar key="0" />
      <TeamFilter key="1" league={league} playersTeam={playersTeam || null} teams={getLeagueTeams(league)} />
    </FilterBar>
  );
};
