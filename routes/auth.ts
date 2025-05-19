import { Router } from "express";
import { changePassword, getProfile, login, logout, register, requestPwordReset, resendOTP, verifyOtp } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { asyncHandler } from "./vehicle";

export const authRouter = Router()


authRouter.post('/register/', asyncHandler(register))

authRouter.post('/login', asyncHandler(login))

authRouter.post('/verify_otp', asyncHandler(verifyOtp))

authRouter.post('/resend_otp', asyncHandler(resendOTP))

// @ts-ignore
authRouter.post('/logout',authMiddleware, logout)

// @ts-ignore
authRouter.get('/me',authMiddleware, getProfile)

authRouter.post('/forgot_password', asyncHandler(requestPwordReset))

authRouter.put('/change_password', asyncHandler(changePassword))

