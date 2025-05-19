import { Router } from "express";
import {
  addVehicle,
  deleteAllVehicles,
  deleteVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
} from "../controllers/vehicleController";
import { Request, Response, RequestHandler } from "express";

export const vehicleRouter = Router();

// utils/handlerWrapper.ts

type AsyncRequestHandler = (req: Request, res: Response) => Promise<Response>;

export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req, res, next) => {
    fn(req, res).catch(next);
  };
};
// ... other routes
vehicleRouter.post("/", asyncHandler(addVehicle));
vehicleRouter.get("/", asyncHandler(getAllVehicles));
vehicleRouter.get("/:vehicleId", asyncHandler(getSingleVehicle));
vehicleRouter.put("/:vehicleId", asyncHandler(updateVehicle));
vehicleRouter.delete("/:vehicleId", asyncHandler(deleteVehicle));
vehicleRouter.delete("/", asyncHandler(deleteAllVehicles));

/**
 * TODO
 * Removing that typescript error on the controller functins
 */
