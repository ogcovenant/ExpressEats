import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import logger from "./utils/logger";
import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import responseObject from "./helpers/response-object.helper";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

const redisClient = new Redis(process.env.REDIS_URL as string);

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

app.use((req: Request, res: Response, next: NextFunction) => {
  rateLimiter
    .consume(<string>req.ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded for ${req.ip}`);
      res.status(429).json(
        responseObject({
          success: false,
          message: "Too many requests",
        })
      );
    });
});

export default app;
