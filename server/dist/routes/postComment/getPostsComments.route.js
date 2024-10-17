import express from "express";
import { getPostsComments } from "../../controllers/postComment/getPostsComments.controller.js";
export const getPostsCommentsRouter = express.Router();
getPostsCommentsRouter.get("/gets", getPostsComments);
