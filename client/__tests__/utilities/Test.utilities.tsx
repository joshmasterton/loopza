import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "../../src/store";
import { routes } from "../../src/App";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { checkUser } from "../../src/features/authSlice";
import { useEffect } from "react";
import {
  PostCommentTypes,
  UserTypes,
} from "../../types/features/features.types";

export const mockUser: UserTypes = {
  id: 1,
  username: "testUser",
  email: "testEmail@email.com",
  followers: 0,
  following: 0,
  comments: 0,
  posts: 0,
  likes: 0,
  dislikes: 0,
  created_at: new Date(Date.now()).toLocaleString(),
  profile_picture_url: "http://www.random.com",
};

export const mockPost: PostCommentTypes = {
  id: 1,
  user_id: 1,
  type: "post",
  parent_id: null,
  comment_parent_id: null,
  text: "Random post",
  text_image_url: "http://www.random.com",
  comments: 0,
  likes: 0,
  dislikes: 0,
  created_at: "",
  username: "testUser",
  email: "testEmail@email.com",
  profile_picture_url: "http://www.random.com",
  reaction: "like",
};

export const mockPostTwo: PostCommentTypes = {
  id: 2,
  user_id: 1,
  type: "post",
  parent_id: null,
  comment_parent_id: null,
  text: "Random post",
  text_image_url: "http://www.random.com",
  comments: 0,
  likes: 0,
  dislikes: 0,
  created_at: "",
  username: "testUser",
  email: "testEmail@email.com",
  profile_picture_url: "http://www.random.com",
  reaction: "like",
};

export const Test = ({ initialEntry }: { initialEntry: string }) => {
  return (
    <Provider store={store}>
      <TestApp initialEntry={initialEntry} />
    </Provider>
  );
};

export const TestApp = ({ initialEntry }: { initialEntry: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = createMemoryRouter(routes, { initialEntries: [initialEntry] });

  useEffect(() => {
    dispatch(checkUser());
  }, []);

  return <RouterProvider router={router} />;
};
