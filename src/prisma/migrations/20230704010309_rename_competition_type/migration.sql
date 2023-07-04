/*
  Warnings:

  - The values [SOCIAL_COMPETATIVE] on the enum `LeagueCompetitionLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeagueCompetitionLevel_new" AS ENUM ('SOCIAL', 'COMPETITIVE', 'SOCIAL_COMPETITIVE');
ALTER TABLE "League" ALTER COLUMN "competitionLevel" DROP DEFAULT;
ALTER TABLE "League" ALTER COLUMN "competitionLevel" TYPE "LeagueCompetitionLevel_new" USING ("competitionLevel"::text::"LeagueCompetitionLevel_new");
ALTER TYPE "LeagueCompetitionLevel" RENAME TO "LeagueCompetitionLevel_old";
ALTER TYPE "LeagueCompetitionLevel_new" RENAME TO "LeagueCompetitionLevel";
DROP TYPE "LeagueCompetitionLevel_old";
ALTER TABLE "League" ALTER COLUMN "competitionLevel" SET DEFAULT 'SOCIAL';
COMMIT;
