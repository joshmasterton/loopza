import express from "express";
import { logout } from "../../controllers/auth/logout.controller.js";
import { authenticateToken } from "../../middlewares/authenticateToken.middleware.js";
export const logoutRoute = express.Router();
logoutRoute.post("/logout", authenticateToken, logout);
