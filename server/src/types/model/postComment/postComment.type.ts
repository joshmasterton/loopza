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
  reaction: "like" | "dislike" | null;
  hot_score: number;
  is_bot: boolean;
};

export type LikeDislikeTypes = {
  id: number;
  origin_id: number;
  user_id: number;
  reaction: "like" | "dislike";
};
