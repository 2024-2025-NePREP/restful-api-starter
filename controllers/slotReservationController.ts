import {
  ParkingSlotStatus,
  PrismaClient,
  SlotReservationStatus,
} from "@prisma/client";
import { ISlotReservation } from "../types/slotReservation";
import { BadRequestError, NotFoundError } from "../exceptions/errors";
import { validateStartAndEndDates } from "../utils/checkDateValidity";
import { Request, Response } from "express";
import * as reservationService from "../services/slotReservation";
import { ApiResponse } from "../apiResponse/response";

const prisma = new PrismaClient();

export const requestParkingSlot = async (req: Request, res: Response) => {
  try {
    const reservationdata = req.body;
    const reservation = await reservationService.requestParkingSlot(
      reservationdata
    );

    return res
      .status(201)
      .json(new ApiResponse("Request successfully sent", reservation));
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json(
          new ApiResponse("Reservation is made once!Plz change the slot ", null)
        );
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }

    return res.status(500).json(new ApiResponse("Internal server error", null));
  }
};

export const updateParkingSlotRequest = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.params;
    const updatedData = req.body;

    const updatedReservation =
      await reservationService.updateParkingSlotRequest(
        reservationId,
        updatedData
      );
    return res
      .status(200)
      .json(
        new ApiResponse(
          "Reservation updated successfully sent",
          updatedReservation
        )
      );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }

    return res.status(500).json(new ApiResponse("Internal server error", null));
  }
};

export const getParkingSlotRequest = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.params;
    const reservation = await reservationService.getParkingSlotRequest(
      reservationId
    );
    return res
      .status(200)
      .json(
        new ApiResponse("Reservation retrieved successfully sent", reservation)
      );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }

    return res.status(500).json(new ApiResponse("Internal server error", null));
  }
};

export const getAllParkingSlotRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const reservations = await reservationService.getAllParkingSlotRequests();
    return res
      .status(200)
      .json(
        new ApiResponse(
          "Reservations retrieved successfully sent",
          reservations
        )
      );
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
    return res.status(500).json(new ApiResponse("Internal server error", null));
  }
};

export const getMyParkingSlotRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const {id}  = req.user
    const reservations = await reservationService.getMyParkingSlotRequests(id);
    return res
      .status(200)
      .json(
        new ApiResponse(
          "My reservations retrieved successfully sent",
          reservations
        )
      );
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
    return res.status(500).json(new ApiResponse("Internal server error", null));
  }
};

export const deleteParkingSlotRequest = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.params;
    const result = await reservationService.deleteParkingSlotRequest(
      reservationId
    );
    return res.status(200).json(new ApiResponse(result, null));
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
    return res.status(500).json(new ApiResponse("Internal server error", null));
  }
};

export const deleteAllParkingSlotRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await reservationService.deleteAllParkingSlotRequests();
    return res.status(200).json(new ApiResponse(result, null));
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }

    return res.status(500).json(new ApiResponse("Internal server error", null));
  }
};

/**
 * Change request status
 * Change slotReservation status to APPROVED or REJECTED
 * Change parking slot status to OCCUPIED
 * Change assignedUserId in parking sot to userId of the
 *
 */

export const approveRequest = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.params;
    const approvedReservation = await reservationService.approveRequest(
      reservationId
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          "Reservation approved successfully",
          approvedReservation
        )
      );
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    } else if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof BadRequestError) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }

    return res.status(500).json(new ApiResponse("Internal server error", null));
  }
};

export const rejectRequest = async (
  req: Request, res: Response
) => {
 try {
    const {reservationId} = req.params
    const rejectionReason = req.body

    const rejectedReservation = await reservationService.rejectRequest(
      reservationId, rejectionReason)

    return res.status(200).json(new ApiResponse("Reservation rejected successfully", rejectedReservation))
 } catch (error) {
     if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    } else if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof BadRequestError) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }

    return res.status(500).json(new ApiResponse("Internal server error", null));
 }
};
