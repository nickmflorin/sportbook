-- CreateEnum
CREATE TYPE "FileUploadEntity" AS ENUM ('LOCATION', 'LEAGUE', 'TEAM');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE');

-- CreateTable
CREATE TABLE "FileUpload" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL,
    "entityType" "FileUploadEntity" NOT NULL,
    "entityId" UUID NOT NULL,

    CONSTRAINT "FileUpload_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileUpload" ADD CONSTRAINT "FileUpload_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
