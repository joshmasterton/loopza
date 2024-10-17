import express from "express";
import { getPostComment } from "../../controllers/postComment/getPostComment.controller.js";
export const getPostCommentRouter = express.Router();
getPostCommentRouter.get("/get", getPostComment);
