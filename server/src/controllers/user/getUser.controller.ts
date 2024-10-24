import { Response } from "express";
import { UserRequest } from "../../types/model/auth/user.type";
import * as yup from "yup";
import { User } from "../../models/auth/user.model";

const getUserSchema = yup.object().shape({
  userId: yup.number().required(),
});

export const getUser = async (req: UserRequest, res: Response) => {
  try {
    const validatedData = await getUserSchema.validate(req.query);
    const user = await new User().getUser("id", validatedData.userId);

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "get user error has occured" });
  }
};
