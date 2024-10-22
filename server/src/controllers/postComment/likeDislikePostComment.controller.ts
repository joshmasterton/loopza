import { Response } from "express";
import { UserRequest } from "../../types/model/auth/user.type";
import { PostComment } from "../../models/postComment/postComment.model";
import * as yup from "yup";

const likeDislikePostCommentSchema = yup.object().shape({
  id: yup.number().required(),
  type: yup
    .mixed<"post" | "comment">()
    .oneOf(["post", "comment"], "Type must be like or dislike")
    .required(),
  reaction: yup
    .mixed<"like" | "dislike">()
    .oneOf(["like", "dislike"], "Type must be like or dislike")
    .required(),
});

export const likeDislikePostComment = async (
  req: UserRequest,
  res: Response
) => {
  try {
    const { user } = req;
    const validatedData = await likeDislikePostCommentSchema.validate(req.body);

    if (!user) {
      throw new Error("No user");
    }

    const postComment = await new PostComment(
      undefined,
      validatedData.type,
      undefined,
      undefined,
      validatedData.id
    ).likeDislike(user?.id, validatedData.reaction);

    return res.status(200).json(postComment);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "like or dislike error has occured" });
  }
};
