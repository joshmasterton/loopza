import { describe, expect, test } from "vitest";
import { createBotUsers } from "../../src/bot/createUser.bot";
import {
  createBotPost,
  createBotComment,
} from "../../src/bot/createPostComment.bot";
import { likeDislikeBot } from "../../src/bot/likeDislike.bot";

describe("createBotUsers", () => {
  test("Should create new bot users", async () => {
    const botUsers = await createBotUsers(5);
    expect(botUsers).toHaveLength(5);
  });

  test("Bot should be able to post", async () => {
    await createBotUsers(5);
    // const newBotPost = await createBotPost();

    // expect(newBotPost?.id).toBe(1);
    // expect(newBotPost?.type).toBe("post");
  });

  test("Bot should be able to comment", async () => {
    await createBotUsers(5);
    // await createBotPost();
    // const newBotComment = await createBotComment();
    // expect(newBotComment?.type).toBe("comment");
  });

  test("Bot should be able to like or dislike", async () => {
    await createBotUsers(5);
    const post = await createBotPost();
    const postTwo = await createBotPost();
    const comment = await createBotComment();
    const commentTwo = await createBotComment();
    await likeDislikeBot();

    console.log({
      post: post?.text,
      comment: comment?.text,
      postTwo: postTwo?.text,
      commentTwo: commentTwo?.text,
    });
  });
});
