import { type Prisma, type PrismaClient, type FileUploadEntity } from "@prisma/client";

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
