import { createSlice } from "@reduxjs/toolkit";
import { PostCommentTypes } from "../../types/features/features.types";
import { AppDispatch } from "../store";
import axios, { AxiosError } from "axios";
import { API_URL } from "../utilities/request.utilities";
import { showPopup } from "./popupSlice";

const initialState: {
  item: PostCommentTypes | undefined;
  items: PostCommentTypes[] | undefined;
  error: string | null;
  status: "idle" | "loading" | "failed";
} = {
  item: undefined,
  items: undefined,
  error: null,
  status: "idle",
};

const postsCommentsSlice = createSlice({
  name: "postsComments",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.status = "loading";
    },
    setIdle: (state) => {
      state.status = "idle";
    },
    setPostsComments: (state, action) => {
      state.items = action.payload.items;
    },
    setPostComment: (state, action) => {
      state.item = action.payload.item;
    },
    clearPostsComments: (state, action) => {
      state.items = action.payload.items;
    },
  },
});

export const {
  setLoading,
  setIdle,
  setPostComment,
  setPostsComments,
  clearPostsComments,
} = postsCommentsSlice.actions;

export const newPostComment =
  (data: FormData) => async (dispatch: AppDispatch) => {
    dispatch(setLoading());

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

      dispatch(showPopup({ messages: ["An error has occured"] }));
    } finally {
      dispatch(setIdle());
    }
  };

export const getPostsComments =
  (type: "comment" | "post", page: number = 0) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading());

    try {
      const response = await axios.get(`${API_URL}/postComment/gets`, {
        params: {
          type,
          page,
        },
      });

      dispatch(setPostsComments({ items: response.data }));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
        dispatch(showPopup({ messages: [error.response.data.error] }));
      } else if (error instanceof Error) {
        console.error(error);
        dispatch(showPopup({ messages: [error.message] }));
      }

      dispatch(showPopup({ messages: ["An error has occured"] }));
    } finally {
      dispatch(setIdle());
    }
  };

export const getPostComment =
  (type: "comment" | "post", id: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading());

    try {
      const response = await axios.get(`${API_URL}/postComment/get`, {
        params: {
          type,
          id,
        },
      });

      dispatch(setPostComment({ item: response.data }));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
        dispatch(showPopup({ messages: [error.response.data.error] }));
      } else if (error instanceof Error) {
        console.error(error);
        dispatch(showPopup({ messages: [error.message] }));
      }

      dispatch(showPopup({ messages: ["An error has occured"] }));
    } finally {
      dispatch(setIdle());
    }
  };

export default postsCommentsSlice.reducer;
