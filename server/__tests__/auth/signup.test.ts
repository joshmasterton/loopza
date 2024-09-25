import { describe, expect, test } from "vitest";
import { app } from "../../src/app";
import request from "supertest";
import path from "path";

describe("/auth/signup", () => {
  test("Should return tokens upon successful signup", async () => {
    const signup = await request(app)
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

    expect(signup.header["set-cookie"][0]).toBeDefined();
    expect(signup.header["set-cookie"][1]).toBeDefined();
  });

  test("Should return error if username already exists", async () => {
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

    const signup = await request(app)
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

    expect(signup.body.error).toBe("Username already in use");
  });

  test("Should return error if invalid username", async () => {
    const signup = await request(app)
      .post("/auth/signup")
      .field({
        username: "test",
        email: "testEmail@email.com",
        password: "Password",
        confirmPassword: "Password",
      })
      .attach(
        "profilePicture",
        path.resolve(__dirname, "..", "mocks", "mockImage.jpg")
      );

    expect(signup.body.error).toBe("Username must be at least 6 characters");
  });

  test("Should return error if invalid email", async () => {
    const signup = await request(app)
      .post("/auth/signup")
      .field({
        username: "testUser",
        email: "testEmail@",
        password: "Password",
        confirmPassword: "Password",
      })
      .attach(
        "profilePicture",
        path.resolve(__dirname, "..", "mocks", "mockImage.jpg")
      );

    expect(signup.body.error).toBe("Must be a valid email type");
  });

  test("Should return error if invalid password", async () => {
    const signup = await request(app)
      .post("/auth/signup")
      .field({
        username: "testUser",
        email: "testEmail@email.com",
        password: "Pass",
        confirmPassword: "Pass",
      })
      .attach(
        "profilePicture",
        path.resolve(__dirname, "..", "mocks", "mockImage.jpg")
      );

    expect(signup.body.error).toBe("Password must be at least 6 characters");
  });

  test("Should return error if confirm password does not match", async () => {
    const signup = await request(app)
      .post("/auth/signup")
      .field({
        username: "testUser",
        email: "testEmail@email.com",
        password: "Password",
        confirmPassword: "Passwor",
      })
      .attach(
        "profilePicture",
        path.resolve(__dirname, "..", "mocks", "mockImage.jpg")
      );

    expect(signup.body.error).toBe("Passwords must match");
  });
});
