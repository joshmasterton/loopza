import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "../../src/store";
import { routes } from "../../src/App";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { checkUser } from "../../src/features/authSlice";
import { useEffect } from "react";

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
