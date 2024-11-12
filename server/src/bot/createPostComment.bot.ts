import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import Parser from "rss-parser";
import { User } from "../models/auth/user.model";
import { PostComment } from "../models/postComment/postComment.model";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parser = new Parser();

dotenv.config({
  path: path.resolve(
    __dirname,
    "..",
    "..",
    `${process.env.NODE_ENV === "development" ? ".env.dev" : ".env.test"}`
  ),
});

const { GOOGLE_API_KEY } = process.env;

const rssFeeds = [
  "https://www.theguardian.com/world/rss",
  "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://feeds.washingtonpost.com/rss/world",
  "http://feeds.bbci.co.uk/news/rss.xml",
  "https://www.sciencedaily.com/rss/all.xml",
  "https://www.rollingstone.com/music/music-news/feed/",
  "https://www.nasa.gov/rss/dyn/breaking_news.rss",
  "https://www.historyextra.com/feed/",
  "https://www.avclub.com/rss",
  "https://www.eurogamer.net/?format=rss",
  "https://collider.com/feed/",
  "https://myanimelist.net/rss/news.xml",
];

export const createBotPost = async () => {
  try {
    if (!GOOGLE_API_KEY) {
      throw new Error("Environment variable error");
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

    const randomFeedUrl = rssFeeds[Math.floor(Math.random() * rssFeeds.length)];

    const feed = await parser.parseURL(randomFeedUrl);
    const randomRssIndex = Math.floor(Math.random() * feed.items.length);

    const prompt = `You are a ${randomBot?.personality} user writing a tweet about this title: "${feed.items[randomRssIndex].title}" and content: "${feed.items[randomRssIndex].contentSnippet}". Breifly mention the title: "${feed.items[randomRssIndex].title}".
		Let your tone be subtly influenced by your interests (${randomBot?.interests}) and dislikes (${randomBot?.disinterests}), without directly mentioning them. If the topic aligns with your interests, respond with a positive tone; if it includes your dislikes,
		respond with a more critical or skeptical tone. Keep it realistic, brief, and similar to a casual reaction tweet from a real person, only include response. Make sure it is short, only a sentence or two.`;

    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.5,
      },
    });
    const result = await model.generateContent(prompt);

    const newBotPost = await new PostComment(
      result.response.text(),
      "post",
      randomBot?.id
    ).new();

    return await newBotPost?.getPostComment();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("create bots post error");
  }
};

export const createBotComment = async () => {
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
      throw new Error("No post or comment found");
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

    if (randomBot.id === randomPostComment.user_id) {
      return;
    }

    let probability: number;

    if (randomPostComment.hot_score > 0) {
      probability = Math.min(0.5 + randomPostComment.hot_score, 1);
    } else {
      probability = 0.5;
    }

    if (randomPostComment.created_at.includes("h")) {
      probability = probability - 0.5;
    }

    if (randomPostComment.parent_id) {
      const parentPost = await new PostComment(
        undefined,
        "post",
        undefined,
        undefined,
        randomPostComment.parent_id
      ).getPostComment();

      if (parentPost.created_at.includes("h")) {
        probability = probability - 0.5;
      }

      if (
        parentPost.created_at.includes("d") ||
        parentPost.created_at.includes("w")
      ) {
        probability = probability - 1;
      }
    }

    if (randomPostComment.created_at.includes("h")) {
      probability = probability - 0.5;
    }

    if (
      randomPostComment.created_at.includes("d") ||
      randomPostComment.created_at.includes("w")
    ) {
      probability = probability - 1;
    }

    if (Math.random() <= probability) {
      const prompt = `You are a ${randomBot.personality} user replying to this tweet: "${randomPostComment.text}". 
			Craft a brief, realistic reply with a tone subtly influenced by your interests (${randomBot.interests}) and dislikes (${randomBot.disinterests}). Do not mention these directly. 
			Instead, let the tone naturally reflect a positive or negative inclination. Keep it casual and brief, as if it’s a quick, off-the-cuff response, only include response. Make sure it is short, only a sentence or two.`;

      const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.5,
        },
      });
      const result = await model.generateContent(prompt);

      const newBotComment = new PostComment(
        result.response.text(),
        "comment",
        randomBot?.id
      );

      if (!randomPostComment?.parent_id) {
        await newBotComment.new(randomPostComment?.id, undefined);
      } else if (randomPostComment?.parent_id) {
        await newBotComment.new(
          randomPostComment?.parent_id,
          randomPostComment?.id ?? undefined
        );
      }

      const reactionModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.1,
        },
      });
      const reactionPrompt = `You are a ${randomBot?.personality}, you like ${randomBot?.interests}, but dislike ${randomBot?.disinterests}, tell me by responding only with the word like or the word dislike if you would you like or dislike this tweet: ${randomPostComment?.text}?`;
      const resultReaction = await reactionModel.generateContent(
        reactionPrompt
      );
      const reaction = resultReaction.response.text().toLowerCase() as
        | "like"
        | "dislike";

      await new PostComment(
        undefined,
        undefined,
        undefined,
        undefined,
        randomPostCommentId
      ).likeDislike(
        randomBot.id,
        reaction.includes("dislike") ? "dislike" : "like"
      );

      return await newBotComment?.getPostComment();
    } else {
      return;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("create bot comment error");
  }
};
