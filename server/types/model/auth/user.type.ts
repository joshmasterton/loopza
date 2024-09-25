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
};

export interface UserRequest extends Request {
  user?: UserTypes;
}
