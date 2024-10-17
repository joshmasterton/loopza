import { Response } from "express";
import { UserRequest } from "../../types/model/auth/user.type";

export const user = async (req: UserRequest, res: Response) => {
  try {
    return res.json(req.user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "Error getting user" });
  }
};
