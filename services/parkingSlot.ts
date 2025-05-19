import {
  ParkingSlotLocation,
  ParkingSlotStatus,
  Prisma,
  PrismaClient,
  VehicleSize,
} from "@prisma/client";
import { IParkingSlot } from "../types/parkingSlot";
import { validateEnums } from "../utils/checkValidEnum";
import { isValidUUID } from "../utils/checkUUIDString";
import { BadRequestError, NotFoundError } from "../exceptions/errors";
import { isValidSlotNumber } from "../utils/chekcSlotNumberValidity";

const prisma = new PrismaClient();

export const addParkingSlot = async (parkingSlotData: IParkingSlot) => {
  const { location, size, slotNumber, status } = parkingSlotData;

  //   Check status validity
  validateEnums({
    status: { value: status, enumType: ParkingSlotStatus },
    size: { value: size, enumType: VehicleSize },
    location: {value: location, enumType: ParkingSlotLocation}
  });

  if (status === ParkingSlotStatus.OCCUPIED) {
    throw new BadRequestError("Slot can't be occupied at creation");
  }

  // Check if slot number is valid
  isValidSlotNumber(slotNumber)

  return await prisma.parkingSlot.create({
    data: {
      location,
      size,
      slotNumber,
      status,
    },
  });
};

export const updateParkingSlot = async (
  slotId: string,
  updatedParkSlotData: IParkingSlot
) => {
  const { location, size, slotNumber, status } = updatedParkSlotData;
  // Check is status is valid
  isValidUUID(slotId);

  // Check status enum validity
  validateEnums({
    status: { value: status, enumType: ParkingSlotStatus },
    size: { value: size, enumType: VehicleSize },
    location: {value: location, enumType: ParkingSlotLocation}
  });

  // Check if slot number is occupied 
  isValidSlotNumber(slotNumber)

  return await prisma.parkingSlot.update({
    where: { id: slotId },
    data: {
      location,
      size,
      slotNumber,
      status,
    },
  });
};

export const getSingleParkingSlot = async (slotId: string) => {
  // Check is status is valid
  isValidUUID(slotId);

  const parkingSlot = await prisma.parkingSlot.findUnique({
    where: { id: slotId },
  });
  if (!parkingSlot?.id) {
    throw new NotFoundError("Parking slot not found");
  }

  return parkingSlot;
};

export const getAllParkingSlots = () => {
  const parkingSlots = prisma.parkingSlot.findMany();
  return parkingSlots;
};

export const deleteParkingSlot = async (slotId: string) => {
  // Check is slotId is valid UUId
  isValidUUID(slotId);

  const toBeDeleted = await prisma.parkingSlot.findUnique({
    where: { id: slotId },
  });
  if (!toBeDeleted?.id) {
    throw new NotFoundError("Parking slot not found");
  }

  await prisma.parkingSlot.delete({ where: { id: slotId } });

  return "Deleted parking slot successfully";
};

export const deleteAllParkingSlots = async () => {
  await prisma.parkingSlot.deleteMany();
  return "Deleted all parking slots successfully";
};
