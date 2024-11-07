import cron from "node-cron";
import { createBotComment, createBotPost } from "../bot/createPostComment.bot";
import { likeDislikeBot } from "../bot/likeDislike.bot";

export const scheduleRandomBotPost = () => {
  cron.schedule("*/10 * * * *", async () => {
    await createBotPost();
  });
};

export const scheduleRandomBotComment = () => {
  cron.schedule("*/5 * * * *", async () => {
    await createBotComment();
  });
};

export const scheduleRandomBotLikeDislike = () => {
  cron.schedule("*/2 * * * *", async () => {
    await likeDislikeBot();
  });
};
