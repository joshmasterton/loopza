import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import themeReducer from "./features/themeSlice";
import postsCommentsReducer from "./features/postsCommentsSlice";
import popupReducer from "./features/popupSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    postsComments: postsCommentsReducer,
    popup: popupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
