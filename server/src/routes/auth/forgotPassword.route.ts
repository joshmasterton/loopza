import express from "express";
import { forgotPassword } from "../../controllers/auth/forgotPassword.controller";

export const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post("/forgotPassword", forgotPassword);
