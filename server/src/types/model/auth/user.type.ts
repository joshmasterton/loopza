import { Request } from "express";

export type UserTypes = {
  id: number;
  username: string;
  email: string;
  followers: number;
  following: number;
  posts: number;
  comments: number;
  likes: number;
  dislikes: number;
  created_at: string;
  profile_picture_url: string;
  is_accepted?: boolean;
  pending_user_id?: number;
};

export interface UserRequest extends Request {
  user?: UserTypes;
}
