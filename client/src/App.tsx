import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Auth } from "./pages/Auth.pages";

export const App = () => {
  const routes = [
    {
      path: "/",
      element: <Auth />,
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
