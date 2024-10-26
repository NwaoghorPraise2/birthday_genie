/*
  Warnings:

  - A unique constraint covering the columns `[googleID]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `dateOfBirth` on the `friends` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "friends" DROP COLUMN "dateOfBirth",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "googleID" TEXT;

-- CreateIndex
CREATE INDEX "friends_created_at_idx" ON "friends"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleID_key" ON "users"("googleID");
