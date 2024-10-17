import express from "express";
import { login } from "../../controllers/auth/login.controller.js";
export const loginRouter = express.Router();
loginRouter.post("/login", login);
