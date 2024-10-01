import { beforeEach, afterEach, vitest, Mock } from "vitest";
import { dropTables } from "./src/database/tables.database";
import { tableConfig } from "./src/app";
import { initializeDatabase } from "./src/config/database.config";
import { v4 } from "uuid";
import { uploadImage } from "./src/config/cloudinary.config";

vitest.mock("./src/config/cloudinary.config", () => ({
  uploadImage: vitest.fn(),
}));

beforeEach(async () => {
  (uploadImage as Mock).mockResolvedValueOnce("http://fakeurl.com");

  tableConfig.setUsersTable(`test_users_${v4().replace(/-/g, "_")}`);
  await initializeDatabase(tableConfig.getUsersTable());
});

afterEach(async () => {
  await dropTables(tableConfig.getUsersTable());
});
