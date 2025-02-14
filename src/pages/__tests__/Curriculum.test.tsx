// File: /src/pages/__tests__/Curriculum.test.tsx
// Description: Unit test for Curriculum page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Curriculum from "../Curriculum";

describe('Curriculum Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Curriculum component with correct content", () => {
    renderWithProviders(<Curriculum />);
    expect(screen.getByRole('heading', { name: /curriculum/i })).toBeInTheDocument();
    expect(screen.getByText(/Our curriculum is designed to adapt to your learning style and pace./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google to get started/i })).toBeInTheDocument();
  });
});