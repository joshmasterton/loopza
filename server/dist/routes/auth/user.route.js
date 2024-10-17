import express from "express";
import { user } from "../../controllers/auth/user.controller.js";
import { authenticateToken } from "../../middlewares/authenticateToken.middleware.js";
export const userRouter = express.Router();
userRouter.get("/user", authenticateToken, user);
