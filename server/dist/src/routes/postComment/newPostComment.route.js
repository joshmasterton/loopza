import express from "express";
import { newPostComment } from "../../controllers/postComment/newPostComment.controller";
import { authenticateToken } from "../../middlewares/authenticateToken.middleware";
import { upload } from "../../utilities/multer.utilities";
export const newPostCommentRouter = express.Router();
newPostCommentRouter.post("/new", authenticateToken, upload.single("postPicture"), newPostComment);
