import { describe, expect, test } from "vitest";
import { app } from "../../src/app";
import path from "path";
import request from "supertest";

describe("/auth/login", () => {
  test("Should return tokens upon successful login", async () => {
    await request(app)
      .post("/auth/signup")
      .field({
        username: "testUser",
        email: "testEmail@email.com",
        password: "Password",
        confirmPassword: "Password",
      })
      .attach(
        "profilePicture",
        path.resolve(__dirname, "..", "mocks", "mockImage.jpg")
      );

    const login = await request(app).post("/auth/login").send({
      username: "testUser",
      password: "Password",
    });

    expect(login.header["set-cookie"][0]).toBeDefined();
    expect(login.header["set-cookie"][1]).toBeDefined();
  });

  test("Should return error if no user found", async () => {
    const login = await request(app).post("/auth/login").send({
      username: "testUser",
      password: "Password",
    });

    expect(login.body.error).toBe("User login failed");
  });

  test("Should return error if invalid username", async () => {
    const login = await request(app).post("/auth/login").send({
      username: "test",
      password: "Password",
    });

    expect(login.body.error).toBe("Username must be at least 6 characters");
  });

  test("Should return error if invalid password", async () => {
    const login = await request(app).post("/auth/login").send({
      username: "testUser",
      password: "Pass",
    });

    expect(login.body.error).toBe("Password must be at least 6 characters");
  });
});
