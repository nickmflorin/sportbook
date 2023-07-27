/*
  Warnings:

  - You are about to drop the `LeagueParticipant` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LeagueStaffRole" AS ENUM ('COMISSIONER', 'ADMIN', 'REFEREE');

-- DropForeignKey
ALTER TABLE "LeagueParticipant" DROP CONSTRAINT "LeagueParticipant_teamId_fkey";

-- DropForeignKey
ALTER TABLE "LeagueParticipant" DROP CONSTRAINT "LeagueParticipant_userId_fkey";

-- DropTable
DROP TABLE "LeagueParticipant";

-- DropEnum
DROP TYPE "LeagueParticipantType";

-- CreateTable
CREATE TABLE "Player" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerType" "LeaguePlayerType" DEFAULT 'PLAYER',
    "teamId" UUID NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueOnStaff" (
    "leagueId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" TEXT NOT NULL,
    "roles" "LeagueStaffRole"[],

    CONSTRAINT "LeagueOnStaff_pkey" PRIMARY KEY ("leagueId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_teamId_key" ON "Player"("userId", "teamId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueOnStaff" ADD CONSTRAINT "LeagueOnStaff_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueOnStaff" ADD CONSTRAINT "LeagueOnStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
