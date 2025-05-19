import { Router } from "express";
import { asyncHandler } from "../utils/handlerWrapper";
import { approveRequest, getAllParkingSlotRequests, getMyParkingSlotRequests, getParkingSlotRequest, rejectRequest, requestParkingSlot, updateParkingSlotRequest } from "../controllers/slotReservationController";
import { deleteAllParkingSlots, deleteParkingSlot } from "../controllers/parkingSlotController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

export const reservationRouter = Router()

//@ts-ignore
reservationRouter.post("/reserve",authMiddleware,  asyncHandler(requestParkingSlot))
//@ts-ignore
reservationRouter.put("/:reservationId",authMiddleware, asyncHandler(updateParkingSlotRequest))
//@ts-ignore
reservationRouter.put("/approve:reservationId",adminMiddleware, asyncHandler(approveRequest))
//@ts-ignore
reservationRouter.put("/reject:reservationId",adminMiddleware,  asyncHandler(rejectRequest))
//@ts-ignore
reservationRouter.get("/:reservationId",authMiddleware, asyncHandler(getParkingSlotRequest))
//@ts-ignore
reservationRouter.get("/",adminMiddleware, asyncHandler(getAllParkingSlotRequests))
//@ts-ignore
reservationRouter.get("/mine",authMiddleware, asyncHandler(getMyParkingSlotRequests))
//@ts-ignore
reservationRouter.delete("/:reservationId",adminMiddleware, asyncHandler(deleteParkingSlot))
//@ts-ignore
reservationRouter.delete("/",adminMiddleware, asyncHandler(deleteAllParkingSlots))