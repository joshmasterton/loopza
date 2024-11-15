import express from "express";
import { login } from "../../controllers/auth/login.controller";
import rateLimit from "express-rate-limit";

export const loginRouter = express.Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

loginRouter.post("/login", loginLimiter, login);
