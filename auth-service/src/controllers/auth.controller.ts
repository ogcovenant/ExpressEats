import { Request, Response } from "express";
import logger from "../utils/logger";
// import { APIError } from "../helpers/error-handler.helper";
import { validateRegistration } from "../helpers/validation.helper";
import { User } from "../models/user";
import responseObject from "../helpers/response-object.helper";
import { generateToken } from "../helpers/token.helper";

export const register = async (req: Request, res: Response): Promise<any> => {
  logger.info("User registration endpoint hit.....");

  try {
    const { error } = validateRegistration(req.body);

    if (error) {
      logger.warn(
        "Validation error on the register endpoint....",
        error.details[0].message
      );

      return res.status(400).json(
        responseObject({
          success: false,
          message: error.details[0].message,
        })
      );
    }

    const { email, password, username } = req.body;

    let existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      logger.warn("User with credentials already existing...");

      return res.status(400).json(
        responseObject({
          success: false,
          message: "User already exists",
        })
      );
    }

    let user = new User({ username, email, password });
    await user.save();

    const { accessToken, refreshToken } = await generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    logger.error("An error occured in the registration endpoint....", err);

    return res.status(500).json(
      responseObject({
        success: false,
        message: "An unexpected error occured",
      })
    );
  }
};

export const login = async (req: Request, res: Response) => {};

export const refreshToken = async (req: Request, res: Response) => {};

export const logout = async (req: Request, res: Response) => {};
