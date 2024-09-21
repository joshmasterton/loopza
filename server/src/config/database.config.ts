import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(
    __dirname,
    "..",
    "..",
    `${process.env.NODE_ENV === "development" ? ".env.dev" : ".env.test"}`
  ),
});

const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;

const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  password: POSTGRES_PASSWORD,
});

export const queryDatabase = async <T>(query: string, parameters?: T[]) => {
  try {
    if (POSTGRES_HOST && POSTGRES_USER && POSTGRES_PASSWORD) {
      return await pool.query(query, parameters);
    }

    throw new Error("Environment variables not found");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
