import dotenv from "dotenv";
import path from "path";
import pg from "pg";
import { createPostsCommentsTable, createUserTable, } from "../database/tables.database.js";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
    path: path.resolve(__dirname, "..", "..", `${process.env.NODE_ENV === "development" ? ".env.dev" : ".env.test"}`),
});
const { Pool } = pg;
const { POSTGRES_ADMIN_URL, POSTGRES_DB } = process.env;
export const adminPool = new Pool({
    connectionString: POSTGRES_ADMIN_URL,
});
export class TableConfig {
    usersTable;
    postsCommentsTable;
    constructor(usersTable = "users", postsCommentsTable = "posts_comments") {
        this.usersTable = usersTable;
        this.postsCommentsTable = postsCommentsTable;
    }
    getUsersTable() {
        return this.usersTable;
    }
    getPostsCommentsTable() {
        return this.postsCommentsTable;
    }
    setUsersTable(name) {
        this.usersTable = name;
    }
    setPostsCommentsTable(name) {
        this.postsCommentsTable = name;
    }
}
export const createDatabase = async () => {
    const client = await adminPool.connect();
    try {
        const databaseCheck = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [POSTGRES_DB]);
        if (databaseCheck.rowCount === 0) {
            await client.query(`CREATE DATABASE ${POSTGRES_DB}`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        }
    }
    finally {
        client.release();
    }
};
export const initializeDatabase = async (usersTable = "users", postsCommentsTable = "posts_comments") => {
    await createDatabase();
    await createUserTable(usersTable);
    await createPostsCommentsTable(postsCommentsTable);
};
