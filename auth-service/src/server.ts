import app from "./app";
import logger from "./utils/logger";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    logger.info("Connected to MongoDB...");
  })
  .catch((error) => {
    logger.error("MongoDB connection error: ", error);
  });

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
