import { createMemoryRouter } from "react-router-dom";
import { routes } from "../../src/App";

export const memoryRouter = (index: string) => {
  return createMemoryRouter(routes, { initialEntries: [index] });
};
