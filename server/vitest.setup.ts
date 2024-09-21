import { beforeEach, afterEach } from "vitest";
import {
  cleanupMigrations,
  runMigrations,
} from "./src/database/migrations.database";

let usersTableName: string;

beforeEach(async () => {
  usersTableName = `test_users_${Date.now()}`;
  await runMigrations(usersTableName);
});

afterEach(async () => {
  await cleanupMigrations(usersTableName);
});
