/*
  Warnings:

  - You are about to drop the column `competitionLevel` on the `League` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `League` table. All the data in the column will be lost.
  - You are about to drop the column `leagueEnd` on the `League` table. All the data in the column will be lost.
  - You are about to drop the column `leagueStart` on the `League` table. All the data in the column will be lost.
  - You are about to drop the column `leagueType` on the `League` table. All the data in the column will be lost.
  - You are about to drop the column `leagueId` on the `LeagueRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `leagueId` on the `LeagueRequirements` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[configId]` on the table `League` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[leagueConfigId]` on the table `LeagueRegistration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[leagueConfigId]` on the table `LeagueRequirements` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `configId` to the `League` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leagueConfigId` to the `LeagueRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leagueConfigId` to the `LeagueRequirements` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeaguePermissionCode" AS ENUM ('POSTPONE_GAME', 'CANCEL_GAME');

-- DropForeignKey
ALTER TABLE "LeagueRegistration" DROP CONSTRAINT "LeagueRegistration_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "LeagueRequirements" DROP CONSTRAINT "LeagueRequirements_leagueId_fkey";

-- DropIndex
DROP INDEX "LeagueRegistration_leagueId_key";

-- DropIndex
DROP INDEX "LeagueRequirements_leagueId_key";

-- AlterTable
ALTER TABLE "League" DROP COLUMN "competitionLevel",
DROP COLUMN "isPublic",
DROP COLUMN "leagueEnd",
DROP COLUMN "leagueStart",
DROP COLUMN "leagueType",
ADD COLUMN     "configId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "LeagueRegistration" DROP COLUMN "leagueId",
ADD COLUMN     "leagueConfigId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "LeagueRequirements" DROP COLUMN "leagueId",
ADD COLUMN     "leagueConfigId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "LeaguePermissionSet" (
    "id" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID NOT NULL,
    "leagueConfigId" UUID NOT NULL,
    "leagueStaffRole" "LeagueStaffRole" NOT NULL,
    "permissionCodes" "LeaguePermissionCode"[],

    CONSTRAINT "LeaguePermissionSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueConfig" (
    "id" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "leagueStart" TIMESTAMP(3),
    "leagueEnd" TIMESTAMP(3),
    "leagueType" "LeagueType" NOT NULL DEFAULT 'PICKUP',
    "competitionLevel" "LeagueCompetitionLevel" NOT NULL DEFAULT 'SOCIAL',

    CONSTRAINT "LeagueConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeaguePermissionSet_leagueConfigId_key" ON "LeaguePermissionSet"("leagueConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaguePermissionSet_leagueConfigId_leagueStaffRole_key" ON "LeaguePermissionSet"("leagueConfigId", "leagueStaffRole");

-- CreateIndex
CREATE UNIQUE INDEX "League_configId_key" ON "League"("configId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueRegistration_leagueConfigId_key" ON "LeagueRegistration"("leagueConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueRequirements_leagueConfigId_key" ON "LeagueRequirements"("leagueConfigId");

-- AddForeignKey
ALTER TABLE "LeagueRegistration" ADD CONSTRAINT "LeagueRegistration_leagueConfigId_fkey" FOREIGN KEY ("leagueConfigId") REFERENCES "LeagueConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRequirements" ADD CONSTRAINT "LeagueRequirements_leagueConfigId_fkey" FOREIGN KEY ("leagueConfigId") REFERENCES "LeagueConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaguePermissionSet" ADD CONSTRAINT "LeaguePermissionSet_leagueConfigId_fkey" FOREIGN KEY ("leagueConfigId") REFERENCES "LeagueConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_configId_fkey" FOREIGN KEY ("configId") REFERENCES "LeagueConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
