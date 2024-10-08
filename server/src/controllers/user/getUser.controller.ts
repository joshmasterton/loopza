import { Response } from "express";
import { UserRequest } from "../../../types/model/auth/user.type";

export const getUser = (req: UserRequest, res: Response) => {
  try {
    return res.status(200).json({ message: "getUser" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "get posts or comments has occured" });
  }
};
