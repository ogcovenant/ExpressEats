import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import logger from "./utils/logger";
import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";

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



export default app;
