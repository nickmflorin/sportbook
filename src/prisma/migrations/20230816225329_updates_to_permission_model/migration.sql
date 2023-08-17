/*
  Warnings:

  - The `color` column on the `Team` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `LeaguePermissionSet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LeagueStaffPermissionCode" AS ENUM ('POSTPONE_GAME', 'CANCEL_GAME', 'INVITE_PLAYERS');

-- CreateEnum
CREATE TYPE "LeaguePlayerRole" AS ENUM ('CAPTAIN', 'CO_CAPTAIN', 'PLAYER');

-- CreateEnum
CREATE TYPE "LeaguePlayerPermissionCode" AS ENUM ('INVITE_PLAYERS');

-- CreateEnum
CREATE TYPE "TeamColor" AS ENUM ('BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'RED', 'GRAY');

-- DropForeignKey
ALTER TABLE "LeaguePermissionSet" DROP CONSTRAINT "LeaguePermissionSet_leagueConfigId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_userId_fkey";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "color",
ADD COLUMN     "color" "TeamColor" NOT NULL DEFAULT 'GRAY';

-- DropTable
DROP TABLE "LeaguePermissionSet";

-- DropTable
DROP TABLE "Player";

-- DropEnum
DROP TYPE "Color";

-- DropEnum
DROP TYPE "LeaguePermissionCode";

-- DropEnum
DROP TYPE "LeaguePlayerType";

-- CreateTable
CREATE TABLE "LeagueStaffPermissionSet" (
    "id" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID NOT NULL,
    "leagueConfigId" UUID NOT NULL,
    "leagueStaffRole" "LeagueStaffRole" NOT NULL,
    "permissionCodes" "LeagueStaffPermissionCode"[],

    CONSTRAINT "LeagueStaffPermissionSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaguePlayer" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "LeaguePlayerRole" DEFAULT 'PLAYER',
    "teamId" UUID NOT NULL,

    CONSTRAINT "LeaguePlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaguePlayerPermissionSet" (
    "id" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID NOT NULL,
    "leagueConfigId" UUID NOT NULL,
    "leaguePlayerRole" "LeaguePlayerRole" NOT NULL,
    "permissionCodes" "LeaguePlayerPermissionCode"[],

    CONSTRAINT "LeaguePlayerPermissionSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeagueStaffPermissionSet_leagueConfigId_leagueStaffRole_key" ON "LeagueStaffPermissionSet"("leagueConfigId", "leagueStaffRole");

-- CreateIndex
CREATE UNIQUE INDEX "LeaguePlayer_userId_teamId_key" ON "LeaguePlayer"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaguePlayerPermissionSet_leagueConfigId_leaguePlayerRole_key" ON "LeaguePlayerPermissionSet"("leagueConfigId", "leaguePlayerRole");

-- AddForeignKey
ALTER TABLE "LeagueStaffPermissionSet" ADD CONSTRAINT "LeagueStaffPermissionSet_leagueConfigId_fkey" FOREIGN KEY ("leagueConfigId") REFERENCES "LeagueConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaguePlayer" ADD CONSTRAINT "LeaguePlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaguePlayer" ADD CONSTRAINT "LeaguePlayer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaguePlayerPermissionSet" ADD CONSTRAINT "LeaguePlayerPermissionSet_leagueConfigId_fkey" FOREIGN KEY ("leagueConfigId") REFERENCES "LeagueConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
