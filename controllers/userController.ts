import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../exceptions/errors";
import * as userService from "../services/userService"
import { ApiResponse } from "../apiResponse/response";

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const user = await userService.getById(userId)
        return res.status(200).json(new ApiResponse("User retrieved successfully", user))
    } catch (error) {
        if (error instanceof BadRequestError) {
            return res.status(400).json(new ApiResponse(error.message, null))
        } else if (error instanceof NotFoundError) {
            return res.status(404).json(new ApiResponse(error.message, null))
        } else if (error instanceof Error) {
            return res.status(400).json(new ApiResponse(error.message, null))
        }
    }
}

export const updateUserById = async (req: Request, res: Response) => {
    try {
        const userData = req.body
        const { userId } = req.params

        const updated = await userService.updateById(userId, userData)
        return res.status(200).json(new ApiResponse("Updated user successfully", updated))
    } catch (error) {
        if (error instanceof BadRequestError) {
            return res.status(400).json(new ApiResponse(error.message, null))
        } else if (error instanceof NotFoundError) {
            return res.status(404).json(new ApiResponse(error.message, null))
        } else if (error instanceof Error) {
            return res.status(400).json(new ApiResponse(error.message, null))
        }
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAll()
        return res.status(200).json(new ApiResponse("All users retrieved successfully", users))
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json(new ApiResponse(error.message, null))
        }
    }
}




export const deleteUserById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const result = await userService.deleteById(userId)
        return res.status(200).json(new ApiResponse(result, null))


    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json(new ApiResponse(error.message, null))
        } else if (error instanceof BadRequestError) {
            return res.status(400).json(new ApiResponse(error.message, null))
        } else if (error instanceof Error) {
            return res.status(400).json(new ApiResponse(error.message, null))
        }
    }
}


export const deleteAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.deleteAll()
        return res.status(200).json(new ApiResponse(result, null))

    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json(new ApiResponse(error.message, null))
        }
    }
}
