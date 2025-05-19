// import dotenv from "dotenv";
// import { NextFunction, Request, Response } from "express";
// import {
//   BadRequestError,
//   ForbiddenError,
//   NotFoundError,
//   UnauthorizedError,
// } from "../exceptions/errors";
// import { verifyToken } from "../utils/jwt";
// import jwt from "jsonwebtoken";

// import { AUTH_COOKIE_NAME } from "../constants/common";
// import { PrismaClient } from "@prisma/client";
// import { ADMIN_EMAIL } from "../constants/envVars";
// import { ApiResponse } from "../apiResponse/response";

// dotenv.config();

// const prisma = new PrismaClient();

// export const adminMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.cookies[AUTH_COOKIE_NAME];

//     if (!token) {
//       throw new UnauthorizedError("Please login first");
//     }

//     const decodedToken = verifyToken(token);
//     //@ts-ignore
//     const user = decodedToken?.decodedUser?.user;

//     const currentUser = await prisma.user.findUnique({
//       where: { email: user.email },
//     });

//     if (!currentUser) {
//       throw new BadRequestError("Invalid token, user not found");
//     } else if (currentUser.email != ADMIN_EMAIL) {
//       throw new ForbiddenError("Operation not allowed");
//     }

//     const { password, ...rest } = currentUser;
//     req.user = rest;

//     next();
//   } catch (error) {
//     // Handle token expiration/errors
//     if (
//       error instanceof jwt.TokenExpiredError ||
//       error instanceof jwt.JsonWebTokenError
//     ) {
//       res.clearCookie(AUTH_COOKIE_NAME);
//       req.user = null;
//       const message =
//         error instanceof jwt.TokenExpiredError
//           ? `${error.message}, Please login again`
//           : error.message;
//       return res.status(401).json(new ApiResponse(message, null));
//     }

//     // Handle known custom errors
//     if (
//       error instanceof BadRequestError ||
//       error instanceof UnauthorizedError ||
//       error instanceof ForbiddenError ||
//       error instanceof NotFoundError
//     ) {
//       const statusCode =
//         error instanceof UnauthorizedError
//           ? 401
//           : error instanceof ForbiddenError
//           ? 403
//           : error instanceof NotFoundError
//           ? 404
//           : 400;
//       return res.status(statusCode).json(new ApiResponse(error.message, null));
//     } // Fallback for unexpected errors

//     console.error("AdminMiddleware error:", error);
//     return res.status(500).json(new ApiResponse("Internal server error", null));
//   } finally {
//     await prisma.$disconnect();
//   }
// };


import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { 
  BadRequestError, 
  ForbiddenError, 
  UnauthorizedError 
} from '../exceptions/errors';
import { verifyToken } from '../utils/jwt';
import { AUTH_COOKIE_NAME } from '../constants/common';
import { ADMIN_EMAIL } from '../constants/envVars';

// Initialize Prisma client once (not per request)
const prisma = new PrismaClient();

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Get token from cookies
  const token = req.cookies[AUTH_COOKIE_NAME];
  // console.log("token ", token)
  if (!token) {
    return res.status(401).json({ message: 'Please login first' });
  }

  try {
    // 2. Verify token
    const decoded = verifyToken(token);


    if (!decoded?.decodedUser?.user?.email) {
      throw new BadRequestError('Invalid token structure');
    }

    // 3. Find user in database
    const user = await prisma.user.findUnique({
      where: { email: decoded.decodedUser.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    // 4. Verify admin privileges
    if (user.email !== ADMIN_EMAIL) {
      throw new ForbiddenError('Operation not allowed');
    }

    // 5. Attach user to request
    req.user = user;
    next();

  } catch (error) {
    // Handle JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      res.clearCookie(AUTH_COOKIE_NAME);
      return res.status(401).json({ 
        message: 'Session expired. Please login again' 
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.clearCookie(AUTH_COOKIE_NAME);
      return res.status(401).json({ 
        message: 'Invalid token' 
      });
    }

    // Handle custom errors
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ message: error.message });
    }

    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }

    if (error instanceof BadRequestError) {
      return res.status(400).json({ message: error.message });
    }

    // Unknown errors
    console.error('AdminMiddleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};