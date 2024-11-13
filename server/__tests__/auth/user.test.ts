import { describe, expect, test } from "vitest";
import { app } from "../../src/app";
import request from "supertest";
import path from "path";

describe("/auth/user", async () => {
  test("Should return user on access token provided", async () => {
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

    const user = await request(app)
      .get("/auth/user")
      .set("Cookie", signup.header["set-cookie"]);

    expect(user.body.id).toBe(1);
    expect(user.body.username).toBe("testUser");
    expect(user.header["set-cookie"][0]).toBeDefined();
    expect(user.header["set-cookie"][1]).toBeDefined();
  });

  test("Should provide new access token and user on only refresh token", async () => {
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

    const user = await request(app)
      .get("/auth/user")
      .set("Cookie", signup.header["set-cookie"][1]);

    expect(user.body.id).toBe(1);
    expect(user.body.username).toBe("testUser");
    expect(user.header["set-cookie"][0]).toBeDefined();
    expect(user.header["set-cookie"][1]).toBeDefined();
  });

  test("Should return error on if no tokens provided", async () => {
    const user = await request(app).get("/auth/user");

    expect(user.body.error).toBe("No token present, authorization denied");
  });

  test("Should return error if only access token provided", async () => {
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

    const user = await request(app)
      .get("/auth/user")
      .set("Cookie", signup.header["set-cookie"][0]);

    expect(user.body.error).toBe("No token present, authorization denied");
  });
});
