/*
  Warnings:

  - A unique constraint covering the columns `[name,leagueId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_name_leagueId_key" ON "Team"("name", "leagueId");
