import { Request, Response } from "express";
import * as authService from "../services/authService";
import { ApiResponse } from "../apiResponse/response";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../exceptions/errors";
import { AUTH_COOKIE_NAME } from "../constants/common";

export const register = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const registered = await authService.register(userData);

    // set the http-only cookie
    res.cookie(AUTH_COOKIE_NAME, registered.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          `Registered successfully ${registered.entity.role}`,
          registered.entity,
          registered.token
        )
      );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof BadRequestError) {
      return res.status(400).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const loginRes = await authService.login(email, password);
    return res
      .status(201)
      .json(new ApiResponse("Please check your email for OTP", loginRes));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof BadRequestError) {
      return res.status(400).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const verifyRes = await authService.verifyOtp(email, otp);
    // Api Response

    res.cookie(AUTH_COOKIE_NAME, verifyRes.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return res
      .status(200)
      .json(new ApiResponse("Welcome back", verifyRes.entity, verifyRes.token));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof BadRequestError) {
      return res.status(400).json(new ApiResponse(error.message, null));
    } else if (error instanceof UnauthorizedError) {
      return res.status(401).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await authService.resendOTP(email);
    return res.status(201).json(new ApiResponse(result, null));
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};

export const requestPwordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPwordReset(email);
    return res.status(200).json(new ApiResponse(result, null));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof BadRequestError) {
      return res.status(400).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;
    const updated = await authService.changePassword(newPassword, token, email);
    return res
      .status(200)
      .json(new ApiResponse("Password reset successfully", updated));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(new ApiResponse(error.message, null));
    } else if (error instanceof BadRequestError) {
      return res.status(400).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie(AUTH_COOKIE_NAME);
    req.user = null;

    return res
      .status(200)
      .json(new ApiResponse("Successfully logged out", null));
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).json(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};
export const getProfile = (req: Request, res: Response) => {
  try {
    return res.status(200).json(new ApiResponse("My profile", req.user));
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.clearCookie(AUTH_COOKIE_NAME);
      res.status(400).send(new ApiResponse(error.message, null));
    } else if (error instanceof Error) {
      return res.status(400).json(new ApiResponse(error.message, null));
    }
  }
};
