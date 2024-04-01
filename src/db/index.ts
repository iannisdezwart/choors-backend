import { Pool } from "pg";
import { Environment } from "../env/Environment";
import { performMigrations } from "./migrations/perform-migrations";

export const connectToDb = async (env: Environment) => {
  const pool = new Pool({
    user: env.dbUser,
    host: env.dbHost,
    database: env.dbName,
    password: env.dbPassword,
    port: env.dbPort,
  });

  await performMigrations(pool);

  return pool;
};
