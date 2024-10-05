import { Response } from "express";
import { UserRequest } from "../../../types/model/auth/user.type";
import * as yup from "yup";
import validator from "validator";
import { PostComment } from "../../models/postComment/postComment.model";

const newPostCommentSchema = yup.object().shape({
  post: yup.string().min(1, "Post cannot be empty").required(),
  parent_id: yup.number(),
  comment_parent_id: yup.number(),
  type: yup
    .mixed<"comment" | "post">()
    .oneOf(["comment", "post"], "Type must be comment or post")
    .required(),
});

export const newPostComment = async (req: UserRequest, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      throw new Error("No user present");
    }

    const validatedData = await newPostCommentSchema.validate(req.body);
    const serializedPost = validator.escape(validatedData.post);

    const file = req.file;

    let postComment: PostComment;

    if (!file) {
      postComment = new PostComment(
        serializedPost,
        validatedData.type,
        user?.id,
        undefined
      );
    } else {
      postComment = new PostComment(
        serializedPost,
        validatedData.type,
        user?.id,
        file
      );
    }

    await postComment.new(
      validatedData.parent_id,
      validatedData.comment_parent_id
    );

    return res.status(201).json(await postComment.getPostComment());
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "new post or comment has occured" });
  }
};
