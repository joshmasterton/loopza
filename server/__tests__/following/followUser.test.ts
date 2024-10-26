import { describe, expect, test } from "vitest";
import { app } from "../../src/app";
import request from "supertest";
import path from "path";

describe("/user/followUser", () => {
  test("Should return new following", async () => {
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
        email: "testEmail@email.com",
        password: "Password",
        confirmPassword: "Password",
      })
      .attach(
        "profilePicture",
        path.resolve(__dirname, "..", "mocks", "mockImage.jpg")
      );

    const followUser = await request(app)
      .post("/user/follow")
      .send({
        follower_two_id: 2,
      })
      .set("Cookie", signup.header["set-cookie"][2])
      .set("Cookie", signup.header["set-cookie"][3]);

    expect(followUser.body.id).toBe(2);
    expect(followUser.body.pending_user_id).toBe(2);
    expect(followUser.body.is_accepted).toBeFalsy();
  });

  test("Should return accepted following if other user accepts", async () => {
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

    const signupTwo = await request(app)
      .post("/auth/signup")
      .field({
        username: "testUserTwo",
        email: "testEmail@email.com",
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

    const followUserTwo = await request(app)
      .post("/user/follow")
      .send({
        follower_two_id: 1,
      })
      .set("Cookie", signupTwo.header["set-cookie"][2])
      .set("Cookie", signupTwo.header["set-cookie"][3]);

    expect(followUserTwo.body.id).toBe(1);
    expect(followUserTwo.body.pending_user_id).toBe(2);
    expect(followUserTwo.body.is_accepted).toBeTruthy();
  });

  test("Should return still waiting if other user tries to add again", async () => {
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
        email: "testEmail@email.com",
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

    const followUserTwo = await request(app)
      .post("/user/follow")
      .send({
        follower_two_id: 2,
      })
      .set("Cookie", signup.header["set-cookie"][2])
      .set("Cookie", signup.header["set-cookie"][3]);

    expect(followUserTwo.body.error).toBe("Waiting for response");
  });
});
