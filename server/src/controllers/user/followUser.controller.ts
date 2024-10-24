import { Response } from "express";
import { UserRequest } from "../../types/model/auth/user.type";
import * as yup from "yup";
import { Following } from "../../models/following/following.model";

const followUserSchema = yup.object().shape({
  follower_two_id: yup.number().required(),
});

export const followUser = async (req: UserRequest, res: Response) => {
  try {
    const { user } = req;
    const validatedData = await followUserSchema.validate(req.body);

    if (!user) {
      throw new Error("No user found");
    }

    const newFollowing = new Following(
      user?.id,
      user?.id,
      validatedData.follower_two_id
    );

    return res.status(201).json(await newFollowing.new());
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "follow user error has occured" });
  }
};