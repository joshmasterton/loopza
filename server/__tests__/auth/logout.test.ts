import { describe, test } from "vitest";
import { app } from "../../src/app";
import request from "supertest";
import path from "path";

describe("/logout", () => {
  test("Should logout user and clear cookies", async () => {
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

    const logout = await request(app)
      .post("/auth/logout")
      .set("Cookie", signup.header["set-cookie"]);

    console.log(logout.header["set-cookie"]);
    console.log(logout.body);
  });
});