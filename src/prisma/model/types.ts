import {
  type Prisma,
  type PrismaClient,
  type FileUploadEntity,
  type League,
  type Team,
  type GameResult,
  type Game,
  type LeaguePlayer,
  type LeaguePlayerPermissionSet,
  type User,
  type LeagueConfig,
  type LeagueStaffPermissionSet,
} from "@prisma/client";

import { type Equals } from "~/lib/util/types";

export type Model = {
  readonly id: string;
};

type ToTitleCase<S extends string> = S extends `${infer L extends string}${infer R extends string}`
  ? `${Uppercase<L>}${Lowercase<R>}`
  : S;

type _ToQueryCase<S extends string> = S extends `${infer L extends string}${infer R extends string}`
  ? `${Lowercase<L>}${R}`
  : S;

/**
 * Returns the type associated with the Prisma model defined by the {@link Prisma.ModelName}, {@link M}.
 */
export type PrismaModelType<M extends Prisma.ModelName = Prisma.ModelName> = _ToQueryCase<M> extends keyof PrismaClient
  ? Awaited<ReturnType<PrismaClient[_ToQueryCase<M>]["findUniqueOrThrow"]>>
  : never;

type ModelMetaFieldTypes = {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly assignedAt: Date;
  readonly createdById: string;
  readonly updatedById: string;
};

/**
 * Represents the base metadata fields that are present on the model.  This will include any of the following fields,
 * if they are present on the model: 'createdAt', 'updatedAt', 'assignedAt', 'createdById' and 'updatedById'.
 */
export type ModelMeta<N extends Prisma.ModelName> = {
  [key in keyof ModelMetaFieldTypes & keyof PrismaModelType<N> as Equals<
    PrismaModelType<N>[key],
    ModelMetaFieldTypes[key]
  > extends true
    ? key
    : never]: PrismaModelType<N>[key];
};

export type ModelMetaField<M extends Prisma.ModelName> = keyof ModelMeta<M>;

export type ModelConcreteField<M extends Prisma.ModelName> = Exclude<
  keyof PrismaModelType<M>,
  ModelMetaField<M> | "id"
>;

export type PrismaCreateArgs<M extends Prisma.ModelName> = Lowercase<M> extends keyof PrismaClient
  ? Awaited<ReturnType<PrismaClient[Lowercase<M>]["findUniqueOrThrow"]>>
  : never;

type FileUploadEntityMap = { [key in FileUploadEntity]: ToTitleCase<key> };
type FileUploadModelName = FileUploadEntityMap[keyof FileUploadEntityMap];

export type WithFileUrl<T> = T & { readonly fileUrl: string | null };

export type ModelWithFileUrl<N extends FileUploadModelName | PrismaModelType<FileUploadModelName>> =
  N extends FileUploadModelName
    ? WithFileUrl<PrismaModelType<N>>
    : N extends PrismaModelType<FileUploadModelName>
    ? WithFileUrl<N>
    : never;

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

export enum GameResultType {
  WIN = "win",
  LOSS = "loss",
  TIE = "tie",
}

export enum GameLocation {
  HOME = "home",
  AWAY = "away",
}

export type GameWithResult = Game & {
  readonly result: GameResult;
  readonly homeTeam: ModelWithFileUrl<"Team">;
  readonly awayTeam: ModelWithFileUrl<"Team">;
};

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

export type LeaguePlayerWithUser = LeaguePlayer & {
  readonly user: User;
};

export type GameWithTeams = GameWithResult & { readonly awayTeam: Team; readonly homeTeam: Team };

export type TeamWithPlayers = Team & { readonly players: LeaguePlayerWithUser[] };

export type TeamGame<G extends GameWithResult = GameWithResult> = G & {
  readonly resultType: GameResultType;
  readonly score: number;
  readonly opponentScore: number;
  readonly opponentId: string;
};

export type TeamGameWithOpponent<G extends GameWithResult = GameWithResult> = G & {
  readonly resultType: GameResultType;
  readonly score: number;
  readonly opponentScore: number;
  readonly opponentId: string;
  readonly opponent: Team;
};
