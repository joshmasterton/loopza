import { User } from "../models/auth/user.model";
import { PostComment } from "../models/postComment/postComment.model";
import { GoogleGenerativeAI } from "@google/generative-ai";

const { GOOGLE_API_KEY } = process.env;

export const likeDislikeBot = async () => {
  try {
    if (!GOOGLE_API_KEY) {
      throw new Error("Environment variable error");
    }

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

    if (randomPostComment.created_at.includes("d")) {
      return;
    }

    const prompt = `You are a ${randomBot?.personality}, you like ${randomBot?.interests}, but dislike ${randomBot?.disinterests}, tell me by responding only with the word like or the word dislike if you would you like or dislike this tweet: ${randomPostComment?.text}?`;

    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const reaction = result.response.text().toLowerCase() as "like" | "dislike";

    await randomBotUser.updateLastOnline(randomBot?.id);

    return await new PostComment(
      undefined,
      undefined,
      undefined,
      undefined,
      randomPostCommentId
    ).likeDislike(
      randomBot.id,
      reaction.includes("dislike") ? "dislike" : "like"
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
