import { VehicleSize, VehicleType } from "@prisma/client";

export interface IVehicle{
    id?: string;
    userId: string
    plateNumber: string
    vehicleType:   VehicleType
    size: VehicleSize
    color: string
    model: string
    createdAt?: Date
    updatedAt?: Date
}