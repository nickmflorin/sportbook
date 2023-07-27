/*
  Warnings:

  - You are about to drop the `LeagueOnStaff` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LeagueOnStaff" DROP CONSTRAINT "LeagueOnStaff_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "LeagueOnStaff" DROP CONSTRAINT "LeagueOnStaff_userId_fkey";

-- DropTable
DROP TABLE "LeagueOnStaff";

-- CreateTable
CREATE TABLE "LeagueStaff" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leagueId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roles" "LeagueStaffRole"[],

    CONSTRAINT "LeagueStaff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeagueStaff_leagueId_userId_key" ON "LeagueStaff"("leagueId", "userId");

-- AddForeignKey
ALTER TABLE "LeagueStaff" ADD CONSTRAINT "LeagueStaff_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueStaff" ADD CONSTRAINT "LeagueStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
