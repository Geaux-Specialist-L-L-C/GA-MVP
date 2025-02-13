// File: /src/pages/__tests__/About.test.tsx
// Description: Unit test for About page component.

import { render, screen } from "@testing-library/react";
import About from "../About";

test("renders About component with correct content", () => {
  render(<About />);
  expect(screen.getByText("About Geaux Academy")).toBeInTheDocument();
  expect(screen.getByText("Geaux Academy is an interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery.")).toBeInTheDocument();
});