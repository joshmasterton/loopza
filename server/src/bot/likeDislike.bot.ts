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

    const randomBotUser = new User(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );

    const randomBot = await randomBotUser.getUser(
      "is_bot",
      true,
      undefined,
      true
    );

    if (!randomBot) {
      throw new Error("No bot found");
    }

    await randomBotUser.updateLastOnline(randomBot?.id);

    const { hot_score, likes, dislikes } = randomPostComment;

    let probability: number;
    if (hot_score > 0) {
      probability = Math.min(0.3 + randomPostComment.hot_score, 1);
    } else {
      probability = 0.3;
    }

    const likeBias = Math.min(0.05 * likes, 0.5);
    const dislikeBias = Math.min(0.05 * dislikes, 0.5);

    const likeProbability = Math.min(probability + likeBias, 0.9);
    const dislikeProbability = Math.min(probability + dislikeBias, 0.9);

    const randomValue = Math.random();

    if (
      randomValue <
      dislikeProbability / (likeProbability + dislikeProbability)
    ) {
      return await new PostComment(
        undefined,
        undefined,
        undefined,
        undefined,
        randomPostCommentId
      ).likeDislike(randomBot.id, "dislike");
    } else {
      return await new PostComment(
        undefined,
        undefined,
        undefined,
        undefined,
        randomPostCommentId
      ).likeDislike(randomBot.id, "like");
    }

    return;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
