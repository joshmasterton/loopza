import { describe, expect, test } from "vitest";
import { Button } from "../../src/components/Button.component";
import { render, screen } from "@testing-library/react";

describe("Button component", () => {
  test("Should render button correctly", () => {
    render(
      <Button id="test" type="button">
        Test
      </Button>
    );

    expect(screen.queryByRole("button", { name: "Test" }));
  });
});
