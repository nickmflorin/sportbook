import {
  type League,
  type LeaguePlayer,
  type LeaguePlayerPermissionSet,
  type User,
  type LeagueConfig,
  type LeagueStaffPermissionSet,
} from "@prisma/client";

export type LeagueWithConfig = League & { readonly config: LeagueConfig };

export type LeagueConfigWithPermissionSets = LeagueConfig & {
  readonly staffPermissionSets: LeagueStaffPermissionSet[];
  readonly playerPermissionSets: LeaguePlayerPermissionSet[];
};

export type LeagueWithConfigAndPermissionSets = League & { readonly config: LeagueConfigWithPermissionSets };

export type LeagueWithParticipation = LeagueWithConfig & {
  readonly teams: string[];
  readonly numParticipants: number;
};

export type LeaguePlayerWithUser = LeaguePlayer & {
  readonly user: User;
};
