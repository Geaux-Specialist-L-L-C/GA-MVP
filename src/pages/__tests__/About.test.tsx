// File: /src/pages/__tests__/About.test.tsx
// Description: Unit test for About page component.
// Author: GitHub Copilot
// Created: [Date]

import React from 'react';
import { describe, test, expect, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import About from "../About";

describe('About Page', () => {
  beforeEach(() => {
    render(
      <About />
    );
  });

  test("renders About component with correct content", () => {
    expect(screen.getByText("About Geaux Academy")).toBeInTheDocument();
    expect(screen.getByText("Geaux Academy is an interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery.")).toBeInTheDocument();
  });

  test("renders navigation elements", () => {
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});