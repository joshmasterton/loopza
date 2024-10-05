import { beforeEach, afterEach, vitest, Mock, beforeAll } from "vitest";
import { dropTables } from "./src/database/tables.database";
import { tableConfig } from "./src/app";
import { adminPool, initializeDatabase } from "./src/config/database.config";
import { v4 } from "uuid";
import { uploadImage } from "./src/config/cloudinary.config";

const checkDatabaseReady = async () => {
  const client = await adminPool.connect();
  try {
    await client.query("SELECT 1");
  } catch {
    const retryInterval = 5000;
    console.log(
      `Retrying database connection in ${retryInterval / 1000} seconds...`
    );
    setTimeout(checkDatabaseReady, retryInterval);
  } finally {
    client.release();
  }
};

vitest.mock("./src/config/cloudinary.config", () => ({
  uploadImage: vitest.fn(),
}));

beforeAll(async () => {
  await checkDatabaseReady();
});

beforeEach(async () => {
  (uploadImage as Mock).mockResolvedValue("http://fakeurl.com");

  tableConfig.setUsersTable(`test_users_${v4().replace(/-/g, "_")}`);
  tableConfig.setPostsCommentsTable(
    `test_posts_comments_${v4().replace(/-/g, "_")}`
  );

  await initializeDatabase(
    tableConfig.getUsersTable(),
    tableConfig.getPostsCommentsTable()
  );
});

afterEach(async () => {
  await dropTables(
    tableConfig.getUsersTable(),
    tableConfig.getPostsCommentsTable()
  );
});
