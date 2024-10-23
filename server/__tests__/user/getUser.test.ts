import { describe, expect, test } from "vitest";
import { app } from "../../src/app";
import request from "supertest";
import path from "path";

describe("/user/get", () => {
  test("Should return a user", async () => {
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

    const getUser = await request(app).get("/user/get").query({
      userId: 1,
    });

    expect(getUser.body.id).toBe(1);
    expect(getUser.body.username).toBe("testUser");
  });
});
