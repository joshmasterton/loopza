import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { ReactNode, useEffect } from "react";
import { checkUser } from "./features/authSlice";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home.page";
import { Auth } from "./pages/Auth.page";
import { getTheme } from "./features/themeSlice";
import { Side } from "./components/Side.component";
import { Nav } from "./components/Nav.component";
import { NewPost } from "./pages/NewPost.page";
import { Error } from "./pages/Error.page";
import { PostPage } from "./pages/Post.page";
import { Protected } from "./utilities/Protected.utilities";
import { Popup } from "./utilities/Popup.utilities";
import "./styles/App.scss";

export const Wrapper = ({
  children,
  isReturn = false,
}: {
  children: ReactNode;
  isReturn?: boolean;
}) => {
  return (
    <>
      <Side type="left" />
      <Nav isReturn={isReturn} />
      {children}
      <Side type="right" />
    </>
  );
};

export const routes = [
  {
    path: "/",
    element: (
      <Wrapper>
        <Home />
      </Wrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/newPost",
    element: (
      <Wrapper isReturn>
        <Protected>
          <NewPost />
        </Protected>
      </Wrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/post/:postId",
    element: (
      <Wrapper isReturn>
        <PostPage />
      </Wrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/profile/:username",
    element: (
      <Wrapper>
        <Home />
      </Wrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/following",
    element: (
      <Wrapper>
        <Home />
      </Wrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/signup",
    element: <Auth />,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Auth isLogin />,
    errorElement: <Error />,
  },
];

const router = createBrowserRouter(routes, { basename: "/" });

export const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentTheme } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    dispatch(checkUser());
  }, []);

  useEffect(() => {
    dispatch(getTheme());
  }, [currentTheme]);

  return (
    <>
      <Popup />
      <RouterProvider router={router} />
    </>
  );
};
