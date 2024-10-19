import { tableConfig } from "../../app";
import { uploadImage } from "../../config/cloudinary.config";
import { queryDatabase } from "../../database/query.database";
import { PostCommentTypes } from "../../types/model/postComment/postComment.type";

export class PostComment {
  public id?: number;
  public text?: string;
  public type?: "comment" | "post";
  public file?: Express.Multer.File;
  public user_id?: number;
  public parent_id?: number;
  public comment_parent_id?: number;

  constructor(
    text?: string,
    type?: "comment" | "post",
    user_id?: number,
    file?: Express.Multer.File,
    id?: number
  ) {
    this.text = text;
    this.file = file;
    this.type = type;
    this.user_id = user_id;
    this.id = id;
  }

  async new(
    parent_id: number | undefined = undefined,
    comment_parent_id: number | undefined = undefined
  ) {
    let query: string;
    let queryParameters: (string | number | undefined)[];

    if (parent_id) {
      const checkParentExists = await queryDatabase(
        `
					SELECT * FROM ${tableConfig.getPostsCommentsTable()}
					WHERE id = $1
				`,
        [parent_id]
      );

      if (!checkParentExists.rows[0]) {
        throw new Error("No post exists");
      }
    }

    try {
      if (!this.file) {
        query = `
					INSERT INTO ${tableConfig.getPostsCommentsTable()} (
						user_id, type, text, parent_id, comment_parent_id
					) VALUES (
						$1, $2, $3, $4, $5
					) RETURNING id, type
				`;
        queryParameters = [
          this.user_id,
          this.type,
          this.text,
          parent_id,
          comment_parent_id,
        ];
      } else {
        const uploadedImage = (await uploadImage(this.file)) as string;

        query = `
					INSERT INTO ${tableConfig.getPostsCommentsTable()} (
						user_id, type, text, text_image_url, parent_id, comment_parent_id
					) VALUES (
						$1, $2, $3, $4, $5, $6
					) RETURNING id, type
				`;
        queryParameters = [
          this.user_id,
          this.type,
          this.text,
          uploadedImage,
          parent_id,
          comment_parent_id,
        ];
      }

      const newPostComment = await queryDatabase(query, queryParameters);

      if (parent_id) {
        await queryDatabase(
          `
      			UPDATE ${tableConfig.getPostsCommentsTable()}
      			SET comments = comments + 1
      			WHERE id = $1
      		`,
          [parent_id]
        );
      }

      if (comment_parent_id) {
        await queryDatabase(
          `
      			UPDATE ${tableConfig.getPostsCommentsTable()}
      			SET comments = comments + 1
      			WHERE id = $1
      		`,
          [comment_parent_id]
        );
      }

      this.id = newPostComment.rows[0].id;
      this.type = newPostComment.rows[0].type;

      return this;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async getPostComment() {
    try {
      const postCommentFromDb = await queryDatabase(
        `
					SELECT pc.*, u.username, u.email, u.profile_picture_url
					FROM ${tableConfig.getPostsCommentsTable()} pc
					JOIN ${tableConfig.getUsersTable()} u
					ON pc.user_id = u.id
					WHERE pc.id = $1
					AND pc.type = $2
				`,
        [this.id, this.type]
      );

      const postComment = postCommentFromDb.rows[0] as PostCommentTypes;
      postComment.created_at = new Date(
        postComment.created_at
      ).toLocaleString();

      return postComment;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async getPostsComments(
    type: "comment" | "post",
    parent_id: number | null = null,
    comment_parent_id: number | null = null,
    page: number = 0
  ) {
    try {
      const postsCommentsFromDb = await queryDatabase(
        `
					SELECT pc.*, u.username, u.email, u.profile_picture_url
					FROM ${tableConfig.getPostsCommentsTable()} pc
					JOIN ${tableConfig.getUsersTable()} u
					ON pc.user_id = u.id
					WHERE pc.type = $1
					${parent_id === null ? "AND parent_id IS NULL" : `AND parent_id = ${parent_id}`}
					${
            comment_parent_id === null
              ? "AND comment_parent_id IS NULL"
              : `AND comment_parent_id = ${comment_parent_id}`
          }
					ORDER BY created_at DESC
					LIMIT 10 OFFSET $2
				`,
        [type, page]
      );

      const postsComments: PostCommentTypes[] = await Promise.all(
        postsCommentsFromDb.rows.map((postCommentFromDb: PostCommentTypes) => {
          return {
            ...postCommentFromDb,
            created_at: new Date(postCommentFromDb.created_at).toLocaleString(),
          };
        })
      );

      return postsComments;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
