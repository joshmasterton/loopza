import express from "express";
import { getUsers } from "../../controllers/user/getUsers.controller";

export const getUsersRouter = express.Router();

getUsersRouter.get("/gets", getUsers);
