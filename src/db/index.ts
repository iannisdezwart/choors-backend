import { Pool } from "pg";
import { performMigrations } from "./migrations/perform-migrations";

export const connectToDb = async () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
  });

  await performMigrations(pool);

  return pool;
};
