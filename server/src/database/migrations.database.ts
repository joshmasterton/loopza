import { queryDatabase } from "../config/database.config";

const createUsersTable = async (usersTableName = "users") => {
  await queryDatabase(`
		CREATE TABLE IF NOT EXISTS ${usersTableName}(
			id SERIAL PRIMARY KEY,
			username VARCHAR(100),
			email VARCHAR(500),
			following INT DEFAULT 0,
			likes INT DEFAULT 0,
			comments INT DEFAULT 0,
			password VARCHAR(500),
			created_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);
	`);
};

const dropUsersTable = async (usersTableName = "users") => {
  await queryDatabase(`DROP TABLE IF EXISTS ${usersTableName}`);
};

export const runMigrations = async (usersTableName = "users") => {
  await createUsersTable(usersTableName);
};

export const cleanupMigrations = async (usersTableName = "users") => {
  await dropUsersTable(usersTableName);
};
