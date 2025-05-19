// utils/handlerWrapper.ts
import { Request, Response, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response
) => Promise<Response>;

export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req, res, next) => {
    fn(req, res).catch(next);
  };
};