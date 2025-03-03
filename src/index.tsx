// File: /src/index.tsx
// Description: Main application entry point
// Author: evopimp
// Created: 2025-03-03 06:02:22

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import ThemeProvider from "@/styles/ThemeProvider";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);