import { Router } from "express";
import {
  addVehicle,
  deleteAllVehicles,
  deleteVehicle,
  getAllVehicles,
  getMyVehicles,
  getSingleVehicle,
  updateVehicle,
} from "../controllers/vehicleController";
import { Request, Response, RequestHandler } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export const vehicleRouter = Router();

// utils/handlerWrapper.ts

type AsyncRequestHandler = (req: Request, res: Response) => Promise<Response>;

export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req, res, next) => {
    fn(req, res).catch(next);
  };
};
// ... other routes

//@ts-ignore
vehicleRouter.post("/",authMiddleware, asyncHandler(addVehicle));
//@ts-ignore
vehicleRouter.get("/",adminMiddleware, asyncHandler(getAllVehicles));
//@ts-ignore
vehicleRouter.get("/mine",authMiddleware, asyncHandler(getMyVehicles));
//@ts-ignore
vehicleRouter.get("/:vehicleId",authMiddleware, asyncHandler(getSingleVehicle));
//@ts-ignore
vehicleRouter.put("/:vehicleId",authMiddleware, asyncHandler(updateVehicle));
//@ts-ignore
vehicleRouter.delete("/:vehicleId",authMiddleware, asyncHandler(deleteVehicle));
//@ts-ignore
vehicleRouter.delete("/",authMiddleware, asyncHandler(deleteAllVehicles));


