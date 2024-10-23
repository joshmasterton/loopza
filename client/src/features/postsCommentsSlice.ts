import { createSlice } from "@reduxjs/toolkit";
import { PostCommentTypes } from "../../types/features/features.types";
import { AppDispatch } from "../store";
import axios, { AxiosError } from "axios";
import { API_URL } from "../utilities/request.utilities";
import { showPopup } from "./popupSlice";

const initialState: {
  post: PostCommentTypes | undefined;
  posts: PostCommentTypes[] | undefined;
  postsPage: number;
  comments: PostCommentTypes[] | undefined;
  commentsPage: number;
  error: string | null;
  previousStatus: "idle" | "loading" | "failed";
  moreStatus: "idle" | "loading" | "failed";
  newItemStatus: "idle" | "loading" | "failed";
  postStatus: "idle" | "loading" | "failed";
  postsStatus: "idle" | "loading" | "failed";
  commentsStatus: "idle" | "loading" | "failed";
} = {
  post: undefined,
  posts: undefined,
  postsPage: 0,
  comments: undefined,
  commentsPage: 0,
  error: null,
  previousStatus: "idle",
  moreStatus: "idle",
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
      } else if (action.payload.type === "more") {
        state.moreStatus = "loading";
      } else if (action.payload.type === "previous") {
        state.previousStatus = "loading";
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
      } else if (action.payload.type === "more") {
        state.moreStatus = "idle";
      } else if (action.payload.type === "previous") {
        state.previousStatus = "idle";
      } else {
        state.newItemStatus = "idle";
      }
    },
    setPostsPage: (state, action) => {
      state.postsPage = action.payload.page;
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
    setCommentsPage: (state, action) => {
      state.commentsPage = action.payload.page;
    },
  },
});

export const {
  setLoading,
  setPostsPage,
  setCommentsPage,
  setIdle,
  setPost,
  setPosts,
  setComments,
} = postsCommentsSlice.actions;

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
  (
    page: number = 0,
    userId: number | null = null,
    isPrevious: boolean = false,
    isMore: boolean = false
  ) =>
  async (dispatch: AppDispatch) => {
    if (isMore) {
      dispatch(setLoading({ type: "more" }));
    } else if (isPrevious) {
      dispatch(setLoading({ type: "previous" }));
    } else {
      dispatch(setLoading({ type: "posts" }));
    }

    try {
      const response = await axios.get(`${API_URL}/postComment/gets`, {
        params: {
          type: "post",
          page: isMore ? page + 1 : isPrevious ? Math.max(0, page - 1) : page,
          userId,
        },
      });

      if (response.data.length !== 0) {
        dispatch(setPosts({ posts: response.data }));
      }

      if (response.data.length > 0 && isMore) {
        dispatch(setPostsPage({ page: page + 1 }));
      } else if (isPrevious) {
        dispatch(setPostsPage({ page: Math.max(0, page - 1) }));
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
      } else if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      if (isMore) {
        dispatch(setIdle({ type: "more" }));
      } else if (isPrevious) {
        dispatch(setIdle({ type: "previous" }));
      } else {
        dispatch(setIdle({ type: "posts" }));
      }
    }
  };

export const getComments =
  (
    parent_id: number,
    page: number = 0,
    userId: number | null = null,
    isPrevious: boolean = false,
    isMore: boolean = false
  ) =>
  async (dispatch: AppDispatch) => {
    if (isMore) {
      dispatch(setLoading({ type: "more" }));
    } else if (isPrevious) {
      dispatch(setLoading({ type: "previous" }));
    } else {
      dispatch(setLoading({ type: "comments" }));
    }

    try {
      const response = await axios.get(`${API_URL}/postComment/gets`, {
        params: {
          type: "comment",
          page: isMore ? page + 1 : isPrevious ? Math.max(0, page - 1) : page,
          parent_id,
          userId,
        },
      });

      if (response.data.length !== 0) {
        dispatch(setComments({ comments: response.data }));
      }

      if (response.data.length > 0 && isMore) {
        dispatch(setCommentsPage({ page: page + 1 }));
      } else if (isPrevious) {
        dispatch(setCommentsPage({ page: Math.max(0, page - 1) }));
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
      } else if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      if (isMore) {
        dispatch(setIdle({ type: "more" }));
      } else if (isPrevious) {
        dispatch(setIdle({ type: "previous" }));
      } else {
        dispatch(setIdle({ type: "comments" }));
      }
    }
  };

export const getPost =
  (id: number, userId: number | null = null) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading({ type: "post" }));

    try {
      const response = await axios.get(`${API_URL}/postComment/get`, {
        params: {
          type: "post",
          id,
          userId,
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

export const likeDislike =
  (id: number, reaction: "like" | "dislike", type: "post" | "comment") =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.put(
        `${API_URL}/postComment/likeDislike`,
        {
          reaction,
          type,
          id,
        },
        { withCredentials: true }
      );

      return response.data as PostCommentTypes;
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
    }
  };

export default postsCommentsSlice.reducer;
