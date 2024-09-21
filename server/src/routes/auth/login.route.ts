import express from "express";
import * as yup from "yup";

export const login = express.Router();

const loginSchema = yup.object().shape({
  username: yup.string().min(6).required(),
  password: yup.string().min(6).required(),
});

login.post("/", async (req, res) => {
  try {
    await loginSchema.validate(req.body);
    return res.json(req.body);
  } catch (error) {
    return res.json({ error });
  }
});
