import express from "express";
import { authenticateToken } from "../../middlewares/authenticateToken.middleware";
import { likeDislikePostComment } from "../../controllers/postComment/likeDislikePostComment.controller";

export const likeDislikePostCommentRouter = express.Router();

likeDislikePostCommentRouter.put(
  "/likeDislike",
  authenticateToken,
  likeDislikePostComment
);
