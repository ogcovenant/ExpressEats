import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import responseObject from "./response-object.helper";

export class APIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
  }
}

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const globalErrorhandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  logger.error("An error occured:", err.stack);

  if (err instanceof APIError) {
    return res.status(err.statusCode).json(
      responseObject({
        success: false,
        message: err.message,
      })
    );
  } else {
    return res.status(500).json(
      responseObject({
        success: false,
        message: "An unexpected error occured",
      })
    );
  }
};
