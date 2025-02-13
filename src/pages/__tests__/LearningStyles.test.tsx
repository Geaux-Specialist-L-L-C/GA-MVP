// File: /src/pages/__tests__/LearningStyles.test.tsx
// Description: Unit test for Learning Styles page component.

import { render, screen } from "@testing-library/react";
import LearningStyles from "../LearningStyles";

test("renders Learning Styles component with correct content", () => {
  render(<LearningStyles />);
  expect(screen.getByText("Learning Styles")).toBeInTheDocument();
  expect(screen.getByText("Discover your preferred learning style and how Geaux Academy can help you learn more effectively.")).toBeInTheDocument();
});