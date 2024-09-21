import { beforeEach, afterEach, vitest } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

beforeEach(() => {
  vitest.clearAllMocks();
});

afterEach(() => {
  cleanup();
});
