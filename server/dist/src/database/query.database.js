import path from "path";
import dotenv from "dotenv";
import pg from "pg";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
    path: path.resolve(__dirname, "..", "..", `${process.env.NODE_ENV === "development" ? ".env.dev" : ".env.test"}`),
});
const { Pool } = pg;
const { POSTGRES_URL } = process.env;
const pool = new Pool({
    connectionString: POSTGRES_URL,
});
export const queryDatabase = async (query, parameters) => {
    const client = await pool.connect();
    if (POSTGRES_URL) {
        try {
            return await client.query(query, parameters);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
        finally {
            client.release();
        }
    }
    throw new Error("Environment variables not found");
};
