import { describe, expect, test } from "vitest";
import { app } from "../../src/app";
import request from "supertest";
import path from "path";

describe("/postComment/gets", () => {
  test("Should return a post", async () => {
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
      .post("/postComment/new")
      .send({
        post: "Some random post",
        type: "post",
      })
      .set("Cookie", signup.header["set-cookie"]);

    await request(app)
      .post("/postComment/new")
      .field({
        post: "Some random post",
        type: "post",
      })
      .attach(
        "postPicture",
        path.resolve(__dirname, "..", "mocks", "mockImage.jpg")
      )
      .set("Cookie", signup.header["set-cookie"]);

    const getPostsComments = await request(app)
      .get("/postComment/gets")
      .query({
        id: 1,
        type: "post",
      })
      .set("Cookie", signup.header["set-cookie"]);

    expect(getPostsComments.body).toHaveLength(2);
  });
});