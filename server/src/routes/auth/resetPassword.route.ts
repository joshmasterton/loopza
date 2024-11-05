import express from "express";
import { resetPassword } from "../../controllers/auth/resetPassword.controller";

export const resetPasswordRouter = express.Router();

resetPasswordRouter.post("/resetPassword", resetPassword);
