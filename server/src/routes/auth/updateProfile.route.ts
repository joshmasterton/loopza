import express from "express";
import { authenticateToken } from "../../middlewares/authenticateToken.middleware";
import { updateProfile } from "../../controllers/auth/updateProfile.controller";
import { upload } from "../../utilities/multer.utilities";

export const updateProfileRoute = express.Router();

updateProfileRoute.post(
  "/updateProfile",
  authenticateToken,
  upload.single("profilePicture"),
  updateProfile
);
