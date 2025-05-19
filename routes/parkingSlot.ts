import { Router } from "express";
import { addParkingSlot, deleteAllParkingSlots, deleteParkingSlot, getAllParkingSlots, getSingleParkingSlot, updateParkingSlot } from "../controllers/parkingSlotController";
import { asyncHandler } from "../utils/handlerWrapper";

export const parkingSlotRouter = Router()


parkingSlotRouter.post("/", asyncHandler(addParkingSlot))
parkingSlotRouter.put("/:slotId", asyncHandler(updateParkingSlot))
parkingSlotRouter.get("/:slotId", asyncHandler(getSingleParkingSlot))
parkingSlotRouter.get("/", asyncHandler(getAllParkingSlots))
parkingSlotRouter.delete("/:slotId", asyncHandler(deleteParkingSlot))
parkingSlotRouter.delete("/", asyncHandler(deleteAllParkingSlots))