import { Router } from "express";
import { deleteAllUsers, deleteUserById, getAllUsers, getUserById, updateUserById } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const userRouter = Router()

// @ts-ignore
userRouter.get(`/all`, getAllUsers)

// @ts-ignore
userRouter.get(`/:userId`,authMiddleware, getUserById)

// @ts-ignore
userRouter.put(`/:userId`,authMiddleware, updateUserById)

// @ts-ignore
userRouter.delete(`/:userId`,authMiddleware, deleteUserById)

// @ts-ignore
userRouter.delete(`/all`,authMiddleware, deleteAllUsers)
