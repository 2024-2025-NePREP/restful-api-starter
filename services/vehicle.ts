import { PrismaClient, VehicleSize, VehicleType } from "@prisma/client";
import { IVehicle } from "../types/vehicle";
import { validateEnums } from "../utils/checkValidEnum";
import { BadRequestError, NotFoundError } from "../exceptions/errors";
import { isValidUUID } from "../utils/checkUUIDString";
import { isValidPlateNumber } from "../utils/checkPlateNumberValidity";

const prisma = new PrismaClient();

export const addVehicle = async (vehicle: IVehicle) => {
  const { userId, plateNumber, vehicleType, size, color, model } = vehicle;

  //   Check if userId is a valid UUID
  isValidUUID(userId);

  //   Check if valid plate number is passed
  isValidPlateNumber(plateNumber);

  // Check if vehicle size and type are valid
  validateEnums({
    size: { value: size, enumType: VehicleSize },
    vehicleType: { value: vehicleType, enumType: VehicleType },
  });

  // Check if the user exists with userId
  const vehicleOwner = await prisma.user.findUnique({ where: { id: userId } });
  if (!vehicleOwner?.id)
    throw new NotFoundError("User not found! create a user first");

  return await prisma.vehicle.create({
    data: {
      userId,
      plateNumber,
      vehicleType,
      size,
      color,
      model,
    },
  });
};
export const updateVehicle = async (vehicleId: string, vehicle: IVehicle) => {
  const { color, model, plateNumber, size, userId, vehicleType } = vehicle;

  // Check if userId and vehicleId are valid UUIDs
  [vehicleId, userId].forEach((id) => isValidUUID(id));

  //   Check valid plate number
  isValidPlateNumber(plateNumber);

  // Check if vehicle size and type are valid enums
  validateEnums({
    size: { value: size, enumType: VehicleSize },
    vehicleType: { value: vehicleType, enumType: VehicleType },
  });

  const toBeUpdated = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });

  // Check if vehicle passed has its vehicle
  if (!toBeUpdated?.id) throw new NotFoundError("Vehicle not found");

  // Check if the user exists with userId
  const vehicleOwner = await prisma.user.findUnique({ where: { id: userId } });
  if (!vehicleOwner?.id)
    throw new NotFoundError("User not found! create a user first");

  //   Check if the userIds are different
  if (toBeUpdated.userId !== userId)
    throw new BadRequestError(
      "You cannot update this vehicle, it belongs to another user"
    );

  // Then update the vehicle
  return await prisma.vehicle.update({
    where: { id: vehicleId },
    data: {
      color,
      model,
      plateNumber,
      size,
      userId,
      vehicleType,
    },
  });
};

export const getSingleVehicle = async (vehicleId: string) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle?.id) throw new NotFoundError("Vehicle not found");
  return vehicle;
};

export const getAllVehicles = async () => {
  /**Check if pageNumber is not 0
//   if (pageNumber < 0) {
//     throw new BadRequestError("Page number cannot be less than 0");
//   }

//   //   Check if limit is between 1 and 100
//   if (limit < 1 || limit > 100) {
//     throw new BadRequestError("Limit must be between 1 and 100");
//   }

//   //   computer the skip
//   const skip = (pageNumber - 1) * limit;

// //   Implement pagination
//   const [totalCount, vehicles] = await Promise.all(
//     [
//         prisma.vehicle.count(),
//         prisma.vehicle.findMany({
//             skip,
//             take: limit,
//             orderBy: { plateNumber:"asc"}
//         })
//     ]
//   ) ;

//   const totalPages =Math.ceil(totalCount / limit);
 */ 

//  Without pagination
 const vehicles =await prisma.vehicle.findMany()
 
//  With pagination
//   return {
//     vehicles,
//     totalCount,
//     itemsPerPage: limit,
//     totalPages,
//     currentPage: pageNumber,
//     hasNextPage: pageNumber<totalPages,
//     hasPreviousPage: pageNumber >1
//   };
return vehicles
};

export const deleteVehicle = async (vehicleId: string) => {
  // Check if the vehicle exists
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle?.id) throw new NotFoundError("Vehicle not found");

  //   Then delete vehicle
  await prisma.vehicle.delete({ where: { id: vehicleId } });
  return "Vehicle deleted successfully";
};

export const deleteAllVehicles = async () => {
  await prisma.vehicle.deleteMany();
  return "Deleted all vehicles successfully";
};
