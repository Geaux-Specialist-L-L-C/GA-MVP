// File: /src/pages/__tests__/Features.test.tsx
// Description: Unit test for Features page component.

import { render, screen } from "@testing-library/react";
import Features from "../Features";

test("renders Features component with correct content", () => {
  render(<Features />);
  expect(screen.getByText("Features")).toBeInTheDocument();
  expect(screen.getByText("AI-powered learning style assessment")).toBeInTheDocument();
  expect(screen.getByText("Personalized learning paths")).toBeInTheDocument();
  expect(screen.getByText("Real-time progress tracking")).toBeInTheDocument();
  expect(screen.getByText("Interactive dashboard")).toBeInTheDocument();
});