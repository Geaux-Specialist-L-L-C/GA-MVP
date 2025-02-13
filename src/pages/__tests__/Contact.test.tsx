// File: /src/pages/__tests__/Contact.test.tsx
// Description: Unit test for Contact page component.

import { render, screen } from "@testing-library/react";
import Contact from "../Contact";

test("renders Contact component with correct content", () => {
  render(<Contact />);
  expect(screen.getByText("Contact Us")).toBeInTheDocument();
  expect(screen.getByText("Feel free to reach out to us with any questions or feedback.")).toBeInTheDocument();
});