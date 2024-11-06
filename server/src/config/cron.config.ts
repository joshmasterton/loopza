import cron from "node-cron";
import { createBotComment, createBotPost } from "../bot/createPostComment.bot";
import { likeDislikeBot } from "../bot/likeDislike.bot";

export const scheduleRandomBotPost = () => {
  cron.schedule("* * * * *", async () => {
    await createBotPost();
  });
};

export const scheduleRandomBotComment = () => {
  cron.schedule("* * * * *", async () => {
    await createBotComment();
  });
};

export const scheduleRandomBotLikeDislike = () => {
  cron.schedule("* * * * *", async () => {
    await likeDislikeBot();
  });
};
