import pg from "pg";
import { Environment } from "../env/Environment.js";
import { performMigrations } from "./migrations/perform-migrations.js";

export const connectToDb = async (env: Environment) => {
  const pool = new pg.Pool({
    user: env.dbUser,
    host: env.dbHost,
    database: env.dbName,
    password: env.dbPassword,
    port: env.dbPort,
  });

  await performMigrations(pool);

  return pool;
};
