import express from "express";
import { signup } from "../../controllers/auth/signup.controller";
import { upload } from "../../utilities/multer.utilities";
export const signupRouter = express.Router();
signupRouter.post("/signup", upload.single("profilePicture"), signup);
