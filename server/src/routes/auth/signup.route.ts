import express from "express";
import * as yup from "yup";
import { upload } from "../../utilities/multerConfig";

export const signup = express.Router();

const signupSchema = yup.object().shape({
  username: yup.string().min(6).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  confirmPassword: yup.string().min(6).required(),
});

signup.post("/", upload.single("profilePicture"), async (req, res) => {
  try {
    await signupSchema.validate(req.body);
    return res.json({ body: req.body, file: req.file });
  } catch (error) {
    return res.status(400).json(error);
  }
});
