import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { useEffect } from "react";
import { checkUser } from "./features/authSlice";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home.page";
import { Auth } from "./pages/Auth.page";
import "./styles/App.scss";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <Auth />,
  },
  {
    path: "/login",
    element: <Auth isLogin />,
  },
];

const router = createBrowserRouter(routes);

export const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkUser());
  }, []);

  return <RouterProvider router={router} />;
};
