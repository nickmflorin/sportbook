import { type Team } from "@prisma/client";

import { type ModelWithFileUrl } from "./base";
import { type GameLocation } from "./game";
import { type LeaguePlayerWithUser } from "./league";

export type TeamStatDimension = Record<GameLocation | "total", number>;

export enum TeamStatMetric {
  WINS = "wins",
  LOSSES = "losses",
  TIES = "ties",
  POINTS = "points",
  GAMES_PLAYED = "gamesPlayed",
}

export type TeamStats = Record<TeamStatMetric, TeamStatDimension> & {
  readonly leagueRank: number;
};

export type TeamWithStats<T extends Team = Team, S extends keyof TeamStats = keyof TeamStats> = T & {
  readonly stats: Pick<TeamStats, S>;
};

export type TeamWithPlayers = Team & { readonly players: LeaguePlayerWithUser[] };

type Players = { readonly numPlayers: number };

export type TeamWithNumPlayers<T extends Team> = T extends Team ? T & { readonly numPlayers: number } : never;

type Stats = { readonly stats: TeamStats };
type _WithStats<T> = T extends BasicUiTeam ? T & Stats : never;
type _WithPlayers<T> = T extends BasicUiTeam ? T & Players : never;

type _BasicUiTeamProps = "id" | "name" | "leagueId";
export type BasicUiTeam = Pick<Team, _BasicUiTeamProps>;
export type BasicUiTeamWithFileUrl = Pick<ModelWithFileUrl<Team>, _BasicUiTeamProps | "fileUrl">;

type WithStats<T> = T extends BasicUiTeam ? _WithStats<T> | _WithPlayers<_WithStats<T>> : never;
type WithPlayers<T> = T extends BasicUiTeam ? _WithPlayers<T> | _WithPlayers<_WithStats<T>> : never;

type _WithForms<T> = T | WithPlayers<T> | WithStats<T>;
type WithForms<T> = T extends BasicUiTeam ? _WithForms<T> : never;

export type TeamWithStatsUiForm = WithStats<BasicUiTeam | BasicUiTeamWithFileUrl>;
export type TeamUiForm = WithForms<BasicUiTeam | BasicUiTeamWithFileUrl>;

export const teamUiFormHasFileUrl = (t: TeamUiForm): t is WithForms<BasicUiTeamWithFileUrl> =>
  (t as WithForms<BasicUiTeamWithFileUrl>).fileUrl !== undefined;

export const teamUiFormHasStats = (
  t: TeamUiForm,
): t is
  | WithStats<BasicUiTeam | BasicUiTeamWithFileUrl>
  | WithPlayers<WithStats<BasicUiTeam | BasicUiTeamWithFileUrl>> =>
  (t as WithStats<BasicUiTeam | BasicUiTeamWithFileUrl> | WithPlayers<WithStats<BasicUiTeam | BasicUiTeamWithFileUrl>>)
    .stats !== undefined;

export const teamUiFormHasPlayers = (
  t: TeamUiForm,
): t is
  | WithPlayers<BasicUiTeam | BasicUiTeamWithFileUrl>
  | WithPlayers<WithStats<BasicUiTeam | BasicUiTeamWithFileUrl>> =>
  (
    t as
      | WithPlayers<BasicUiTeam | BasicUiTeamWithFileUrl>
      | WithPlayers<WithStats<BasicUiTeam | BasicUiTeamWithFileUrl>>
  ).numPlayers !== undefined;
