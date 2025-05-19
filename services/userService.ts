import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../exceptions/errors";
import { isValidUUID } from "../utils/checkUUIDString";
import { IUser } from "../types/user";

const prisma = new PrismaClient();
export const getById = async (id: string) => {
  // Check if the userId is valid UUID
  isValidUUID(id);

  // Check if the user exists
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user?.id) throw new NotFoundError("User not found");

  const { password, ...rest } = user;
  return rest;
};

export const updateById = async (id: string, userData: IUser) => {
  // Check if the userId is valid UUID
  isValidUUID(id);

  // Check if the user exists
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user?.id) throw new NotFoundError("User not found");

  const { password, ...rest } = await prisma.user.update({
    where: { id },
    data: userData,
  });

  return rest;
};

export const getAll = async () => {
  const users = await prisma.user.findMany();
  return users.map(({ password, ...rest }) => rest);
};

export const deleteById = async (id: string) => {
  // Check if id is a valid UUID
  isValidUUID(id);

  // Check if any user
  const toBeDeleted = await prisma.user.findUnique({ where: { id } });
  if (!toBeDeleted?.id) throw new NotFoundError("User not found");

  // Delete the associated user
  await prisma.user.delete({ where: { id } });

  return "Deleted successfully";
};


export const deleteAll = async () => {
  await prisma.user.deleteMany();
  return "Deleted all successfully";
};
