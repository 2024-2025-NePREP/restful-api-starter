import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../apiResponse/response";

// This middleware is for preventing cross site tracing attacks -> xst
export const httpMethodMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const allowedMethods = [
        "OPTIONS",
        "HEAD",
        "CONNECT",
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
    ]

    if(!allowedMethods.includes(req.method)){
        res.status(405).json(new ApiResponse(`${req.method} is not allowed}`, null))
    }

    next()
}