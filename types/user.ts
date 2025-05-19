import { UserRole } from "../constants/common";

export interface IUser{
    id?: string;
    name: string;
    email: string;
    password: string;
    role:  UserRole;
}

export interface ILogin{
    email: string;
    password: string;
}