// File: /src/pages/__tests__/Curriculum.test.tsx
// Description: Unit test for Curriculum page component.

import { render, screen } from "@testing-library/react";
import Curriculum from "../Curriculum";

test("renders Curriculum component with correct content", () => {
  render(<Curriculum />);
  expect(screen.getByText("Curriculum")).toBeInTheDocument();
  expect(screen.getByText("Our curriculum is designed to adapt to your learning style and pace.")).toBeInTheDocument();
});