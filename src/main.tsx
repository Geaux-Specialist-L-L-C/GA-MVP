// File: /home/wicked/GA-MVP/src/main.tsx
// Description: Main entry point for the React application.
// Author: GitHub Copilot
// Created: [Date]

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import Theme from './components/Theme';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme>
      <Router>
        <App />
      </Router>
    </Theme>
  </React.StrictMode>
);