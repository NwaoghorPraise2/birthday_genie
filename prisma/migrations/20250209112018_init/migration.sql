/*
  Warnings:

  - The `relationship` column on the `friends` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "friends" ADD COLUMN     "profiePic" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "dateOfBirth" DROP NOT NULL,
ALTER COLUMN "dateOfBirth" SET DATA TYPE TEXT,
ALTER COLUMN "preferredName" DROP NOT NULL,
DROP COLUMN "relationship",
ADD COLUMN     "relationship" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "dateOfBirth" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "RelationshipTag";
