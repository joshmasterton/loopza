import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, Mock, test, vitest } from "vitest";
import {
  mockPost,
  mockPostTwo,
  mockUser,
  mockUserTwo,
  mockWeather,
  Test,
} from "../utilities/Test.utilities";
import axios from "axios";

vitest.mock("axios");

describe("Side component", () => {
  test("Should render left sidebar", async () => {
    (axios.get as Mock).mockResolvedValueOnce({
      data: [mockWeather],
    });
    (axios.get as Mock).mockResolvedValueOnce({
      data: [mockUser, mockUserTwo],
    });
    (axios.get as Mock).mockResolvedValueOnce({
      data: [mockPost, mockPostTwo],
    });
    (axios.get as Mock).mockResolvedValueOnce({ data: mockUser });
    (axios.get as Mock).mockResolvedValueOnce({
      data: [mockUser, mockUserTwo],
    });
    (axios.get as Mock).mockResolvedValueOnce({
      data: [mockPost, mockPostTwo],
    });
    (axios.get as Mock).mockResolvedValueOnce({ data: mockUser });
    (axios.get as Mock).mockResolvedValueOnce({ data: mockUser });

    await act(async () => {
      render(<Test initialEntry="/" />);
    });

    const usernames = screen.getAllByText("testUser");
    usernames.forEach((username) => {
      expect(username).toBeInTheDocument();
    });
  });
});
