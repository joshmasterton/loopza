import { User } from "../models/auth/user.model";
import { PostComment } from "../models/postComment/postComment.model";

export const likeDislikeBot = async () => {
  try {
    const postCommentsLength = await new PostComment().countPostsComments();
    const randomPostCommentId =
      Math.floor(Math.random() * postCommentsLength) + 1;

    const randomPostComment = await new PostComment(
      undefined,
      undefined,
      undefined,
      undefined,
      randomPostCommentId
    ).getPostComment();

    if (!randomPostComment) {
      throw new Error("No post or comment here to like or dislike");
    }

    const randomBot = await new User(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ).getUser("is_bot", true, undefined, true);

    if (!randomBot) {
      throw new Error("No bot found");
    }

    if (randomPostComment.hot_score > 0) {
      const probability = Math.random();

      if (probability <= 0.8) {
        const likeDislike = await new PostComment(
          undefined,
          undefined,
          undefined,
          undefined,
          randomPostCommentId
        ).likeDislike(randomBot.id, "like");

        return likeDislike;
      }
    } else {
      const probability = Math.random();

      if (probability <= 0.2) {
        const likeDislike = await new PostComment(
          undefined,
          undefined,
          undefined,
          undefined,
          randomPostCommentId
        ).likeDislike(randomBot.id, "like");

        return likeDislike;
      }
    }

    return;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
