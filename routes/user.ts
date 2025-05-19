import { Router } from "express";
import { deleteAllUsers, deleteUserById, getAllUsers, getUserById, updateUserById } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

export const userRouter = Router()

// @ts-ignore
userRouter.get(`/all`, getAllUsers)

// @ts-ignore
userRouter.get(`/:userId`,adminMiddleware, getUserById)

// @ts-ignore
userRouter.put(`/:userId`,authMiddleware, updateUserById)

// @ts-ignore
userRouter.delete(`/:userId`, deleteUserById)

// @ts-ignore
userRouter.delete(`/all`,adminMiddleware, deleteAllUsers)
