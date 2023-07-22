-- CreateEnum
CREATE TYPE "GameVisitationType" AS ENUM ('HOME', 'AWAY');

-- AlterTable
ALTER TABLE "GameResult" ADD COLUMN     "forfeitingTeamVisitation" "GameVisitationType";
