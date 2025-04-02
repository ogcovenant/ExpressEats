import Joi from "joi";
import {
  ILoginData,
  IRefreshTokenData,
  IRegisterData,
} from "../interfaces/validation-request.interfaces";

export const validateRegistration = (data: IRegisterData) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

export const validateLogin = (data: ILoginData) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

export const validateRefreshToken = (data: IRefreshTokenData) => {
  const schema = Joi.object({
    token: Joi.string().required(),
  });

  return schema.validate(data);
};
