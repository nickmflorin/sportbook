/*
  Warnings:

  - You are about to drop the column `location` on the `Game` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teamId,userId,leagueId]` on the table `TeamOnPlayers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leagueId` to the `TeamOnPlayers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TeamPlayerRole" AS ENUM ('CAPTAIN', 'CO_CAPTAIN', 'PLAYER');

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "location",
ADD COLUMN     "locationId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "TeamOnPlayers" ADD COLUMN     "leagueId" UUID NOT NULL,
ADD COLUMN     "role" "TeamPlayerRole" NOT NULL DEFAULT 'PLAYER';

-- CreateIndex
CREATE UNIQUE INDEX "TeamOnPlayers_teamId_userId_leagueId_key" ON "TeamOnPlayers"("teamId", "userId", "leagueId");

-- AddForeignKey
ALTER TABLE "TeamOnPlayers" ADD CONSTRAINT "TeamOnPlayers_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
