import { Router } from "express";
import { addParkingSlot, deleteAllParkingSlots, deleteParkingSlot, getAllParkingSlots, getSingleParkingSlot, updateParkingSlot } from "../controllers/parkingSlotController";
import { asyncHandler } from "../utils/handlerWrapper";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export const parkingSlotRouter = Router()

//@ts-ignore
parkingSlotRouter.post("/", adminMiddleware,  asyncHandler(addParkingSlot))

//@ts-ignore
parkingSlotRouter.put("/:slotId",adminMiddleware, asyncHandler(updateParkingSlot))

//@ts-ignore
parkingSlotRouter.get("/:slotId",authMiddleware, asyncHandler(getSingleParkingSlot))

//@ts-ignore
parkingSlotRouter.get("/",authMiddleware, asyncHandler(getAllParkingSlots))

//@ts-ignore
parkingSlotRouter.delete("/:slotId",adminMiddleware, asyncHandler(deleteParkingSlot))

//@ts-ignore
parkingSlotRouter.delete("/",adminMiddleware, asyncHandler(deleteAllParkingSlots))