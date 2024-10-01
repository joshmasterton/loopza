import express from "express";
import { logout } from "../../controllers/auth/logout.controller";
import { authenticateToken } from "../../middlewares/authenticateToken.middleware";

export const logoutRoute = express.Router();

logoutRoute.post("/logout", authenticateToken, logout);
