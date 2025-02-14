// File: /src/pages/__tests__/LearningStyles.test.tsx
// Description: Unit test for Learning Styles page component.

import { screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { renderWithProviders } from "../../test/testUtils";
import LearningStyles from "../LearningStyles";

describe('LearningStyles Component', () => {
  test("renders Learning Styles component with correct content", () => {
    renderWithProviders(<LearningStyles />);
    expect(screen.getByText("Learning Styles")).toBeInTheDocument();
    expect(screen.getByText("Discover your preferred learning style and how Geaux Academy can help you learn more effectively.")).toBeInTheDocument();
  });
});