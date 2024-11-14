import { describe, expect, test } from "vitest";
import { app } from "../../src/app";
import request from "supertest";
import path from "path";

describe("/auth/signup", () => {
  test("Should return tokens upon successful updated profile", async () => {
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

    const updateProfile = await request(app)
      .post("/auth/updateProfile")
      .field({
        username: "newTestUser",
        email: "newTestEmail@email.com",
        newPassword: "Password",
        confirmNewPassword: "Password",
      })
      .set("Cookie", signup.header["set-cookie"])
      .attach(
        "profilePicture",
        path.resolve(__dirname, "..", "mocks", "mockImage2.jpg")
      );

    const user = await request(app)
      .get("/auth/user")
      .set("Cookie", updateProfile.header["set-cookie"]);

    expect(user.body.username).toBe("newTestUser");
    expect(user.body.email).toBe("newTestEmail@email.com");
  });
});
