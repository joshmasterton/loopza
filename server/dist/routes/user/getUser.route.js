import express from "express";
import { getUser } from "../../controllers/user/getUser.controller.js";
export const getUserRouter = express.Router();
getUserRouter.get("/get", getUser);
