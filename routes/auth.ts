import { Router } from "express";
import { changePassword, getProfile, login, logout, register, requestPwordReset, resendOTP, verifyOtp } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const authRouter = Router()

// @ts-ignore

// @ts-ignore
authRouter.post('/register/', register)

// @ts-ignore
authRouter.post('/login', login)

// @ts-ignore
authRouter.post('/verify_otp', verifyOtp)

// @ts-ignore
authRouter.post('/resend_otp', resendOTP)

// @ts-ignore
authRouter.post('/logout',authMiddleware, logout)

// @ts-ignore
authRouter.get('/me',authMiddleware, getProfile)

// @ts-ignore
authRouter.post('/forgot_password', requestPwordReset)

// @ts-ignore
authRouter.put('/change_password', changePassword)

