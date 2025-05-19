/*
  Warnings:

  - Changed the type of `location` on the `ParkingSlot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ParkingSlotLocation" AS ENUM ('NORTH', 'SOUTH', 'EAST', 'WEST');

-- AlterTable
ALTER TABLE "ParkingSlot" DROP COLUMN "location",
ADD COLUMN     "location" "ParkingSlotLocation" NOT NULL;

-- DropEnum
DROP TYPE "ParkingLocation";
