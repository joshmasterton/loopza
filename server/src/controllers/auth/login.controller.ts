import { Request, Response } from "express";
import { loginUser } from "../../services/auth/login.service";
import * as yup from "yup";
import validator from "validator";

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .min(6, "Username must be at least 6 characters")
    .required(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required(),
});

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = await loginSchema.validate(req.body);

    const serializedUsername = validator.escape(validatedData.username);

    const tokens = await loginUser(serializedUsername, validatedData.password);

    return res
      .cookie("accessToken", tokens?.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", tokens?.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "login error has occured" });
  }
};
