import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { LoginFormTypes } from "../../types/pages/Page.types";
import axios from "axios";

const API_URL = "http://localhost:80";

const initialState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state) => {
      state.status = "failed";
    },
  },
});

export const { setCredentials, clearCredentials, setLoading, setError } =
  authSlice.actions;

export const loginUser =
  (data: LoginFormTypes) => async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    try {
      await axios.post(`${API_URL}/auth/login`, data, {
        withCredentials: true,
      });

      const response = await axios.get(`${API_URL}/auth/user`, {
        withCredentials: true,
      });

      dispatch(setCredentials({ user: response.data }));
    } catch (error) {
      console.error(error);
      dispatch(setError());
    }
  };

export const signupUser = (data: FormData) => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
    await axios.post(`${API_URL}/auth/signup`, data, { withCredentials: true });

    const response = await axios.get(`${API_URL}/auth/user`, {
      withCredentials: true,
    });

    dispatch(setCredentials({ user: response.data }));
  } catch (error) {
    console.error(error);
    dispatch(setError());
  }
};

export const checkUser = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.get(`${API_URL}/auth/user`, {
      withCredentials: true,
    });

    if (response.data) {
      dispatch(setCredentials({ user: response.data }));
    } else {
      dispatch(clearCredentials());
    }
  } catch (error) {
    console.error(error);
    dispatch(clearCredentials());
  }
};

export default authSlice.reducer;
