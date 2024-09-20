import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Auth } from "./pages/Auth.pages";
import "./styles/App.scss";

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
  return <RouterProvider router={router} />;
};
