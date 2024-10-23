import { Response } from "express";
import { UserRequest } from "../../types/model/auth/user.type";
import { PostComment } from "../../models/postComment/postComment.model";
import * as yup from "yup";

const getPostsCommentsSchema = yup.object().shape({
  userId: yup.number().optional(),
  page: yup.number().optional(),
  parent_id: yup.number().optional(),
  comment_parent_id: yup.number().optional(),
  type: yup
    .mixed<"comment" | "post">()
    .oneOf(["comment", "post"], "Type must be comment or post")
    .required(),
});

export const getPostsComments = async (req: UserRequest, res: Response) => {
  try {
    const validatedData = await getPostsCommentsSchema.validate(req.query);

    const postsComments = new PostComment();

    return res
      .status(200)
      .json(
        await postsComments.getPostsComments(
          validatedData.type,
          validatedData.parent_id,
          validatedData.comment_parent_id,
          validatedData.page != null
            ? validatedData.page < 0
              ? 0
              : validatedData.page
            : 0,
          validatedData.userId
        )
      );
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "get posts or comments has occured" });
  }
};
