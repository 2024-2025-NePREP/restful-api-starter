import {
  ParkingSlotLocation,
  ParkingSlotStatus,
  VehicleSize,
} from "@prisma/client";

export interface IParkingSlot {
  id?: string;
  assignedUserId?: string;
  slotNumber: string;
  size: VehicleSize;
  status: ParkingSlotStatus;
  location: ParkingSlotLocation;
  createdAt?: Date;
  updatedAt?: Date;
}
