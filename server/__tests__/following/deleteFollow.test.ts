import { describe, expect, test } from "vitest";
import { app } from "../../src/app";
import request from "supertest";
import path from "path";

describe("/user/followUser", () => {
  test("Should delete following", async () => {
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

    await request(app)
      .post("/auth/signup")
      .field({
        username: "testUserTwo",
        email: "testEmailTwo@email.com",
        password: "Password",
        confirmPassword: "Password",
      })
      .attach(
        "profilePicture",
        path.resolve(__dirname, "..", "mocks", "mockImage.jpg")
      );

    await request(app)
      .post("/user/follow")
      .send({
        follower_two_id: 2,
      })
      .set("Cookie", signup.header["set-cookie"][2])
      .set("Cookie", signup.header["set-cookie"][3]);

    const deleteFollow = await request(app)
      .post("/user/deleteFollow")
      .send({
        follower_two_id: 2,
      })
      .set("Cookie", signup.header["set-cookie"][2])
      .set("Cookie", signup.header["set-cookie"][3]);

    expect(deleteFollow.body.message).toBe("Deleted following successfully");
  });
});
