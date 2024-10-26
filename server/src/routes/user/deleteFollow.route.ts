import express from "express";
import { authenticateToken } from "../../middlewares/authenticateToken.middleware";
import { deleteFollow } from "../../controllers/user/deleteFollow.controller";

export const deleteFollowRoute = express.Router();

deleteFollowRoute.post("/deleteFollow", authenticateToken, deleteFollow);
