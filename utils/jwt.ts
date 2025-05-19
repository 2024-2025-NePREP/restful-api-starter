import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../exceptions/errors";
import { JWT_SECRET } from "../constants/envVars";
dotenv.config();


export const generateToken = (user:any) => {
  if (!JWT_SECRET) {
    throw new NotFoundError("Jwt secret key to sign token, not found");
  }

  if (!user.id) {
    throw new BadRequestError("No user specified for token generation");
  }

  try {
    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '1d' });

    return token;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = (token: string) => {
  try {
    if (!JWT_SECRET) {
      throw new NotFoundError("Jwt secret key not provided");
    } else if (!token) {
      throw new UnauthorizedError("Auth Token required");
    }

    const decodedUser = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return {
      decodedUser,
    };
  } catch (error) {
    throw error;
  }
};
