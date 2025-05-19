import { Router } from "express";
import { asyncHandler } from "../utils/handlerWrapper";
import { approveRequest, getAllParkingSlotRequests, getParkingSlotRequest, rejectRequest, requestParkingSlot, updateParkingSlotRequest } from "../controllers/slotReservationController";
import { deleteAllParkingSlots, deleteParkingSlot } from "../controllers/parkingSlotController";

export const reservationRouter = Router()

reservationRouter.post("/reserve", asyncHandler(requestParkingSlot))
reservationRouter.put("/:reservationId", asyncHandler(updateParkingSlotRequest))
reservationRouter.put("/approve:reservationId", asyncHandler(approveRequest))
reservationRouter.put("/reject:reservationId", asyncHandler(rejectRequest))
reservationRouter.get("/:reservationId", asyncHandler(getParkingSlotRequest))
reservationRouter.get("/", asyncHandler(getAllParkingSlotRequests))
reservationRouter.delete("/:reservationId", asyncHandler(deleteParkingSlot))
reservationRouter.delete("/", asyncHandler(deleteAllParkingSlots))