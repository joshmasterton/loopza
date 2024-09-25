import { queryDatabase } from "./query.database";

export const createUserTable = async (usersTable = "users") => {
  try {
    await queryDatabase(
      `CREATE TABLE IF NOT EXISTS ${usersTable}(
				id SERIAL PRIMARY KEY,
				username VARCHAR(500),
				username_lower_case VARCHAR(500),
				email VARCHAR(500),
				password VARCHAR(500),
				profile_picture_url VARCHAR(500),
				refresh_token TEXT DEFAULT NULL,
				followers INT DEFAULT 0,
				following INT DEFAULT 0,
				comments INT DEFAULT 0,
				likes INT DEFAULT 0,
				dislikes INT DEFAULT 0,
				created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
			)`
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};

export const dropTables = async (usersTable = "users") => {
  try {
    await queryDatabase(`DROP TABLE IF EXISTS ${usersTable}`);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
