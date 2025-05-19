import { Request, Response } from "express";
import * as parkingSlotService from "../services/parkingSlot";
import { ApiResponse } from "../apiResponse/response";
import { BadRequestError, NotFoundError } from "../exceptions/errors";

export const addParkingSlot = async (
  req: Request,
  res: Response
) => {
  try {
    const parkingSlotData = req.body;
    const parkingSlot = await parkingSlotService.addParkingSlot(parkingSlotData);
    return res
      .status(201)
      .json(new ApiResponse("Parking slot created successfully", parkingSlot));
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json(
          new ApiResponse("Parking slot is created once! change slot number", null)
        );
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }

    return res.status(500).json(new ApiResponse("Internal server error", null));
  }
};
export const updateParkingSlot = async (req: Request, res: Response) => {
  try {
    const { slotId } = req.params;
    const updatedParkingSlotData = req.body;
    const updatedParkingSlot = await parkingSlotService.updateParkingSlot(
      slotId,
      updatedParkingSlotData
    );
    return res
      .status(200)
      .json(new ApiResponse("Updated parking slot successfully", updatedParkingSlot));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }

    return res.status(500).json(new ApiResponse("Internal server error", null));

  }
};

export const getSingleParkingSlot = async (req: Request, res: Response) => {
  try {
    const { slotId } = req.params;
    const parkingSlot = await parkingSlotService.getSingleParkingSlot(slotId);
    return res
      .status(200)
      .json(new ApiResponse("Retrieved parking slot successfully", parkingSlot));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }

    return res.status(500).json(new ApiResponse("Internal server error", null));

  }
};

export const getAllParkingSlots = async (req: Request, res: Response) => {
  try {
    const parkingSlots = await parkingSlotService.getAllParkingSlots();
    return res
      .status(200)
      .json(new ApiResponse("Retrieved all parking slots successfully", parkingSlots));
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }

    return res.status(500).json(new ApiResponse("Internal server error", null));

};

export const deleteParkingSlot = async (req: Request, res: Response) => {
  try {
    const { slotId } = req.params;
    const result = await parkingSlotService.deleteParkingSlot(slotId);
    return res.status(200).json(new ApiResponse(result, null));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }

    return res.status(500).json(new ApiResponse("Internal server error", null));

  }
};

export const deleteAllParkingSlots = async (req: Request, res: Response) => {
  try {
    const result = await parkingSlotService.deleteAllParkingSlots();
    return res.status(200).json(new ApiResponse(result, null));
  } catch (error) {
    if (error instanceof Error) {
      return res.status(200).json(new ApiResponse(error.message, null));
    }

    return res.status(500).json(new ApiResponse("Internal server error", null));

  }
};
