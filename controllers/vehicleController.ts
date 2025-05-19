import { Request, Response } from "express";
import * as vehicleService from "../services/vehicle";
import { ApiResponse } from "../apiResponse/response";
import { BadRequestError, NotFoundError } from "../exceptions/errors";

export const addVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleData = req.body;
    const vehicle = await vehicleService.addVehicle(vehicleData);
    return res
      .status(201)
      .json(new ApiResponse("Module created successfully", module));
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json(new ApiResponse("Vehicle is created once", null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const updatedVehicleData = req.body;
    const updatedVehicle = await vehicleService.updateVehicle(
      vehicleId,
      updatedVehicleData
    );
    return res
      .status(200)
      .json(new ApiResponse("Updated vehicle successfully", updatedVehicle));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};

export const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await vehicleService.getSingleVehicle(vehicleId);
    return res
      .status(200)
      .json(new ApiResponse("Retrieved vehicle successfully", vehicle));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    return res
      .status(200)
      .json(new ApiResponse("Retrieved all vehicles successfully", vehicles));
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehicleService.deleteVehicle(vehicleId);
    return res.status(200).json(new ApiResponse(result, null));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};

export const deleteAllVehicles = async (req: Request, res: Response) => {
   try {
        const result = await vehicleService.deleteAllVehicles()
        return res.status(200).json(new ApiResponse(result, null))
    } catch (error) {
        if(error instanceof Error){
            return res.status(200).json(new ApiResponse(error.message, null))
        }
    }
};
