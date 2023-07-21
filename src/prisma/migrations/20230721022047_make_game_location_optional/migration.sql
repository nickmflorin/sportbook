-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_locationId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "locationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
