// File: /src/pages/__tests__/Contact.test.tsx
// Description: Unit test for Contact page component.

import { screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { renderWithProviders } from "../../test/testUtils";
import Contact from "../Contact";

describe('Contact Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Contact component with correct content", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByText(/Feel free to reach out to us with any questions or feedback./i)).toBeInTheDocument();
  });
});