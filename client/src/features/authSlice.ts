import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { LoginFormTypes } from "../../types/pages/Page.types";
import axios, { AxiosError } from "axios";
import { UserTypes } from "../../types/features/features.types";
import { API_URL } from "../utilities/request.utilities";

const initialState: {
  user: UserTypes | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "failed";
} = {
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
    setIdle: (state) => {
      state.status = "idle";
    },
    setError: (state) => {
      state.status = "failed";
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setLoading,
  setIdle,
  setError,
} = authSlice.actions;

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
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error(error);
      }

      dispatch(setError());
    } finally {
      dispatch(setIdle());
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
    if (error instanceof AxiosError) {
      console.error(error.response?.data);
    } else {
      console.error(error);
    }

    dispatch(setError());
  } finally {
    dispatch(setIdle());
  }
};

export const logoutUser = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });

    await axios.get(`${API_URL}/auth/user`, {
      withCredentials: true,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error.response?.data);
    } else {
      console.error(error);
    }

    dispatch(setError());
  } finally {
    dispatch(setCredentials({ user: null }));
    dispatch(setIdle());
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
    if (error instanceof AxiosError) {
      console.error(error.response?.data);
    } else {
      console.error(error);
    }

    dispatch(clearCredentials());
  } finally {
    dispatch(setIdle());
  }
};

export default authSlice.reducer;
