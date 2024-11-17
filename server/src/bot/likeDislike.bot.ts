import { HfInference } from "@huggingface/inference";
import { User } from "../models/auth/user.model";
import { PostComment } from "../models/postComment/postComment.model";

const { HF_TOKEN } = process.env;

const interernce = new HfInference(HF_TOKEN);

export const likeDislikeBot = async () => {
  try {
    if (!HF_TOKEN) {
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

    const botReactionGenerate = await interernce.chatCompletion({
      model: "HuggingFaceH4/starchat2-15b-v0.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,
      temperature: 0.1,
    });

    const reaction = botReactionGenerate.choices[0].message.content ?? "like";

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
