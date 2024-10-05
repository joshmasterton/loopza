import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "../../src/store";
import { routes } from "../../src/App";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { checkUser } from "../../src/features/authSlice";
import { useEffect } from "react";
import { UserTypes } from "../../types/features/features.types";

export const mockUser: UserTypes = {
  id: 1,
  username: "testUser",
  email: "testEmail@email.com",
  followers: 0,
  following: 0,
  comments: 0,
  likes: 0,
  dislikes: 0,
  created_at: new Date(Date.now()).toLocaleString(),
  profile_picture_url: "http://www.random.com",
};

export const API_URL = "http://localhost:80";

export const Test = ({ initialEntry }: { initialEntry: string }) => {
  return (
    <Provider store={store}>
      <TestApp initialEntry={initialEntry} />
    </Provider>
  );
};

export const TestApp = ({ initialEntry }: { initialEntry: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = createMemoryRouter(routes, { initialEntries: [initialEntry] });

  useEffect(() => {
    dispatch(checkUser());
  }, []);

  return <RouterProvider router={router} />;
};
