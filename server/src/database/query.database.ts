import path from "path";
import dotenv from "dotenv";
import pg from "pg";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(
    __dirname,
    "..",
    "..",
    `${process.env.NODE_ENV === "development" ? ".env.dev" : ".env.test"}`
  ),
});

const { Pool } = pg;

const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_DB, POSTGRES_PASSWORD } =
  process.env;

export const queryDatabase = async <T>(query: string, parameters?: T[]) => {
  const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
  });

  if (POSTGRES_HOST && POSTGRES_USER && POSTGRES_PASSWORD && POSTGRES_DB) {
    return await pool.query(query, parameters);
  }

  throw new Error("Environment variables not found");
};
