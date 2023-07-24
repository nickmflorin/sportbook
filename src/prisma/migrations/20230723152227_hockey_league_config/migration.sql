-- CreateEnum
CREATE TYPE "HockeyLeagueStandingsMethod" AS ENUM ('RECORD', 'POINTS');

-- CreateEnum
CREATE TYPE "HockeyLeagueStandingTieBreaker" AS ENUM ('GOALS_FOR', 'GOALS_AGAINST', 'GOAL_DIFFERENTIAL', 'HEAD_TO_HEAD_MATCHUP');

-- CreateTable
CREATE TABLE "HockeyLeagueConfig" (
    "id" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID NOT NULL,
    "standingsMethod" "HockeyLeagueStandingsMethod" NOT NULL DEFAULT 'POINTS',
    "tieBreakers" "HockeyLeagueStandingTieBreaker"[] DEFAULT ARRAY['HEAD_TO_HEAD_MATCHUP', 'GOAL_DIFFERENTIAL']::"HockeyLeagueStandingTieBreaker"[],
    "leagueId" UUID NOT NULL,

    CONSTRAINT "HockeyLeagueConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HockeyLeagueConfig_leagueId_key" ON "HockeyLeagueConfig"("leagueId");

-- AddForeignKey
ALTER TABLE "HockeyLeagueConfig" ADD CONSTRAINT "HockeyLeagueConfig_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
