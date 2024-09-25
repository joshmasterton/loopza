import dotenv from "dotenv";
import path from "path";
import pg from "pg";
import { createUserTable, dropTables } from "../database/tables.database";
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

const adminPool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  password: POSTGRES_PASSWORD,
});

export class TableConfig {
  private usersTable: string;

  constructor(usersTable: string) {
    this.usersTable = usersTable;
  }

  getUsersTable() {
    return this.usersTable;
  }

  setUsersTable(name: string) {
    this.usersTable = name;
  }
}

export const createDatabase = async () => {
  const client = await adminPool.connect();

  try {
    const databaseCheck = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [POSTGRES_DB]
    );

    if (databaseCheck.rowCount === 0) {
      await client.query(`CREATE DATABASE ${POSTGRES_DB}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  } finally {
    client.release();
  }
};

export const initializeDatabase = async (usersTable = "users") => {
  await createDatabase();
  await dropTables(usersTable);
  await createUserTable(usersTable);
};
