import { createSlice } from "@reduxjs/toolkit";
import { PostCommentTypes } from "../../types/features/features.types";
import { AppDispatch } from "../store";
import axios, { AxiosError } from "axios";
import { API_URL } from "../utilities/request.utilities";
import { showPopup } from "./popupSlice";

const initialState: {
  post: PostCommentTypes | undefined;
  posts: PostCommentTypes[] | undefined;
  comments: PostCommentTypes[] | undefined;
  error: string | null;
  newItemStatus: "idle" | "loading" | "failed";
  postStatus: "idle" | "loading" | "failed";
  postsStatus: "idle" | "loading" | "failed";
  commentsStatus: "idle" | "loading" | "failed";
} = {
  post: undefined,
  posts: undefined,
  comments: undefined,
  error: null,
  newItemStatus: "idle",
  postStatus: "idle",
  postsStatus: "idle",
  commentsStatus: "idle",
};

const postsCommentsSlice = createSlice({
  name: "postsComments",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      if (action.payload.type === "post") {
        state.postStatus = "loading";
      } else if (action.payload.type === "posts") {
        state.postsStatus = "loading";
      } else if (action.payload.type === "comments") {
        state.commentsStatus = "loading";
      } else {
        state.newItemStatus = "loading";
      }
    },
    setIdle: (state, action) => {
      if (action.payload.type === "post") {
        state.postStatus = "idle";
      } else if (action.payload.type === "posts") {
        state.postsStatus = "idle";
      } else if (action.payload.type === "comments") {
        state.commentsStatus = "idle";
      } else {
        state.newItemStatus = "idle";
      }
    },
    setPost: (state, action) => {
      state.post = action.payload.post;
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setComments: (state, action) => {
      state.comments = action.payload.comments;
    },
  },
});

export const { setLoading, setIdle, setPost, setPosts, setComments } =
  postsCommentsSlice.actions;

export const newPostComment =
  (
    data:
      | FormData
      | {
          post?: string;
          comment?: string;
          parent_id?: number;
          type?: "post" | "comment";
          comment_parent_id?: number;
        }
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading({ type: "newItem" }));

    try {
      await axios.post(`${API_URL}/postComment/new`, data, {
        withCredentials: true,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
        dispatch(showPopup({ messages: [error.response.data.error] }));
      } else if (error instanceof Error) {
        console.error(error);
        dispatch(showPopup({ messages: [error.message] }));
      }
    } finally {
      dispatch(setIdle({ type: "newItem" }));
    }
  };

export const getPosts =
  (page: number = 0) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading({ type: "posts" }));

    try {
      const response = await axios.get(`${API_URL}/postComment/gets`, {
        params: {
          type: "post",
          page,
        },
      });

      dispatch(setPosts({ posts: response.data }));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
      } else if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      dispatch(setIdle({ type: "posts" }));
    }
  };

export const getComments =
  (parent_id: number, page: number = 0) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading({ type: "comments" }));

    try {
      const response = await axios.get(`${API_URL}/postComment/gets`, {
        params: {
          type: "comment",
          page,
          parent_id,
        },
      });

      dispatch(setComments({ comments: response.data }));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
      } else if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      dispatch(setIdle({ type: "comments" }));
    }
  };

export const getPost = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading({ type: "post" }));

  try {
    const response = await axios.get(`${API_URL}/postComment/get`, {
      params: {
        type: "post",
        id,
      },
    });

    dispatch(setPost({ post: response.data }));
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error(error.response?.data);
      dispatch(showPopup({ messages: [error.response.data.error] }));
    } else if (error instanceof Error) {
      console.error(error);
      dispatch(showPopup({ messages: [error.message] }));
    } else {
      dispatch(showPopup({ messages: ["An error has occured"] }));
    }
  } finally {
    dispatch(setIdle({ type: "post" }));
  }
};

export default postsCommentsSlice.reducer;
