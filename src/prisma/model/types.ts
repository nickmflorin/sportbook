import { type Prisma, type PrismaClient, type FileUploadEntity } from "@prisma/client";

export type Model = {
  readonly id: string;
};

/**
 * Returns the type associated with the Prisma model defined by the {@link Prisma.ModelName}, {@link M}.
 */
export type PrismaModelType<M extends Prisma.ModelName> = Lowercase<M> extends keyof PrismaClient
  ? Awaited<ReturnType<PrismaClient[Lowercase<M>]["findUniqueOrThrow"]>>
  : never;

type ToTitleCase<S extends string> = S extends `${infer L extends string}${infer R extends string}`
  ? `${Uppercase<L>}${Lowercase<R>}`
  : S;

type FileUploadEntityMap = { [key in FileUploadEntity]: ToTitleCase<key> };
type FileUploadModelName = FileUploadEntityMap[keyof FileUploadEntityMap];

export type ModelWithFileUrl<N extends FileUploadModelName | PrismaModelType<FileUploadModelName>> =
  N extends FileUploadModelName
    ? PrismaModelType<N> & {
        readonly fileUrl: string | null;
      }
    : N extends PrismaModelType<FileUploadModelName>
    ? N & { readonly fileUrl: string | null }
    : never;
