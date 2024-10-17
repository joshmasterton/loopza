import express from "express";
import { newPostComment } from "../../controllers/postComment/newPostComment.controller.js";
import { authenticateToken } from "../../middlewares/authenticateToken.middleware.js";
import { upload } from "../../utilities/multer.utilities.js";
export const newPostCommentRouter = express.Router();
newPostCommentRouter.post("/new", authenticateToken, upload.single("postPicture"), newPostComment);
