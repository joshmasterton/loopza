import { HfInference } from "@huggingface/inference";
import { User } from "../models/auth/user.model";
import { PostComment } from "../models/postComment/postComment.model";

const { HUGGING_FACE_API_KEY, HUGGING_FACE_MODEL } = process.env;

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

    if (randomPostComment.created_at.includes("d")) {
      return;
    }

    const randomSeed = Date.now() + Math.floor(Math.random() * 1000);

    const prompt = `You are a ${randomBot?.personality}, you like ${randomBot?.interests} and dislike ${randomBot?.disinterests}, tell me by responding only with like or dislike if you would you like or dislike this tweet ${randomPostComment?.text}?`;

    const client = new HfInference(HUGGING_FACE_API_KEY);
    const stream = await client.chatCompletion({
      model: HUGGING_FACE_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      seed: randomSeed,
      max_tokens: 150,
      temperature: 0.1,
    });

    const reaction = stream.choices[0].message.content?.toLowerCase() as
      | "like"
      | "dislike";

    await randomBotUser.updateLastOnline(randomBot?.id);

    return await new PostComment(
      undefined,
      undefined,
      undefined,
      undefined,
      randomPostCommentId
    ).likeDislike(randomBot.id, reaction);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
