import { SlotReservationStatus } from "@prisma/client";

export interface ISlotReservation {
  id?: string;
  userId: string;
  vehicleId: string;
  slotNumber: string;
  requestStatus?: SlotReservationStatus;
  rejectionReason?: string;
  startDate: Date;
  endDate: Date;
  processedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
