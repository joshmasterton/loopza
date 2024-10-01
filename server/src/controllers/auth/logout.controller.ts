import { Response } from "express";
import { User } from "../../models/auth/user.model";
import { UserRequest } from "../../../types/model/auth/user.type";

export const logout = (req: UserRequest, res: Response) => {
  try {
    const currentUser = new User();

    if (!req.user?.id) {
      throw new Error("No user present");
    }

    currentUser.logout(req.user?.id);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "logout error has occured" });
  }
};
