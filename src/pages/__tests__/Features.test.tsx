// File: /src/pages/__tests__/Features.test.tsx
// Description: Unit test for Features page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Features from "../Features";

describe('Features Component', () => {
  test("renders Features component with correct content", () => {
    renderWithProviders(<Features />);
    expect(screen.getByText(/built for modern learning teams/i)).toBeInTheDocument();
    expect(screen.getByText(/AI-powered learning style assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/Personalized learning paths/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-time progress tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive dashboard/i)).toBeInTheDocument();
  });
});
