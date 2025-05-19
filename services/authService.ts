import { PrismaClient } from "@prisma/client";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../exceptions/errors";
import crypto, { randomBytes } from "crypto";
import { checkServerIdentity } from "tls";
import { IUser } from "../types/user";
import { validateEnums } from "../utils/checkValidEnum";
import {
  EMAIL_CONTEXT,
  UserRole,
  VERIFICATION_CODE_STATUS,
} from "../constants/common";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { emailSender } from "../utils/emailSender";
import * as confirmTokenService from "./tokenConfirmation";
import { CLIENT_URL } from "../constants/envVars";

const prisma = new PrismaClient();

export const register = async (user: IUser) => {
  const { email, name, password, role } = user;

  // Check if valid role is passed
  validateEnums({
    userRole: { value: role, enumType: UserRole },
  });

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser?.id) throw new BadRequestError("Email is used already");

  const saltRounds = 12;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
    },
  });

  // Generate the payload for jwt generation
  const payoad = {
    id: newUser.id,
    role: newUser.role,
    email: newUser.email,
  };

  // Generate the jwt
  const token = generateToken(payoad);
  const { password: pword, ...rest } = newUser;

  return {
    token,
    entity: rest,
  };
};

export const login = async (email: string, password: string) => {
  const userToLogin = await prisma.user.findUnique({ where: { email } });

  // Check if the user is registered
  if (!userToLogin?.id) throw new BadRequestError("User not found");

  // Check if the passwords match
  if (userToLogin?.id) {
    if (!(await bcrypt.compare(password, userToLogin.password))) {
      throw new BadRequestError("Invalid password");
    }
  }

  // Generate OTP
  const verificationCode = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 1 * 60 * 1000); //30 seconds expiry

  // First check if any records
  const records = await prisma.verificationCode.findMany({ where: { email } });
  if (records.length !== 0) {
    // Delete all verification codes related to the email
    await prisma.verificationCode.delete({ where: { email } });
  }

  // Generate verificationCode
  const codeToVerify = await prisma.verificationCode.create({
    data: {
      email,
      code: verificationCode,
      expiresAt,
      codeStatus: VERIFICATION_CODE_STATUS.AVAILABLE,
    },
  });

  // Send verificationCode to email
  emailSender({
    emailContext: EMAIL_CONTEXT.OTP,
    signInEmail: email,
    verificationCode: codeToVerify.code,
  });

  const { password: pword, ...rest } = userToLogin;

  return rest;
};

export const verifyOtp = async (email: string, otpCode: string) => {
  // Check if email and code is provided
  if (!email) {
    throw new BadRequestError("No email provided");
  } else if (!otpCode) {
    throw new BadRequestError("No code to verify");
  }

  //Check if the email exists
  const userToLogin = await prisma.user.findUnique({ where: { email } });

  if (!userToLogin?.id) throw new NotFoundError("Invalid email");

  // Obtain the otp to be verfied
  const otpRecord = await prisma.verificationCode.findUnique({
    where: { email, code: otpCode },
  });

  // Check if the code is reused
  if (!otpRecord) {
    throw new UnauthorizedError("Invalid code");
  }

  // Delete the used otp
  if (otpRecord.codeStatus === VERIFICATION_CODE_STATUS.USED) {
    await prisma.verificationCode.delete({ where: { email, code: otpCode } });
    throw new UnauthorizedError("OTP is only used once");
  }
  // Check if the expiry date of code has reached
  if (otpRecord.expiresAt < new Date()) {
    otpRecord.codeStatus = VERIFICATION_CODE_STATUS.USED;
    await prisma.verificationCode.update({
      where: { id: otpRecord.id },
      data: otpRecord,
    });
    throw new UnauthorizedError("code expired");
  }

  // Update the code as USED
  otpRecord.codeStatus = VERIFICATION_CODE_STATUS.USED;
  await prisma.verificationCode.update({
    where: { id: otpRecord.id },
    data: otpRecord,
  });

  //   Generate the jwt and send it to the user
  const payload = {
    id: userToLogin.id,
    email: userToLogin.email,
    role: userToLogin.role,
  };
  // Generate the jwtToken
  const token = generateToken(payload);
  const { password: pword, ...rest } = userToLogin;

  return {
    entity: rest,
    token,
  };
};

export const resendOTP = async (email: string) => {
  // generate verfication code
  const verificationCode = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 1 * 60 * 1000); //30 seconds expiry

  // Delete all codes related to that email
  await prisma.verificationCode.deleteMany({ where: { email } });

  // Create a new verification code
  const codeToVerify = await prisma.verificationCode.create({
    data: {
      code: verificationCode,
      codeStatus: VERIFICATION_CODE_STATUS.AVAILABLE,
      email,
      expiresAt,
    },
  });

  // Send the code to the email
  emailSender({
    emailContext: EMAIL_CONTEXT.OTP,
    signInEmail: email,
    verificationCode,
  });

  return "Please check your email for OTP";
};

export const requestPwordReset = async (email: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.id) throw new NotFoundError("User not found");

  //Delete the user
  await confirmTokenService.deleteToken(user.id);

  // Generate token for reseting the password
  let resetToken = randomBytes(32).toString("hex");
  const tokenHash = await bcrypt.hash(resetToken, 10);

  // Create new confirmation token
  const token = await confirmTokenService.createConfirmToken(
    tokenHash,
    user.id
  );
  console.log("tokennnn ", token);

  if (!CLIENT_URL) throw new BadRequestError("No client URL specified");

  // Link to be sent
  const link = `${CLIENT_URL}/reset_password/?token=${token.token}&email=${email}`;

  // Send password reset link to user
  emailSender({
    emailContext: EMAIL_CONTEXT.PASSWORD_RESET,
    passwordResetLink: link,
    resettingEmail: email,
  });

  return "Request accepted! Please check your email";
};

export const changePassword = async (
  newPassword: string,
  token: string,
  email: string
) => {
  // Check if user exists by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.id) throw new BadRequestError("Invalid link or expired");

  // Check if token associated exists
  const confirmToken = await confirmTokenService.findOneByUserId(user.id);
  if (!confirmToken) throw new BadRequestError("Invalid link or expired");
  if (confirmToken.token !== token)
    throw new BadRequestError("Invalid link or expired");

  // Hash new password
  const saltRounds = 10;
  const hashedNewPword = await bcrypt.hash(newPassword, saltRounds);

  // Return updated user with new password

  const result = await prisma.user.update({
    where: { email },
    data: {
      password: hashedNewPword,
    },
  });

  return result;
};
