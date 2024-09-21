import { describe, expect, test } from "vitest";
import { app } from "../../../src/app";
import request from "supertest";

describe("/login", () => {
  test("Should return error if invalid credentials", async () => {
    const invalidUsernameLogin = await request(app).post("/login").send({
      username: "test",
      password: "Password",
    });

    const invalidPasswordLogin = await request(app).post("/login").send({
      username: "testUser",
      password: "Pass",
    });

    expect(invalidUsernameLogin.body.error.errors[0]).toBe(
      "username must be at least 6 characters"
    );

    expect(invalidPasswordLogin.body.error.errors[0]).toBe(
      "password must be at least 6 characters"
    );
  });
});
