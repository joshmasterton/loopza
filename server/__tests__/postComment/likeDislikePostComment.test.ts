import { describe, expect, test } from "vitest";
import { app } from "../../src/app";
import path from "path";
import request from "supertest";

describe("/postComment/likeDislike", () => {
  test("Should like new post", async () => {
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

    const likeDislikePost = await request(app)
      .put("/postComment/likeDislike")
      .send({
        id: newPostComment.body.id,
        type: newPostComment.body.type,
        reaction: "like",
      })
      .set("Cookie", signup.header["set-cookie"]);

    expect(likeDislikePost.body.id).toBe(1);
    expect(likeDislikePost.body.type).toBe("post");
    expect(likeDislikePost.body.likes).toBe(1);
    expect(likeDislikePost.body.reaction).toBe("like");
  });

  test("Should remove like if liking already liked post", async () => {
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

    await request(app)
      .put("/postComment/likeDislike")
      .send({
        id: newPostComment.body.id,
        type: newPostComment.body.type,
        reaction: "like",
      })
      .set("Cookie", signup.header["set-cookie"]);

    const likeDislikePost = await request(app)
      .put("/postComment/likeDislike")
      .send({
        id: newPostComment.body.id,
        type: newPostComment.body.type,
        reaction: "like",
      })
      .set("Cookie", signup.header["set-cookie"]);

    expect(likeDislikePost.body.id).toBe(1);
    expect(likeDislikePost.body.type).toBe("post");
    expect(likeDislikePost.body.likes).toBe(0);
    expect(likeDislikePost.body.reaction).toBe(null);
  });

  test("Should remove like and add dislike if already liked post", async () => {
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

    await request(app)
      .put("/postComment/likeDislike")
      .send({
        id: newPostComment.body.id,
        type: newPostComment.body.type,
        reaction: "like",
      })
      .set("Cookie", signup.header["set-cookie"]);

    const likeDislikePost = await request(app)
      .put("/postComment/likeDislike")
      .send({
        id: newPostComment.body.id,
        type: newPostComment.body.type,
        reaction: "dislike",
      })
      .set("Cookie", signup.header["set-cookie"]);

    expect(likeDislikePost.body.id).toBe(1);
    expect(likeDislikePost.body.type).toBe("post");
    expect(likeDislikePost.body.likes).toBe(0);
    expect(likeDislikePost.body.reaction).toBe("dislike");
  });

  test("Should return new like on different user liking same post", async () => {
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
        email: "testEmailTwo@email.com",
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
      .set("Cookie", signupTwo.header["set-cookie"]);

    await request(app)
      .put("/postComment/likeDislike")
      .send({
        id: newPostComment.body.id,
        type: newPostComment.body.type,
        reaction: "like",
      })
      .set("Cookie", signup.header["set-cookie"]);

    await request(app)
      .put("/postComment/likeDislike")
      .send({
        id: newPostComment.body.id,
        type: newPostComment.body.type,
        reaction: "like",
      })
      .set("Cookie", signup.header["set-cookie"]);
  });
});
