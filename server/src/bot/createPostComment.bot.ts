import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import Parser from "rss-parser";
import { User } from "../models/auth/user.model";
import { PostComment } from "../models/postComment/postComment.model";
import { HfInference } from "@huggingface/inference";

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

const { HF_TOKEN } = process.env;

const interernce = new HfInference(HF_TOKEN);

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
    if (!HF_TOKEN) {
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

    const randomSeed = Math.floor(Date.now() / Math.random());

    const randomFeedUrl = rssFeeds[Math.floor(Math.random() * rssFeeds.length)];

    const feed = await parser.parseURL(randomFeedUrl);
    const randomRssIndex = Math.floor(Math.random() * feed.items.length);

    const prompt = `You are a ${randomBot?.personality} user writing a tweet about this title: "${feed.items[randomRssIndex].title}" and content: "${feed.items[randomRssIndex].contentSnippet}". Breifly mention the title: "${feed.items[randomRssIndex].title}".
		Let your tone be subtly influenced by your interests (${randomBot?.interests}) and dislikes (${randomBot?.disinterests}), without directly mentioning them. If the topic aligns with your interests, respond with a positive tone; if it includes your dislikes,
		respond with a more critical or skeptical tone. Keep it realistic, brief, and similar to a casual reaction tweet from a real person, only include response. Make sure it is short, only a sentence or two.`;

    const botGenerate = await interernce.chatCompletion({
      model: "HuggingFaceH4/starchat2-15b-v0.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,
      temperature: 0.8,
      seed: randomSeed,
    });

    const newBotPost = await new PostComment(
      botGenerate.choices[0].message.content,
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
    if (!HF_TOKEN) {
      throw new Error("Environment variable error");
    }

    const randomPostComment = await new PostComment(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ).getPostComment(undefined, true, true);

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

    let parentPost;

    if (randomPostComment.parent_id) {
      parentPost = await new PostComment(
        undefined,
        "post",
        undefined,
        undefined,
        randomPostComment.parent_id
      ).getPostComment();

      if (parentPost.created_at.includes("h")) {
        probability = probability - 0.3;
      }

      if (
        parentPost.created_at.includes("d") ||
        parentPost.created_at.includes("w")
      ) {
        probability = probability - 0.8;
      }
    }

    const randomSeed = Math.floor(Date.now() / Math.random());

    if (Math.random() <= probability) {
      const prompt = `You are a ${
        randomBot.personality
      } user replying to this tweet: "${randomPostComment.text}, ${
        parentPost ? `the main tweet is this ${parentPost.text}` : ""
      }". 
			Craft a brief, realistic reply with a tone subtly influenced by your interests (${
        randomBot.interests
      }) and dislikes (${
        randomBot.disinterests
      }). Do not mention these directly. 
			Instead, let the tone naturally reflect a positive or negative inclination. Keep it casual and brief, as if it’s a quick, off-the-cuff response, only include response. Make sure it is short, only a sentence or two.`;

      const botGenerate = await interernce.chatCompletion({
        model: "HuggingFaceH4/starchat2-15b-v0.1",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.8,
        seed: randomSeed,
      });

      const newBotComment = new PostComment(
        botGenerate.choices[0].message.content,
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

      const reactionPrompt = `You are a ${randomBot?.personality}, you like ${randomBot?.interests}, but dislike ${randomBot?.disinterests}, tell me by responding only with the word like or the word dislike if you would you like or dislike this tweet: ${randomPostComment?.text}?`;

      const botReactionGenerate = await interernce.chatCompletion({
        model: "HuggingFaceH4/starchat2-15b-v0.1",
        messages: [{ role: "user", content: reactionPrompt }],
        max_tokens: 250,
        temperature: 0.1,
      });

      const reaction = botReactionGenerate.choices[0].message.content ?? "like";

      await new PostComment(
        undefined,
        undefined,
        undefined,
        undefined,
        randomPostComment.id
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
