/*
  Warnings:

  - You are about to drop the column `profiePic` on the `friends` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "friends" DROP COLUMN "profiePic",
ADD COLUMN     "profilePic" TEXT;
