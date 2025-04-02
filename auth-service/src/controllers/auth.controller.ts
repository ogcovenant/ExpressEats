import { Request, Response } from "express";
import logger from "../utils/logger";
// import { APIError } from "../helpers/error-handler.helper";
import {
  validateLogin,
  validateRefreshToken,
  validateRegistration,
} from "../helpers/validation.helper";
import { User } from "../models/user";
import responseObject from "../helpers/response-object.helper";
import { generateToken } from "../helpers/token.helper";
import { RefreshToken } from "../models/refresh-token";

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

    res.status(201).json(
      responseObject({
        success: true,
        message: "User registered successfully!",
        accessToken,
        refreshToken,
      })
    );
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

export const login = async (req: Request, res: Response): Promise<any> => {
  logger.info("User login endpoint hit.....");

  try {
    const { error } = validateLogin(req.body);

    if (error) {
      logger.warn(
        "Validation error on the login endpoint....",
        error.details[0].message
      );

      return res.status(400).json(
        responseObject({
          success: false,
          message: error.details[0].message,
        })
      );
    }

    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      logger.warn("Invalid user login credentials....", { email });

      return res.status(400).json(
        responseObject({
          success: false,
          message: "Invalid credential",
        })
      );
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn("Invalid user login credentials....", { email });

      return res.status(400).json(
        responseObject({
          success: false,
          message: "Invalid credentials",
        })
      );
    }

    const { accessToken, refreshToken } = await generateToken(user);

    res.status(200).json(
      responseObject({
        success: true,
        message: "User login successful",
        accessToken,
        refreshToken,
      })
    );
  } catch (err) {
    logger.error("An error occured in the user login endpoint....", err);

    return res.status(500).json(
      responseObject({
        success: false,
        message: "An unexpected error occured",
      })
    );
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  logger.info("Refresh token endpoint hit....");

  try {
    const { error } = validateRefreshToken(req.body);

    if (error) {
      logger.warn("An invalid refresh token was passed...", error.details[0].message);

      return res.status(400).json(
        responseObject({
          success: false,
          message: error.details[0].message,
        })
      );
    }

    const { token } = req.body;

    const storedToken = await RefreshToken.findOne({ token });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      logger.warn("Invaid or expired refresh token....");

      return res.status(401).json(
        responseObject({
          success: false,
          message: "Invalid or expired token",
        })
      );
    }

    const user = await User.findById(storedToken.user);

    if (!user) {
      logger.warn("User associated with refresh token not found....");

      return res.status(404).json(
        responseObject({
          success: false,
          message: "User not found",
        })
      );
    }

    await RefreshToken.deleteOne({ id: storedToken._id })

    const { accessToken, refreshToken } = await generateToken(user);

    return res.status(200).json(responseObject({
      success: true,
      accessToken,
      refreshToken
    }))

  } catch (err) {
    logger.error("An error occured in the refresh token endpoint....", err);

    return res.status(500).json(
      responseObject({
        success: false,
        message: "An unexpected error occured",
      })
    );
  }
};

export const logout = async (req: Request, res: Response) => {};
