import { Request } from "express";

export type UserTypes = {
  id: number;
  username: string;
  email: string;
  followers: number;
  following: number;
  comments: number;
  likes: number;
  dislikes: number;
  created_at: Date;
  profile_picture_url: string;
};

export interface UserRequest extends Request {
  user?: UserTypes;
}
