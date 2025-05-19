import {
  ParkingSlotStatus,
  PrismaClient,
  SlotReservationStatus,
} from "@prisma/client";
import { ISlotReservation } from "../types/slotReservation";
import { BadRequestError, NotFoundError } from "../exceptions/errors";
import { validateEnums } from "../utils/checkValidEnum";
import { validateStartAndEndDates } from "../utils/checkDateValidity";
import { emailSender } from "../utils/emailSender";
import { EMAIL_CONTEXT } from "../constants/common";
import { getParkingAmount } from "../utils/computerParkingTicketAmount";

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

export const getMyParkingSlotRequests = async (userId: string) =>{
  const myReservations = await prisma.slotReservation.findMany({where: {userId}})
  return myReservations
}

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
    include: {
      user: true,
    },
  });

  if (!reservation?.id) {
    throw new NotFoundError("The slot reservation doesn't exist to approve");
  }
  const startDate = reservation.startDate?.getTime() || new Date().getTime();
  const endDate = reservation.endDate?.getTime() || new Date().getTime();

  const durationMillsec = endDate - startDate;
  const durationHrs = durationMillsec / (1000 * 60 * 60);

  if (durationHrs <= 0) {
    throw new BadRequestError("You can't park for 0 milliseconds");
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

  //   Ticket generation
  const amountToPay = getParkingAmount(durationHrs);

  const ticket = await prisma.parkingSlotTicket.create({
    data: {
      userId: reservation.userId,
      vehicleId: reservation.vehicleId,
      slotNumber: reservation.slotNumber, // Adjust based on your schema
      amount: amountToPay,
      duration: `${durationHrs.toFixed(2)}h`, // Store duration as string (e.g., "2.50h")
    },
  });

  emailSender({
    emailContext: EMAIL_CONTEXT.PARKING_SLOT_ACKNOWLEDGEMENT,
    vehicleOwnerEmail: reservation.user.email,
    slotNumber: reservation.slotNumber,
    duration: `${durationHrs.toFixed(2)}h`,
    amount: amountToPay
  });

  return updatedSlotReservation;
};

export const rejectRequest = async (
  reservationId: string,
  rejectionReason: string
) => {
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
        rejectionReason,
      },
    }),
  ]);

  return updatedSlotReservation;
};
