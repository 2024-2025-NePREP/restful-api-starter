import { UserRole } from "../constants/common";

export interface IUser{
    id?: string;
    name: string;
    email: string;
    password: string;
    role:  UserRole;
    createdAt?: Date
    updatedAt?: Date
}

export interface ILogin{
    email: string;
    password: string;
}