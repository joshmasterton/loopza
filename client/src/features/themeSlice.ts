import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";

const initialState: {
  currentTheme: "dark" | "light";
} = {
  currentTheme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload.currentTheme;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export const getTheme = () => (dispatch: AppDispatch) => {
  const localTheme = localStorage.getItem("loopza_theme");

  if (!localTheme) {
    localStorage.setItem("loopza_theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
    dispatch(setTheme({ currentTheme: "light" }));
  } else {
    document.documentElement.setAttribute("data-theme", localTheme);
    dispatch(setTheme({ currentTheme: localTheme }));
  }
};

export const changeTheme =
  (currentTheme: "light" | "dark") => (dispatch: AppDispatch) => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    localStorage.setItem("loopza_theme", newTheme);
    dispatch(setTheme({ currentTheme: newTheme }));
  };

export default themeSlice.reducer;