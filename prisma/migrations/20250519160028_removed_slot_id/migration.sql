/*
  Warnings:

  - You are about to drop the column `slotId` on the `SlotReservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SlotReservation" DROP CONSTRAINT "SlotReservation_slotId_fkey";

-- AlterTable
ALTER TABLE "SlotReservation" DROP COLUMN "slotId";

-- CreateTable
CREATE TABLE "ConfirmationToken" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfirmationToken_pkey" PRIMARY KEY ("id")
);
