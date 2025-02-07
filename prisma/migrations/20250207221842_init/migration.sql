/*
  Warnings:

  - You are about to drop the column `preferedName` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappNumber` on the `friends` table. All the data in the column will be lost.
  - The `relationship` column on the `friends` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `preferredName` to the `friends` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RelationshipTag" AS ENUM ('FAMILY', 'FRIEND', 'COLLEAGUE', 'OTHER');

-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('WHATSAPP', 'EMAIL', 'TEXTMESSAGE');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'DRAFT', 'DELETED');

-- CreateEnum
CREATE TYPE "MessageTag" AS ENUM ('HUMAN', 'AI');

-- AlterTable
ALTER TABLE "friends" DROP COLUMN "preferedName",
DROP COLUMN "whatsappNumber",
ADD COLUMN     "preferredName" TEXT NOT NULL,
DROP COLUMN "relationship",
ADD COLUMN     "relationship" "RelationshipTag";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "displayName" TEXT,
ALTER COLUMN "lastLogin" DROP DEFAULT;

-- CreateTable
CREATE TABLE "account_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "birthdayNotificationTime" INTEGER,
    "timeToSendBirthdayMessages" INTEGER,
    "defaultMessageChannel" "MessageChannel" DEFAULT 'WHATSAPP',
    "useNickNameInMessage" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tag" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "isRead" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "MessageStatus" DEFAULT 'DRAFT',
    "message" TEXT,
    "tag" "MessageTag",
    "isDeleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "historyId" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "timeSent" TIMESTAMP(3),
    "status" "MessageStatus" NOT NULL DEFAULT 'DRAFT',
    "channel" "MessageChannel" NOT NULL DEFAULT 'WHATSAPP',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_settings_userId_key" ON "account_settings"("userId");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "messages_created_at_idx" ON "messages"("created_at");

-- CreateIndex
CREATE INDEX "history_created_at_idx" ON "history"("created_at");

-- AddForeignKey
ALTER TABLE "account_settings" ADD CONSTRAINT "account_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "history"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "friends"("id") ON DELETE CASCADE ON UPDATE CASCADE;
