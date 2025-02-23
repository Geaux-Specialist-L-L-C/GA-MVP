import { screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { renderWithProviders } from "../../test/testUtils";
import About from "../About";

describe('About Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithProviders(<About />);
  });

  test("renders About component with correct content", () => {
    expect(screen.getByRole('heading', { name: /about geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/Geaux Academy is an interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery./i)).toBeInTheDocument();
  });
});
