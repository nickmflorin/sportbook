import { Prisma } from "@prisma/client";

export enum PrismaErrorCode {
  DOES_NOT_EXIST = "P2025",
  INVALID_ID = "P2023",
}

export const isPrismaDoesNotExistError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaErrorCode.DOES_NOT_EXIST;
