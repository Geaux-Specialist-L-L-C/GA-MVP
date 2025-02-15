// File: /home/wicked/geauxai/GA-MVP/src/main.tsx
// Description: Main entry point for the React application
// Author: GitHub Copilot
// Created: 2024-02-12

import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  BrowserRouter, 
  createBrowserRouter, 
  RouterProvider
} from 'react-router-dom';
import App from './App';
import './index.css';

// Configure future flags for React Router v7
const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);