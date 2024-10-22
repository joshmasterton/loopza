import { Response } from "express";
import { UserRequest } from "../../types/model/auth/user.type";
import { PostComment } from "../../models/postComment/postComment.model";
import * as yup from "yup";

const getPostCommentSchema = yup.object().shape({
  userId: yup.number().optional(),
  id: yup.number().required("Id required"),
  type: yup
    .mixed<"comment" | "post">()
    .oneOf(["comment", "post"], "Type must be comment or post")
    .required(),
});

export const getPostComment = async (req: UserRequest, res: Response) => {
  try {
    const validatedData = await getPostCommentSchema.validate(req.query);

    const postsComments = new PostComment(
      "",
      validatedData.type,
      undefined,
      undefined,
      validatedData.id
    );

    return res
      .status(200)
      .json(await postsComments.getPostComment(validatedData.userId));
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "get posts or comments has occured" });
  }
};
