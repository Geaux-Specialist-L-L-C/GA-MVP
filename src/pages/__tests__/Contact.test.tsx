import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Contact from "../Contact";

describe('Contact Component', () => {
  test("renders Contact component with correct content", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByText(/Feel free to reach out to us with any questions or feedback./i)).toBeInTheDocument();
  });
});
