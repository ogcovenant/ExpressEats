import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/refresh-token";
import * as crypto from "crypto";

export const generateToken = async (user: any) => {
  const accessToken = await jwt.sign(
    {
      userId: user._id,
      username: user.username,
    },
    <string>process.env.JWT_SECRET,
    { expiresIn: "60m" }
  );

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
  });

  return { accessToken, refreshToken };
};
