import { fileURLToPath } from "url";
import { HfInference } from "@huggingface/inference";
import path from "path";
import dotenv from "dotenv";
import { User } from "../models/auth/user.model";
import { PostComment } from "../models/postComment/postComment.model";
import Parser from "rss-parser";

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

const { HUGGING_FACE_API_KEY, HUGGING_FACE_MODEL } = process.env;

const rssFeeds = [
  "https://www.theguardian.com/world/rss",
  "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://feeds.washingtonpost.com/rss/world",
  "http://feeds.bbci.co.uk/news/rss.xml",
  "https://www.gamespot.com/feeds/news/",
  "https://kotaku.com/tag/anime/rss",
  "https://www.sciencedaily.com/rss/all.xml",
  "https://lifehacker.com/rss",
];

export const createBotPost = async () => {
  try {
    const randomSeed = Date.now() + Math.floor(Math.random() * 1000);

    const randomBot = await new User(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ).getUser("is_bot", true, undefined, true);

    const randomFeedUrl = rssFeeds[Math.floor(Math.random() * rssFeeds.length)];

    const feed = await parser.parseURL(randomFeedUrl);
    const randomRssIndex = Math.floor(Math.random() * feed.items.length);

    const prompt = `Be a ${randomBot?.personality} user. Write a tweet based off this title ${feed.items[randomRssIndex].title} and this text ${feed.items[randomRssIndex].contentSnippet}. if it aligns with your interests (${randomBot?.interests}) be positive, if it includes your disinterests (${randomBot?.disinterests}), be negative about it. Do not use adjectives or descriptive words, keep it realistic like a real human and very short`;

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
      temperature: 0.7,
    });

    const newBotPost = await new PostComment(
      stream.choices[0].message.content?.replace(/"/g, ""),
      "post",
      randomBot?.id
    ).new();

    return await newBotPost?.getPostComment();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("create bots users error");
  }
};

export const createBotComment = async () => {
  try {
    const randomSeed = Date.now() + Math.floor(Math.random() * 1000);

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
        const prompt = `Be a ${randomBot?.personality} user, reply with a comment to this tweet: ${randomPostComment?.text}. Be positive if it's involving your interests (${randomBot?.interests}), be negative if it includes your disinterests (${randomBot?.disinterests}). Do not use adjectives or descriptive words, keep it realistic like a real human and very short`;

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
          temperature: 0.7,
        });

        const newBotComment = new PostComment(
          stream.choices[0].message.content?.replace(/"/g, ""),
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

        return await newBotComment?.getPostComment();
      }
    } else {
      const probability = Math.random();

      if (probability <= 0.2) {
        const prompt = `Be a ${randomBot?.personality} user, reply with a comment on this tweet: ${randomPostComment?.text}. Be positive if it's involving your interests (${randomBot?.interests}), be negative if it includes your disinterests (${randomBot?.disinterests}). Do not use adjectives or descriptive words, keep it realistic like a real human and very short`;

        const client = new HfInference(HUGGING_FACE_API_KEY);
        const stream = await client.chatCompletion({
          model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          seed: randomSeed,
          max_tokens: 150,
          temperature: 0.7,
        });

        const newBotComment = new PostComment(
          stream.choices[0].message.content?.replace(/"/g, ""),
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

        return await newBotComment?.getPostComment();
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("create bots users error");
  }
};
