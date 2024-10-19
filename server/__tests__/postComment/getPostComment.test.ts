import { describe, expect, test } from "vitest";
import { app } from "../../src/app";
import request from "supertest";
import path from "path";

describe("/postComment/get", () => {
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
      .set("Cookie", signup.header["set-cookie"][2])
      .set("Cookie", signup.header["set-cookie"][3]);

    const getPostComment = await request(app)
      .get("/postComment/get")
      .query({
        id: 1,
        type: "post",
      })
      .set("Cookie", signup.header["set-cookie"][2])
      .set("Cookie", signup.header["set-cookie"][3]);

    expect(getPostComment.body.id).toBe(1);
    expect(getPostComment.body.username).toBe("testUser");
  });
});
