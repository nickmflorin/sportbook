/*
  Warnings:

  - You are about to drop the `LeagueOnParticipants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamOnPlayers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LeaguePlayerType" AS ENUM ('CAPTAIN', 'CO_CAPTAIN', 'PLAYER');

-- DropForeignKey
ALTER TABLE "LeagueOnParticipants" DROP CONSTRAINT "LeagueOnParticipants_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "LeagueOnParticipants" DROP CONSTRAINT "LeagueOnParticipants_participantId_fkey";

-- DropForeignKey
ALTER TABLE "TeamOnPlayers" DROP CONSTRAINT "TeamOnPlayers_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "TeamOnPlayers" DROP CONSTRAINT "TeamOnPlayers_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamOnPlayers" DROP CONSTRAINT "TeamOnPlayers_userId_fkey";

-- DropTable
DROP TABLE "LeagueOnParticipants";

-- DropTable
DROP TABLE "TeamOnPlayers";

-- DropEnum
DROP TYPE "TeamPlayerRole";

-- CreateTable
CREATE TABLE "LeagueParticipant" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "participationTypes" "LeagueParticipantType"[] DEFAULT ARRAY['PLAYER']::"LeagueParticipantType"[],
    "playerType" "LeaguePlayerType" DEFAULT 'PLAYER',
    "teamId" UUID NOT NULL,

    CONSTRAINT "LeagueParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeagueParticipant_userId_teamId_key" ON "LeagueParticipant"("userId", "teamId");

-- AddForeignKey
ALTER TABLE "LeagueParticipant" ADD CONSTRAINT "LeagueParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueParticipant" ADD CONSTRAINT "LeagueParticipant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
