-- CreateTable
CREATE TABLE "parkingSlotTicket" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "slotNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "duration" TEXT NOT NULL,

    CONSTRAINT "parkingSlotTicket_pkey" PRIMARY KEY ("id")
);
