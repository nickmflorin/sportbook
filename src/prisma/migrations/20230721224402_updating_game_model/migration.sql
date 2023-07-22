-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('PROPOSED', 'CANCELLED', 'POSTPONED', 'FINAL');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'FINAL';

-- CreateTable
CREATE TABLE "GameResult" (
    "id" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID NOT NULL,
    "gameId" UUID NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,

    CONSTRAINT "GameResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameResult_gameId_key" ON "GameResult"("gameId");

-- AddForeignKey
ALTER TABLE "GameResult" ADD CONSTRAINT "GameResult_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
