import express from "express";
import { user } from "../../controllers/auth/user.controller";
import { authenticateToken } from "../../middlewares/authenticateToken.middleware";
export const userRouter = express.Router();
userRouter.get("/user", authenticateToken, user);
