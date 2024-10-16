import { describe, expect, test } from "vitest";
import { app } from "../../src/app";
import request from "supertest";
import path from "path";

describe("/postComment/new", () => {
  test("Should return new post", async () => {
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

    const newPostComment = await request(app)
      .post("/postComment/new")
      .send({
        post: "Some random post",
        type: "post",
      })
      .set("Cookie", signup.header["set-cookie"]);

    expect(newPostComment.body.id).toBe(1);
    expect(newPostComment.body.username).toBe("testUser");
  });

  test("Should return new comment", async () => {
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

    const newPost = await request(app)
      .post("/postComment/new")
      .send({
        post: "Some random post",
        type: "post",
      })
      .set("Cookie", signup.header["set-cookie"]);

    const newComment = await request(app)
      .post("/postComment/new")
      .send({
        comment: "Some random comment",
        type: "comment",
        parent_id: newPost.body.id,
      })
      .set("Cookie", signup.header["set-cookie"]);

    expect(newComment.body.id).toBe(2);
    expect(newComment.body.type).toBe("comment");
  });
});
