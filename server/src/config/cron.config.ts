import cron from "node-cron";
import { createBotComment, createBotPost } from "../bot/createPostComment.bot";
import { likeDislikeBot } from "../bot/likeDislike.bot";
import { queryDatabase } from "../database/query.database";
import { tableConfig } from "../app";

export const scheduleRandomBotPost = () => {
  cron.schedule("*/15 * * * *", async () => {
    await createBotPost();
  });
};

export const scheduleRandomBotComment = () => {
  cron.schedule("*/5 * * * *", async () => {
    await createBotComment();
  });
};

export const scheduleRandomBotLikeDislike = () => {
  cron.schedule("*/5 * * * *", async () => {
    await likeDislikeBot();
  });
};

export const scheduleDeleteOldPostsComments = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      await queryDatabase(
        `
					DELETE FROM ${tableConfig.getPostsCommentsTable()}
					WHERE created_at < NOW() - INTERVAL '7 days'
				`,
        []
      );
      await queryDatabase(
        `
					DELETE FROM ${tableConfig.getLikesDislikesTable()}
					WHERE created_at < NOW() - INTERVAL '7 days'
				`,
        []
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  });
};
