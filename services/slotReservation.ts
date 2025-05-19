import {
  ParkingSlotStatus,
  PrismaClient,
  SlotReservationStatus,
} from "@prisma/client";
import { ISlotReservation } from "../types/slotReservation";
import { BadRequestError, NotFoundError } from "../exceptions/errors";
import { validateEnums } from "../utils/checkValidEnum";
import { validateStartAndEndDates } from "../utils/checkDateValidity";

const prisma = new PrismaClient();

export const requestParkingSlot = async (
  slotReservationData: ISlotReservation
) => {
  const { userId, vehicleId, slotNumber, startDate, endDate } =
    slotReservationData;

  //  Check if the startDate and endDate are valid
  validateStartAndEndDates(startDate, endDate);

  //  check if userId exists
  const issuedUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!issuedUser?.id) {
    throw new BadRequestError("User requesting doesn't exist");
  }

  // Check if vehicleId exists
  const issuedVehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });
  if (!issuedVehicle?.id) {
    throw new BadRequestError("Vehicle to park there doesn't exist");
  }

  // Check if slot request is available
  const issuedParkingSlot = await prisma.parkingSlot.findUnique({
    where: { slotNumber },
  });
  if (!issuedParkingSlot?.id) {
    throw new BadRequestError("Parking slot doesn't exist");
  } else if (
    issuedParkingSlot.id &&
    issuedParkingSlot.status === ParkingSlotStatus.OCCUPIED
  ) {
    throw new BadRequestError("The parking slot is already reserved");
  }

  // update the parking slot status to PENDING
  await prisma.parkingSlot.update({
    where: { slotNumber },
    data: {
      status: ParkingSlotStatus.PENDING,
    },
  });

  // Now create the slot reservation

  return await prisma.slotReservation.create({
    data: {
      userId,
      vehicleId,
      slotNumber,
      startDate,
      endDate,
    },
  });
};

export const updateParkingSlotRequest = async (
  reservationId: string,
  updatedParkingSlotReqData: ISlotReservation
) => {
  const { userId, vehicleId, slotNumber, startDate, endDate } =
    updatedParkingSlotReqData;

  if (startDate && endDate) {
    // Check if the startDate and endDate are valid
    validateStartAndEndDates(startDate, endDate);
  }

  // Check if the reservation was accepted or rejected by admin and deny the update
  const reservation = await prisma.slotReservation.findUnique({
    where: { id: reservationId },
  });
  if (!reservation?.id) {
    throw new BadRequestError("The reservation doesn't exist");
  }
  if (reservation.requestStatus === SlotReservationStatus.APPROVED) {
    throw new BadRequestError("Can't update an approved reservation");
  } else if (reservation.requestStatus === SlotReservationStatus.REJECTED) {
    throw new BadRequestError("Can't update a rejected reservation");
  }

  //   Check if the slotNumber passed exists
  const updatedParkingSlot = await prisma.parkingSlot.findUnique({
    where: { slotNumber },
  });

  if (!updatedParkingSlot?.id) {
    throw new NotFoundError("The parking slot provided doesn't exist");
  }

  return await prisma.slotReservation.update({
    where: { id: reservationId },
    data: {
      userId,
      vehicleId,
      slotNumber,
      startDate,
      endDate,
    },
  });
};

export const getParkingSlotRequest = async (reservationId: string) => {
  const reservation = await prisma.slotReservation.findUnique({
    where: { id: reservationId },
  });
  if (!reservation?.id) {
    throw new NotFoundError("The slot reservation doesn't exist");
  }

  return reservation;
};

export const getAllParkingSlotRequests = async () => {
  const slotReservations = await prisma.slotReservation.findMany();
  return slotReservations;
};

export const deleteParkingSlotRequest = async (reservationId: string) => {
  const reservation = await prisma.slotReservation.findUnique({
    where: { id: reservationId },
  });
  if (!reservation?.id) {
    throw new NotFoundError("The slot reservation doesn't exist");
  }

  await prisma.slotReservation.delete({ where: { id: reservationId } });

  return "Delete slot reservation successfully";
};

export const deleteAllParkingSlotRequests = async () => {
  await prisma.slotReservation.deleteMany();
  return "Delete all slot reservations successfully";
};

/**
 * Change request status
 * Change slotReservation status to APPROVED or REJECTED
 * Change parking slot status to OCCUPIED
 * Change assignedUserId in parking sot to userId of the
 *
 */

export const approveRequest = async (reservationId: string) => {
  // Check if the slot reservation exists
  const reservation = await prisma.slotReservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation?.id) {
    throw new NotFoundError("The slot reservation doesn't exist to approve");
  }
  const [updatedParkingSlot, updatedSlotReservation] = await Promise.all([
    // Update the parking slot status to OCCUPIED
    await prisma.parkingSlot.update({
      where: { slotNumber: reservation.slotNumber },
      data: {
        status: ParkingSlotStatus.OCCUPIED,
        assignedUserId: reservation.userId,
      },
    }),
    // Update the slot reservation status to APPROVED and processedAt to now
    await prisma.slotReservation.update({
      where: { id: reservationId },
      data: {
        requestStatus: SlotReservationStatus.APPROVED,
        processedAt: new Date(),
      },
    }),
  ]);

  return updatedSlotReservation;
};

export const rejectRequest = async (reservationId: string, rejectionReason: string) => {
  // Check if the slot reservation exists
  const reservation = await prisma.slotReservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation?.id) {
    throw new NotFoundError("The slot reservation doesn't exist to approve");
  }
  const [updatedParkingSlot, updatedSlotReservation] = await Promise.all([
    // Update the parking slot status to OCCUPIED
    await prisma.parkingSlot.update({
      where: { slotNumber: reservation.slotNumber },
      data: {
        status: ParkingSlotStatus.AVAILABLE,
      },
    }),
    // Update the slot reservation status to APPROVED and processedAt to now
    await prisma.slotReservation.update({
      where: { id: reservationId },
      data: {
        requestStatus: SlotReservationStatus.REJECTED,
        processedAt: new Date(),
        rejectionReason
      },
    }),
  ]);

  return updatedSlotReservation;
};
