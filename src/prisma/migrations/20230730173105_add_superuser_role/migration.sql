-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPERUSER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "UserRole"[] DEFAULT ARRAY[]::"UserRole"[];
