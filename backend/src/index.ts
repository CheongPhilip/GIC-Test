import dotenv from "dotenv";
import database from "./db";
import CustomError from "./utils/error";
import { HttpStatus } from "@shared/constants/enums";
dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_PORT || !DB_USERNAME || !DB_PASSWORD || !DB_NAME) {
  throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, "Database configuration is missing");
}

(async () => {
  try {
    await database.connect(DB_HOST, parseInt(DB_PORT), DB_USERNAME, DB_PASSWORD, DB_NAME);
  } catch (error) {
    console.error("Failed to connect to the database", error);
    throw error;
  }

  try {
    await database.initSequelize();
    await import("./app");
  } catch (error) {
    console.error("Failed to initialize models", error);
    throw error;
  }
})();
