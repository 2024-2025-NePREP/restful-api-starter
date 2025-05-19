import { Router } from "express";
import { addVehicle, deleteAllVehicles, deleteVehicle, getAllVehicles, getSingleVehicle, updateVehicle } from "../controllers/vehicleController";

export const vehicleRouter = Router()

vehicleRouter.post("/", addVehicle)
vehicleRouter.get("/", getAllVehicles)
vehicleRouter.get("/:vehicleId", getSingleVehicle)
vehicleRouter.put("/:vehicleId", updateVehicle)
vehicleRouter.delete("/:vehicleId", deleteVehicle)
vehicleRouter.delete("/", deleteAllVehicles)


/**
 * TODO 
 * Removing that typescript error on the controller functins
 */