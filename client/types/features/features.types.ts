export type UserTypes = {
  id: number;
  username: string;
  email: string;
  followers: number;
  following: number;
  comments: number;
  likes: number;
  dislikes: number;
  created_at: string;
  profile_picture_url: string;
};

export type PostCommentTypes = {
  id: number;
  user_id: number;
  type: "comment" | "post";
  parent_id: number | null;
  comment_parent_id: number | null;
  text: string;
  text_image_url: string | null;
  comments: number;
  likes: number;
  dislikes: number;
  created_at: string;
  username: string;
  email: string;
  profile_picture_url: string;
};
