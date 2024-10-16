import { PostComment } from "../../models/postComment/postComment.model";
import * as yup from "yup";
const getPostsCommentsSchema = yup.object().shape({
    page: yup.number().optional(),
    parent_id: yup.number().optional(),
    comment_parent_id: yup.number().optional(),
    type: yup
        .mixed()
        .oneOf(["comment", "post"], "Type must be comment or post")
        .required(),
});
export const getPostsComments = async (req, res) => {
    try {
        const validatedData = await getPostsCommentsSchema.validate(req.query);
        const postsComments = new PostComment();
        return res
            .status(200)
            .json(await postsComments.getPostsComments(validatedData.type, validatedData.parent_id, validatedData.comment_parent_id));
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(400).json({ error: "get posts or comments has occured" });
    }
};
