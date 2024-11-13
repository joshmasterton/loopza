import { describe, expect, test } from "vitest";
import { app } from "../../src/app";
import request from "supertest";
import path from "path";

describe("/user/getUsers", () => {
  test("Should return all users", async () => {
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
      .post("/auth/signup")
      .field({
        username: "testUserThree",
        email: "testEmailThree@email.com",
        password: "Password",
        confirmPassword: "Password",
      })
      .attach(
        "profilePicture",
        path.resolve(__dirname, "..", "mocks", "mockImage.jpg")
      );

    const allUsers = await request(app).get("/user/gets").query({
      type: "all",
    });

    expect(allUsers.body).toHaveLength(3);
  });

  test("Should return all users with following requests or accepted requests", async () => {
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

    const signup = await request(app)
      .post("/auth/signup")
      .field({
        username: "testUserThree",
        email: "testEmailThree@email.com",
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
        follower_two_id: 1,
      })
      .set("Cookie", signup.header["set-cookie"]);

    const allUsers = await request(app)
      .get("/user/gets")
      .query({
        type: "followers",
        userId: 1,
      })
      .set("Cookie", signup.header["set-cookie"]);

    expect(allUsers.body).toHaveLength(1);
  });
});
