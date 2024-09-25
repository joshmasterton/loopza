import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { useEffect } from "react";
import { checkUser } from "./features/authSlice";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/App.scss";
import { Auth } from "./pages/Auth.pages";

export const routes = [
  {
    path: "/",
    element: <Auth isLogin />,
  },
  {
    path: "/signup",
    element: <Auth />,
  },
];

const router = createBrowserRouter(routes);

export const App = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkUser());
  }, []);

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  return <RouterProvider router={router} />;
};
