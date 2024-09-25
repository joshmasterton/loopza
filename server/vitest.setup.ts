import { beforeEach, afterEach } from "vitest";
import { dropTables } from "./src/database/tables.database";
import { tableConfig } from "./src/app";
import { initializeDatabase } from "./src/config/database.config";
import { v4 } from "uuid";

beforeEach(async () => {
  tableConfig.setUsersTable(`test_users_${v4().replace(/-/g, "_")}`);
  await initializeDatabase(tableConfig.getUsersTable());
});

afterEach(async () => {
  await dropTables(tableConfig.getUsersTable());
});
