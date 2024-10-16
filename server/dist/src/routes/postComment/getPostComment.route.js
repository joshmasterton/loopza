import express from "express";
import { getPostComment } from "../../controllers/postComment/getPostComment.controller";
export const getPostCommentRouter = express.Router();
getPostCommentRouter.get("/get", getPostComment);
