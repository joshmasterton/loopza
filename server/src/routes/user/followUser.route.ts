import express from "express";
import { followUser } from "../../controllers/user/followUser.controller";
import { authenticateToken } from "../../middlewares/authenticateToken.middleware";

export const followUserRoute = express.Router();

followUserRoute.post("/follow", authenticateToken, followUser);
