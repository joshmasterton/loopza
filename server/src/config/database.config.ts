import dotenv from "dotenv";
import path from "path";
import pg from "pg";
import {
  createLikesDislikesTable,
  createPostsCommentsTable,
  createUserTable,
} from "../database/tables.database";
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

const { POSTGRES_ADMIN_URL, POSTGRES_DB } = process.env;

export const adminPool = new Pool({
  connectionString: POSTGRES_ADMIN_URL,
});

export class TableConfig {
  private usersTable: string;
  private postsCommentsTable: string;
  private likesDislikesTable: string;

  constructor(
    usersTable = "users",
    postsCommentsTable = "posts_comments",
    likesDislikesTable = "likes_dislikes"
  ) {
    this.usersTable = usersTable;
    this.postsCommentsTable = postsCommentsTable;
    this.likesDislikesTable = likesDislikesTable;
  }

  getUsersTable() {
    return this.usersTable;
  }

  getPostsCommentsTable() {
    return this.postsCommentsTable;
  }

  getLikesDislikesTable() {
    return this.likesDislikesTable;
  }

  setUsersTable(name: string) {
    this.usersTable = name;
  }

  setPostsCommentsTable(name: string) {
    this.postsCommentsTable = name;
  }

  setLikesDislikesTable(name: string) {
    this.likesDislikesTable = name;
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

export const initializeDatabase = async (
  usersTable = "users",
  postsCommentsTable = "posts_comments",
  likesDislikesTable = "likes_dislikes"
) => {
  await createDatabase();
  await createUserTable(usersTable);
  await createPostsCommentsTable(postsCommentsTable);
  await createLikesDislikesTable(likesDislikesTable);
};
