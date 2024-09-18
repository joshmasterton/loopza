import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Auth } from "./pages/Auth.pages";
import "./styles/App.scss";

export const App = () => {
  const routes = [
    {
      path: "/",
      element: <Auth />,
    },
  ];

  const router = createBrowserRouter(routes);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
