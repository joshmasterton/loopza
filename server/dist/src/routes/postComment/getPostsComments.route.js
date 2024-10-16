import express from "express";
import { getPostsComments } from "../../controllers/postComment/getPostsComments.controller";
export const getPostsCommentsRouter = express.Router();
getPostsCommentsRouter.get("/gets", getPostsComments);
