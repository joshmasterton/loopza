import { Response } from "express";
import { UserRequest } from "../../types/model/auth/user.type";
import * as yup from "yup";
import { Following } from "../../models/following/following.model";

const getUsersSchema = yup.object().shape({
  userId: yup.number().optional(),
  getOnlineUsers: yup.boolean().optional(),
  page: yup.number().optional(),
  search: yup.string().optional(),
  filter: yup.string().optional(),
  type: yup
    .mixed<"all" | "followers">()
    .oneOf(["all", "followers"], "Type must be all or followers")
    .required(),
});

export const getUsers = async (req: UserRequest, res: Response) => {
  try {
    const validatedData = await getUsersSchema.validate(req.query);

    const users = await new Following().gets(
      validatedData.type,
      validatedData.userId,
      validatedData.search,
      validatedData.getOnlineUsers ?? false,
      validatedData.filter,
      validatedData.page
    );

    return res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "get users error has occured" });
  }
};
