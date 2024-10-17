import express from "express";
import { signup } from "../../controllers/auth/signup.controller.js";
import { upload } from "../../utilities/multer.utilities.js";
export const signupRouter = express.Router();
signupRouter.post("/signup", upload.single("profilePicture"), signup);
