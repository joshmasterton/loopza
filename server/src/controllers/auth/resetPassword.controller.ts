import { Request, Response } from "express";
import * as yup from "yup";
import { User } from "../../models/auth/user.model";

const resetPasswordSchema = yup.object().shape({
  email: yup.string().email("Must be a valid email type").required(),
  newPassword: yup.string().required(),
  newConfirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), undefined], "Passwords must match")
    .required(),
  token: yup.string().required(),
});

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = await resetPasswordSchema.validate(req.body);
    const user = new User(undefined, validatedData.email);

    await user.resetPassword(validatedData.newPassword, validatedData.token);
    return res.status(201).json({ message: "Password updated" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "reset password error has occured" });
  }
};
