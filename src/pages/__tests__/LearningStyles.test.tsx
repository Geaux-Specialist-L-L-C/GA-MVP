import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import LearningStyles from "../LearningStyles";

describe('LearningStyles Component', () => {
  test("renders Learning Styles component with correct content", () => {
    renderWithProviders(<LearningStyles />, { withRouter: true });
    expect(screen.getByRole('heading', { name: /learning styles/i })).toBeInTheDocument();
    expect(screen.getByText("Discover your preferred learning style and how Geaux Academy can help you learn more effectively.")).toBeInTheDocument();
    expect(screen.getByText("Visual")).toBeInTheDocument();
    expect(screen.getByText("Auditory")).toBeInTheDocument();
    expect(screen.getByText("Reading/Writing")).toBeInTheDocument();
    expect(screen.getByText("Kinesthetic")).toBeInTheDocument();
    expect(screen.getByText("Logical")).toBeInTheDocument();
    expect(screen.getByText("Social")).toBeInTheDocument();
  });
});
