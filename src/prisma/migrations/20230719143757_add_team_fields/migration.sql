/*
  Warnings:

  - Added the required column `leagueId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Color" AS ENUM ('BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'RED', 'GRAY');

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "color" "Color" NOT NULL DEFAULT 'GRAY',
ADD COLUMN     "leagueId" UUID NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
