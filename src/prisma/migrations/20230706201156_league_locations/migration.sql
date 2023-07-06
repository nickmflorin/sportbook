/*
  Warnings:

  - You are about to drop the `LeagueOnUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamOnUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LeagueOnUsers" DROP CONSTRAINT "LeagueOnUsers_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "LeagueOnUsers" DROP CONSTRAINT "LeagueOnUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "TeamOnUsers" DROP CONSTRAINT "TeamOnUsers_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamOnUsers" DROP CONSTRAINT "TeamOnUsers_userId_fkey";

-- DropTable
DROP TABLE "LeagueOnUsers";

-- DropTable
DROP TABLE "TeamOnUsers";

-- CreateTable
CREATE TABLE "Location" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID NOT NULL,
    "primaryStreetAddress" TEXT NOT NULL,
    "secondaryStreetAddress" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueOnLocations" (
    "leagueId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" TEXT NOT NULL,

    CONSTRAINT "LeagueOnLocations_pkey" PRIMARY KEY ("leagueId","locationId")
);

-- CreateTable
CREATE TABLE "LeagueOnParticipants" (
    "leagueId" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" TEXT NOT NULL,
    "participationTypes" "LeagueParticipantType"[] DEFAULT ARRAY['PLAYER']::"LeagueParticipantType"[],

    CONSTRAINT "LeagueOnParticipants_pkey" PRIMARY KEY ("leagueId","participantId")
);

-- CreateTable
CREATE TABLE "TeamOnPlayers" (
    "teamId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" TEXT NOT NULL,

    CONSTRAINT "TeamOnPlayers_pkey" PRIMARY KEY ("teamId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- AddForeignKey
ALTER TABLE "LeagueOnLocations" ADD CONSTRAINT "LeagueOnLocations_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueOnLocations" ADD CONSTRAINT "LeagueOnLocations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueOnParticipants" ADD CONSTRAINT "LeagueOnParticipants_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueOnParticipants" ADD CONSTRAINT "LeagueOnParticipants_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamOnPlayers" ADD CONSTRAINT "TeamOnPlayers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamOnPlayers" ADD CONSTRAINT "TeamOnPlayers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
