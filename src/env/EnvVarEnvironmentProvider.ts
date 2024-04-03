import bytes from "bytes";
import dotenv from "dotenv";
import { Environment } from "./Environment.js";
import { IEnvironmentProvider } from "./IEnvironmentProvider.js";

export class EnvVarEnvironmentProvider implements IEnvironmentProvider {
  getEnvironment(): Environment {
    dotenv.config();

    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret == null) {
      throw new Error("JWT_SECRET environment variable is not set.");
    }

    const apiPortStr = process.env.API_PORT;
    if (apiPortStr == null) {
      throw new Error("API_PORT environment variable is not set.");
    }

    const dbHost = process.env.DB_HOST;
    if (dbHost == null) {
      throw new Error("DB_HOST environment variable is not set.");
    }

    const dbPortStr = process.env.DB_PORT;
    if (dbPortStr == null) {
      throw new Error("DB_PORT environment variable is not set.");
    }

    const dbName = process.env.DB_NAME;
    if (dbName == null) {
      throw new Error("DB_NAME environment variable is not set.");
    }

    const dbUser = process.env.DB_USER;
    if (dbUser == null) {
      throw new Error("DB_USER environment variable is not set.");
    }

    const dbPassword = process.env.DB_PASSWORD;
    if (dbPassword == null) {
      throw new Error("DB_PASSWORD environment variable is not set.");
    }

    const pictureStoragePath = process.env.PICTURE_STORAGE_PATH;
    if (pictureStoragePath == null) {
      throw new Error("PICTURE_STORAGE_PATH environment variable is not set.");
    }

    const pictureMaxSizeStr = process.env.PICTURE_MAX_SIZE;
    if (pictureMaxSizeStr == null) {
      throw new Error("PICTURE_MAX_SIZE environment variable is not set.");
    }

    const schedulerIntervalStr = process.env.SCHEDULER_INTERVAL;
    if (schedulerIntervalStr == null) {
      throw new Error("SCHEDULER_INTERVAL environment variable is not set.");
    }

    return {
      apiPort: parseInt(apiPortStr),
      jwtSecret,
      dbHost,
      dbPort: parseInt(dbPortStr),
      dbName,
      dbUser,
      dbPassword,
      pictureStoragePath,
      pictureMaxSize: bytes(pictureMaxSizeStr),
      schedulerInterval: parseInt(schedulerIntervalStr),
    };
  }
}
