import { Response } from "express";
import { UserRequest } from "../../types/model/auth/user.type";
import * as yup from "yup";
import validator from "validator";
import { User } from "../../models/auth/user.model";
import { generateToken } from "../../utilities/token.utilities";

const updateProfileSchema = yup.object().shape({
  username: yup
    .string()
    .min(6, "Username must be at least 6 characters")
    .optional(),
  email: yup.string().email("Must be a valid email type").required().optional(),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  confirmNewPassword: yup
    .string()
    .test("passwords-match", "Passwords must match", function (value) {
      return !this.parent.password || value === this.parent.password;
    })
    .optional(),
});

export const updateProfile = async (req: UserRequest, res: Response) => {
  try {
    const { user } = req;
    const file = req.file;

    if (!user?.id) {
      throw new Error("No user present");
    }

    const validatedData = await updateProfileSchema.validate(req.body);

    const serializedUsername = validatedData.username
      ? validator.escape(validatedData.username)
      : undefined;
    const serializedEmail = validatedData.email
      ? validator.escape(validatedData.email)
      : undefined;
    const serializedPassword = validatedData.newPassword
      ? validator.escape(validatedData.newPassword)
      : undefined;

    const updatedUser = await new User(
      serializedUsername,
      serializedEmail,
      serializedPassword,
      file
    ).update(user.id);

    if (updatedUser) {
      const refreshToken = generateToken(user.id, "refresh");
      const accessToken = generateToken(user.id, "access");

      await updatedUser.updateRefreshToken(refreshToken, user.id);

      return res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          domain: process.env.NODE_ENV === "production" ? ".zonomaly.com" : "",
          maxAge: 15 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          domain: process.env.NODE_ENV === "production" ? ".zonomaly.com" : "",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({ message: "Update successful" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: "update profile server error" });
  }
};
