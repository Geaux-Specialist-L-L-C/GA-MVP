// File: /src/pages/__tests__/Home.test.tsx
// Description: Unit test for Home page component.

import { render, screen } from "@testing-library/react";
import Home from "../Home";

test("renders Home component with correct content", () => {
  render(<Home />);
  expect(screen.getByText("Welcome to Geaux Academy")).toBeInTheDocument();
  expect(screen.getByText("Empowering Personalized Learning through AI.")).toBeInTheDocument();
});