# React Application Structure and Content - Part 4

Generated on: 2025-12-29 15:16:30

## /package.json

```json
{
  "name": "geaux-academy",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "engines": {
    "node": ">=18.20.6",
    "npm": ">=8.0.0"
  },
  "scripts": {
    "start": "vite",
    "dev": "node scripts/generate-certs.js && vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "serve": "firebase emulators:start",
    "deploy": "firebase deploy",
    "ci": "npm ci --legacy-peer-deps && npm run lint && npm test && npm run build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "prepare": "git rev-parse --git-dir > /dev/null 2>&1 && husky install || true"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@firebasegen/default-connector": "file:dataconnect-generated/js/default-connector",
    "@fontsource/poppins": "^5.1.1",
    "@fontsource/roboto": "^5.1.1",
    "@fortawesome/fontawesome-svg-core": "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.7.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@genkit-ai/googleai": "0.9.12",
    "@langchain/openai": "^0.4.2",
    "@mui/icons-material": "^6.4.4",
    "@mui/material": "^6.4.5",
    "@mui/styles": "^6.4.3",
    "@reduxjs/toolkit": "^2.5.0",
    "@supabase/supabase-js": "^2.49.1",
    "@vitejs/plugin-vue": "^5.2.1",
    "@vue/compiler-sfc": "^3.5.13",
    "axios": "^1.7.9",
    "chart.js": "^4.4.7",
    "dotenv": "^16.4.7",
    "express": "^4.18.2",
    "firebase": "^11.3.1",
    "firebase-admin": "12.7.0",
    "firebase-functions": "^4.4.1",
    "framer-motion": "^12.0.6",
    "genkit": "0.9.12",
    "google-auth-library": "^9.15.1",
    "google-gax": "^4.4.1",
    "langchain": "^0.3.13",
    "mongodb": "^6.13.1",
    "mongoose": "^8.10.2",
    "prettier": "^3.4.2",
    "react": "^18.0.0",
    "react-chartjs-2": "^5.3.0",
    "react-dom": "^18.0.0",
    "react-icons": "^5.4.0",
    "react-redux": "^9.2.0",
    "react-router": "^6.22.0",
    "react-router-dom": "^6.22.0",
    "styled-components": "^6.1.15",
    "vue": "^3.5.13",
    "vue-chartjs": "^5.3.2"
  },
  "devDependencies": {
    "@babel/preset-env": "^7.26.9",
    "@babel/preset-react": "^7.26.3",
    "@eslint/js": "^8.45.0",
    "@firebase/app-types": "^0.9.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^14.3.1",
    "@testing-library/react-hooks": "^8.0.1",
    "@testing-library/user-event": "^14.6.1",
    "@types/jest": "29.5.14",
    "@types/node": "^22.13.1",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@typescript-eslint/eslint-plugin": "^5.62.0",
    "@typescript-eslint/parser": "^5.62.0",
    "@typescript-eslint/typescript-estree": "^6.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "@vitest/coverage-v8": "^1.6.1",
    "babel-jest": "^29.7.0",
    "eslint": "^8.0.0",
    "eslint-import-resolver-typescript": "^3.7.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "eslint-plugin-vue": "^9.32.0",
    "firebase-functions-test": "^3.1.0",
    "genkit-cli": "^1.0.0",
    "glob": "^10.3.10",
    "globals": "^15.14.0",
    "husky": "^9.1.7",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.7.0",
    "jsdom": "^22.1.0",
    "lru-cache": "^10.2.0",
    "mkcert": "^3.2.0",
    "prettier-eslint": "^15.0.0",
    "rimraf": "^5.0.5",
    "selfsigned": "^2.4.1",
    "ts-jest": "^29.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.1.6",
    "typescript-eslint": "^8.24.0",
    "vite": "^6.1.0",
    "vitest": "^1.6.1",
    "vue-loader": "^17.4.2"
  },
  "overrides": {
    "glob": "^10.3.10",
    "rimraf": "^5.0.5"
  }
}
```

---

## /react.md

```markdown
npm create vite@latest geaux-academy -- --template react
cd geaux-academy
npm install
Now, let's create the component structure:

First, let's set up the folder structure:
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Navigation.jsx
│   ├── home/
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   └── LearningStyles.jsx
│   └── common/
│       ├── Button.jsx
│       └── Card.jsx
├── assets/
├── styles/
├── utils/
└── App.jsx
Let's create the main components:
App.jsx:

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Curriculum from './pages/Curriculum';
import LearningStyles from './pages/LearningStyles';
import Contact from './pages/Contact';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/learning-styles" element={<LearningStyles />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
components/layout/Header.jsx:

import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src="/logo.png" alt="Geaux Academy Logo" />
          </Link>
        </div>
        <Navigation />
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-login">Login</Link>
          <Link to="/signup" className="btn btn-signup">Sign Up</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
components/layout/Navigation.jsx:

import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="main-nav">
      <button className="mobile-menu-toggle" onClick={toggleMenu}>
        <span className="hamburger"></span>
      </button>
      
      <ul className={`nav-links \${isOpen ? 'active' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/features">Features</Link></li>
        <li><Link to="/curriculum">Curriculum</Link></li>
        <li><Link to="/learning-styles">Learning Styles</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
components/home/Hero.jsx:

import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Empowering Personalized Learning for Every Student</h1>
        <p>Discover your unique learning style and unlock your full potential</p>
        <div className="hero-cta">
          <Link to="/assessment" className="btn btn-primary">
            Take a Free Learning Style Assessment
          </Link>
          <Link to="/courses" className="btn btn-secondary">
            Explore Courses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
components/home/Features.jsx:

import Card from '../common/Card';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: "road",
      title: "Personalized Learning Paths",
      description: "Tailored curriculum based on your unique learning style"
    },
    {
      icon: "trophy",
      title: "Gamification Rewards",
      description: "Earn rewards while you learn and stay motivated"
    },
    {
      icon: "chart-line",
      title: "Dynamic Progress Tracking",
      description: "Monitor your growth with real-time analytics"
    }
  ];

  return (
    <section className="features">
      <h2>Why Choose Geaux Academy</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <Card
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
Install necessary dependencies:
npm install react-router-dom @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons styled-components
Create a basic styles file (styles/global.css):
:root {
  --primary-color: #2C3E50;
  --secondary-color: #E74C3C;
  --accent-color: #3498DB;
  --text-color: #333;
  --light-bg: #f8f9fa;
  --white: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
}

.btn {
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--white);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--white);
}
Create a reusable Card component (components/common/Card.jsx):
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Card.css';

const Card = ({ icon, title, description }) => {
  return (
    <div className="card">
      <div className="card-icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Card;


State Management:
npm install @reduxjs/toolkit react-redux
# or
npm install zustand
Example Redux store setup:

[plugin:vite:import-analysis] Failed to resolve import "./pages/Home" from "src/App.jsx". Does the file exist?
/home/wicked/GeauxCrewAI/GeauxCrewAI/geaux-academy/src/App.jsx:4:17
18 |  import Header from "./components/layout/Header";
19 |  import Footer from "./components/layout/Footer";
20 |  import Home from "./pages/Home";
   |                    ^
21 |  import About from "./pages/About";
22 |  import Features from "./pages/Features";
# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
Form Handling with Validation:
npm install react-hook-form yup
// components/forms/AssessmentForm.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

const AssessmentForm = () => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
Testing Setup:
npm install -D vitest @testing-library/react @testing-library/jest-dom
// src/__tests__/Hero.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from '../components/home/Hero';

describe('Hero Component', () => {
  it('renders hero title', () => {
    render(<Hero />);
    expect(screen.getByText(/Empowering Personalized Learning/i)).toBeInTheDocument();
  });
});
Performance Optimization:
// components/ImageOptimized.jsx
import { lazy, Suspense } from 'react';

const ImageOptimized = ({ src, alt, ...props }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        {...props}
      />
    </Suspense>
  );
};
Internationalization:
npm install react-i18next i18next
Analytics Integration:
// utils/analytics.js
export const trackEvent = (eventName, properties) => {
  if (typeof window !== 'undefined') {
    // Google Analytics
    window.gtag('event', eventName, properties);
    
    // Or other analytics services
  }
};
Progressive Web App Setup:
npm install vite-plugin-pwa
These additions will help create a more robust and production-ready application. Would you like me to elaborate on any of these features or provide more specific implementation details?


user avatar
can  you give me everything for .github folder to assist copilot in building this application for my github repository

model avatar
I'll create a comprehensive .github folder structure with workflows, templates, and configurations to help GitHub Copilot better understand and assist with the Geaux Academy project.

First, create the following structure:
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   ├── feature_request.md
│   └── custom.md
├── workflows/
│   ├── ci.yml
│   ├── deploy.yml
│   └── dependency-review.yml
├── CODEOWNERS
├── CONTRIBUTING.md
├── pull_request_template.md
└── dependabot.yml
Bug Report Template (.github/ISSUE_TEMPLATE/bug_report.md):
---
name: Bug Report
about: Create a report to help us improve Geaux Academy
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the Bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g., iOS]
 - Browser: [e.g., chrome, safari]
 - Version: [e.g., 22]
 - Device: [e.g., iPhone 6, desktop]

**Additional Context**
Add any other context about the problem here.
Feature Request Template (.github/ISSUE_TEMPLATE/feature_request.md):
---
name: Feature Request
about: Suggest an idea for Geaux Academy
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
CI Workflow (.github/workflows/ci.yml):
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linting
      run: npm run lint
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build

    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/
Deploy Workflow (.github/workflows/deploy.yml):
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: \${{ secrets.VITE_API_URL }}
        
    - name: Deploy to production
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '\${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '\${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
CODEOWNERS (.github/CODEOWNERS):
# These owners will be the default owners for everything in the repo
*       @project-lead @tech-lead

# Frontend specific files
/src/components/  @frontend-team
/src/styles/      @frontend-team

# Backend specific files
/server/          @backend-team

# Configuration files
/*.config.js      @tech-lead
/*.json           @tech-lead
Contributing Guidelines (.github/CONTRIBUTING.md):
# Contributing to Geaux Academy

## Development Process
1. Fork the repository
2. Create a new branch from `develop`
3. Make your changes
4. Write or update tests
5. Submit a pull request

## Commit Message Format
Use conventional commits format:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test updates
- chore: Build process or auxiliary tool changes

## Pull Request Process
1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md
3. The PR must pass all CI checks
4. Get approval from at least one maintainer

## Code Style
- Follow the ESLint configuration
- Write meaningful component and variable names
- Include JSDoc comments for complex functions
- Write unit tests for new features

## Branch Naming
- feature/description
- bugfix/description
- hotfix/description
- release/version

## Testing
- Write unit tests for new components
- Update existing tests when modifying components
- Ensure all tests pass before submitting PR
Pull Request Template (.github/pull_request_template.md):
## Description
Please include a summary of the change and which issue is fixed.

Fixes # (issue)

## Type of change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Please describe the tests that you ran to verify your changes.

## Checklist:
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
Dependabot Configuration (.github/dependabot.yml):
version: 2
updates:
  # Maintain dependencies for npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    target-branch: "develop"
    labels:
      - "dependencies"
      - "automerge"
    commit-message:
      prefix: "chore"
      include: "scope"
    
  # Maintain dependencies for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "automerge"
Security Policy (.github/SECURITY.md):
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within Geaux Academy, please send an email to security@geauxacademy.com. All security vulnerabilities will be promptly addressed.

Please include:
- Type of issue
-

user avatar
Conti

model avatar
Continuing with the Security Policy and additional GitHub configurations:

Security Policy (.github/SECURITY.md) continued:
# Security Policy (continued)

## Reporting a Vulnerability

Please include:
- Type of issue
- Full paths of source file(s) related to the issue
- Location of the affected source code
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Security Update Process

1. The security team will acknowledge receipt of your vulnerability report within 48 hours
2. We will confirm the vulnerability and determine its impact
3. We will release a patch as soon as possible depending on complexity

## Security Best Practices for Contributors

1. Never commit sensitive credentials
2. Use environment variables for configuration
3. Keep dependencies updated
4. Follow secure coding guidelines
5. Implement proper input validation
6. Use proper authentication and authorization
Labels Configuration (.github/labels.yml):
- name: "bug"
  color: "d73a4a"
  description: "Something isn't working"

- name: "documentation"
  color: "0075ca"
  description: "Improvements or additions to documentation"

- name: "enhancement"
  color: "a2eeef"
  description: "New feature or request"

- name: "good first issue"
  color: "7057ff"
  description: "Good for newcomers"

- name: "help wanted"
  color: "008672"
  description: "Extra attention is needed"

- name: "priority: high"
  color: "d93f0b"
  description: "Needs immediate attention"

- name: "priority: low"
  color: "0e8a16"
  description: "Can wait for later"

- name: "testing"
  color: "fbca04"
  description: "Related to testing"

- name: "frontend"
  color: "1d76db"
  description: "Related to frontend"

- name: "backend"
  color: "0052cc"
  description: "Related to backend"
Issue Template Config (.github/ISSUE_TEMPLATE/config.yml):
blank_issues_enabled: false
contact_links:
  - name: Geaux Academy Support
    url: https://geauxacademy.com/support
    about: Please visit our support page for immediate assistance
  - name: Documentation
    url: https://docs.geauxacademy.com
    about: Check our documentation for answers to common questions
  - name: Community Forum
    url: https://community.geauxacademy.com
    about: Discuss with the community about features and issues
Stale Bot Configuration (.github/stale.yml):
# Configuration for probot-stale - https://github.com/probot/stale

# Number of days of inactivity before an Issue or Pull Request becomes stale
daysUntilStale: 60

# Number of days of inactivity before an Issue or Pull Request with the stale label is closed
daysUntilClose: 7

# Issues or Pull Requests with these labels will never be considered stale
exemptLabels:
  - pinned
  - security
  - "priority: high"

# Label to use when marking as stale
staleLabel: stale

# Comment to post when marking as stale
markComment: >
  This issue has been automatically marked as stale because it has not had
  recent activity. It will be closed if no further activity occurs. Thank you
  for your contributions.

# Comment to post when closing a stale Issue or Pull Request
closeComment: >
  This issue has been automatically closed due to inactivity. Please feel free
  to reopen it if the issue still exists.

# Limit the number of actions per hour, from 1-30. Default is 30
limitPerRun: 30
Release Workflow (.github/workflows/release.yml):
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Generate changelog
        id: changelog
        uses: actions/github-script@v6
        with:
          script: |
            const { data: releases } = await github.rest.repos.listReleases({
              owner: context.repo.owner,
              repo: context.repo.repo,
            });
            
            const lastRelease = releases[0];
            const commitsSinceRelease = await github.rest.repos.compareCommits({
              owner: context.repo.owner,
              repo: context.repo.repo,
              base: lastRelease.tag_name,
              head: context.sha,
            });
            
            return commitsSinceRelease.data.commits
              .map(commit => `- \${commit.commit.message}`)
              .join('\n');

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: \${{ github.ref }}
          release_name: Release \${{ github.ref }}
          body: |
            Changes in this Release:
            \${{ steps.changelog.outputs.result }}
          draft: false
          prerelease: false
Environment Configuration (.github/environments.yml):
development:
  protection_rules:
    - type: required_reviewers
      reviewers: []
    - type: wait_timer
      wait_time: 0

staging:
  protection_rules:
    - type: required_reviewers
      reviewers: ["tech-lead"]
    - type: wait_timer
      wait_time: 10

production:
  protection_rules:
    - type: required_reviewers
      reviewers: ["tech-lead", "project-lead"]
    - type: wait_timer
      wait_time: 60
These configurations will help GitHub Copilot understand:

Project structure and conventions
Code review requirements
Security policies
Testing requirements
Deployment processes
Issue and PR templates
Automated workflows
Release management
Environment configurations
Would you like me to provide any additional configurations or explain any of these in more detail?


user avatar
can you complete  the pages i need  pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Features.jsx
│   ├── Curriculum.jsx
│   ├── LearningStyles.jsx
│   └── Contact.jsx

model avatar
I'll create all the necessary page components with proper structure and styling.

First, create a pages directory and add these files:
pages/Home.jsx:

import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import LearningStyles from '../components/home/LearningStyles';
import CallToAction from '../components/home/CallToAction';
import Testimonials from '../components/home/Testimonials';
import styled from 'styled-components';

const Home = () => {
  return (
    <HomeContainer>
      <Hero />
      <Features />
      <LearningStyles />
      <Testimonials />
      <CallToAction />
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export default Home;
pages/About.jsx:

import { motion } from 'framer-motion';
import styled from 'styled-components';

const About = () => {
  return (
    <AboutContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderSection>
          <h1>About Geaux Academy</h1>
          <p>Empowering students through personalized learning experiences</p>
        </HeaderSection>

        <MissionSection>
          <h2>Our Mission</h2>
          <p>
            At Geaux Academy, we believe every student deserves an education
            tailored to their unique learning style. Our mission is to provide
            innovative, personalized learning solutions that help students reach
            their full potential.
          </p>
        </MissionSection>

        <TeamSection>
          <h2>Our Team</h2>
          <TeamGrid>
            {teamMembers.map((member) => (
              <TeamMember key={member.id}>
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </TeamMember>
            ))}
          </TeamGrid>
        </TeamSection>

        <ValuesSection>
          <h2>Our Values</h2>
          <ValuesList>
            <ValueItem>
              <h3>Innovation</h3>
              <p>Constantly evolving our methods to provide the best learning experience</p>
            </ValueItem>
            <ValueItem>
              <h3>Personalization</h3>
              <p>Tailoring education to individual learning styles</p>
            </ValueItem>
            <ValueItem>
              <h3>Excellence</h3>
              <p>Maintaining high standards in education delivery</p>
            </ValueItem>
          </ValuesList>
        </ValuesSection>
      </motion.div>
    </AboutContainer>
  );
};

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeaderSection = styled.section`
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-color);
  }
`;

// Add remaining styled components...

export default About;
pages/Features.jsx:

import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      id: 1,
      title: 'Personalized Learning Paths',
      description: 'Custom-tailored learning experiences based on individual learning styles',
      icon: '�',
      details: [
        'VARK learning style assessment',
        'Adaptive curriculum',
        'Progress tracking',
        'Personalized recommendations'
      ]
    },
    {
      id: 2,
      title: 'Interactive Learning Tools',
      description: 'Engaging tools and resources for enhanced learning',
      icon: '�',
      details: [
        'Virtual labs',
        'Interactive simulations',
        'Real-time feedback',
        'Collaborative tools'
      ]
    },
    // Add more features...
  ];

  return (
    <FeaturesContainer>
      <Header>
        <h1>Platform Features</h1>
        <p>Discover how Geaux Academy transforms learning</p>
      </Header>

      <FeatureGrid>
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            onClick={() => setSelectedFeature(feature)}
            as={motion.div}
            whileHover={{ scale: 1.05 }}
          >
            <IconWrapper>{feature.icon}</IconWrapper>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </FeatureCard>
        ))}
      </FeatureGrid>

      <AnimatePresence>
        {selectedFeature && (
          <FeatureModal
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent>
              <CloseButton onClick={() => setSelectedFeature(null)}>×</CloseButton>
              <h2>{selectedFeature.title}</h2>
              <ul>
                {selectedFeature.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </ModalContent>
          </FeatureModal>
        )}
      </AnimatePresence>
    </FeaturesContainer>
  );
};

// Styled components...

export default Features;
pages/Curriculum.jsx:

import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Curriculum = () => {
  const [selectedGrade, setSelectedGrade] = useState('elementary');

  const curriculumData = {
    elementary: {
      subjects: ['Math', 'Science', 'English', 'Social Studies'],
      features: ['Interactive Games', 'Visual Learning', 'Basic Concepts']
    },
    middle: {
      subjects: ['Advanced Math', 'Life Science', 'Literature', 'World History'],
      features: ['Project-Based Learning', 'Group Activities', 'Critical Thinking']
    },
    high: {
      subjects: ['Algebra', 'Biology', 'Composition', 'Economics'],
      features: ['Advanced Concepts', 'Research Projects', 'College Prep']
    }
  };

  return (
    <CurriculumContainer>
      <Header>
        <h1>Curriculum Overview</h1>
        <p>Comprehensive learning paths for every grade level</p>
      </Header>

      <GradeSelector>
        {Object.keys(curriculumData).map((grade) => (
          <GradeButton
            key={grade}
            selected={selectedGrade === grade}
            onClick={() => setSelectedGrade(grade)}
          >
            {grade.charAt(0).toUpperCase() + grade.slice(1)}
          </GradeButton>
        ))}
      </GradeSelector>

      <CurriculumContent
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Subjects

user avatar
cont

model avatar
Continuing with the pages:

pages/Curriculum.jsx (continued):

const Curriculum = () => {
  // ... previous code ...

  return (
    <CurriculumContainer>
      {/* ... previous code ... */}

      <CurriculumContent
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Subjects>
          <h2>Subjects</h2>
          <SubjectGrid>
            {curriculumData[selectedGrade].subjects.map((subject, index) => (
              <SubjectCard key={index}>
                <h3>{subject}</h3>
                <ViewButton>View Details</ViewButton>
              </SubjectCard>
            ))}
          </SubjectGrid>
        </Subjects>

        <Features>
          <h2>Grade-Level Features</h2>
          <FeatureList>
            {curriculumData[selectedGrade].features.map((feature, index) => (
              <FeatureItem key={index}>{feature}</FeatureItem>
            ))}
          </FeatureList>
        </Features>
      </CurriculumContent>
    </CurriculumContainer>
  );
};

const CurriculumContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-color);
  }
`;

// ... add remaining styled components

export default Curriculum;
pages/LearningStyles.jsx:

import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LearningStyles = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "When learning a new skill, I prefer to:",
      options: [
        { id: 'a', text: "Watch a video demonstration", type: "visual" },
        { id: 'b', text: "Listen to verbal instructions", type: "auditory" },
        { id: 'c', text: "Read written instructions", type: "reading" },
        { id: 'd', text: "Try it hands-on", type: "kinesthetic" }
      ]
    },
    // Add more questions...
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <StylesContainer>
      <Header>
        <h1>Discover Your Learning Style</h1>
        <p>Take our assessment to find your optimal learning approach</p>
      </Header>

      <AssessmentSection>
        <Progress>
          Question {currentStep} of {questions.length}
        </Progress>

        <QuestionCard
          as={motion.div}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>{questions[currentStep - 1].text}</h2>
          <OptionsGrid>
            {questions[currentStep - 1].options.map((option) => (
              <OptionButton
                key={option.id}
                onClick={() => handleAnswer(currentStep, option.type)}
              >
                {option.text}
              </OptionButton>
            ))}
          </OptionsGrid>
        </QuestionCard>
      </AssessmentSection>
    </StylesContainer>
  );
};

const StylesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

// ... add remaining styled components

export default LearningStyles;
pages/Contact.jsx:

import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Add your form submission logic here
      console.log('Form data:', data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <ContactContainer>
      <Header>
        <h1>Contact Us</h1>
        <p>Get in touch with our support team</p>
      </Header>

      <ContactSection>
        <ContactInfo>
          <InfoItem>
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Address</h3>
              <p>123 Education Street<br />Baton Rouge, LA 70803</p>
            </div>
          </InfoItem>
          <InfoItem>
            <i className="fas fa-phone"></i>
            <div>
              <h3>Phone</h3>
              <p>(225) 555-0123</p>
            </div>
          </InfoItem>
          <InfoItem>
            <i className="fas fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p>support@geauxacademy.com</p>
            </div>
          </InfoItem>
        </ContactInfo>

        <ContactForm onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <label>Name</label>
            <input 
              {...register("name", { required: "Name is required" })}
              placeholder="Your name"
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <label>Email</label>
            <input 
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\$/i,
                  message: "Invalid email address"
                }
              })}
              placeholder="Your email"
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <label>Message</label>
            <textarea 
              {...register("message", { required: "Message is required" })}
              placeholder="Your message"
              rows="5"
            />
            {errors.message && <ErrorMessage>{errors.message.message}</ErrorMessage>}
          </FormGroup>

          <SubmitButton type="submit">Send Message</SubmitButton>
        </ContactForm>
      </ContactSection>

      {isSubmitted && (
        <ThankYouMessage
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Thank you for your message! We'll get back to you soon.
        </ThankYouMessage>
      )}
    </ContactContainer>
  );
};

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

user avatar
cont

model avatar
Continuing with the Contact.jsx styling and completing the remaining pages:

pages/Contact.jsx (continued):

// ... previous Contact component code ...

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-color);
  }
`;

const ContactSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  background-color: var(--light-bg);
  padding: 2rem;
  border-radius: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;

  i {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-right: 1rem;
    width: 24px;
  }

  h3 {
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 600;
  }

  input, textarea {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

const ThankYouMessage = styled(motion.div)`
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
`;

export default Contact;
Now, let's add some shared components that will be used across all pages:

components/shared/PageHeader.jsx:

import styled from 'styled-components';

const PageHeader = ({ title, subtitle }) => {
  return (
    <HeaderContainer>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-color);
  }
`;

export default PageHeader;
components/shared/LoadingSpinner.jsx:

import styled, { keyframes } from 'styled-components';

const LoadingSpinner = () => {
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: \${spin} 1s linear infinite;
`;

export default LoadingSpinner;
components/shared/ErrorBoundary.jsx:

import React from 'react';
import styled from 'styled-components';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <h2>Oops! Something went wrong.</h2>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;

  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: var(--secondary-color);
    }
  }
`;

export default ErrorBoundary;
Finally, to ensure proper routing and page transitions, update your App.jsx:

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Curriculum from './pages/Curriculum';
import LearningStyles from './pages/LearningStyles';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Header />
        <AnimatePresence mode='wait'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/learning-styles" element={<LearningStyles />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </ErrorBoundary>

user avatar
cont

model avatar
Continuing with the App.jsx and adding the remaining necessary configurations:

// App.jsx continued...

import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';

const theme = {
  colors: {
    primary: '#2C3E50',
    secondary: '#E74C3C',
    accent: '#3498DB',
    background: '#FFFFFF',
    text: '#333333',
    lightBg: '#F8F9FA',
    error: '#E74C3C',
    success: '#2ECC71',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1200px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <ErrorBoundary>
          <Header />
          <AnimatePresence mode='wait'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/learning-styles" element={<LearningStyles />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;
Now, let's add the GlobalStyle:

// styles/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: \${props => props.theme.colors.primary};
    --secondary-color: \${props => props.theme.colors.secondary};
    --accent-color: \${props => props.theme.colors.accent};
    --background: \${props => props.theme.colors.background};
    --text-color: \${props => props.theme.colors.text};
    --light-bg: \${props => props.theme.colors.lightBg};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background);
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--secondary-color);
    }
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 \${props => props.theme.spacing.md};
  }

  .section {
    padding: \${props => props.theme.spacing.xl} 0;
  }

  @media (max-width: \${props => props.theme.breakpoints.tablet}) {
    html {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle;
Let's also add a utility for animations that can be used across components:

// utils/animations.js
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};
And a hooks directory for custom hooks:

// hooks/useScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

// hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};
Finally, let's add a constants file for shared data:

// utils/constants.js
export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/features', label: 'Features' },
  { path: '/curriculum', label: 'Curriculum' },
  { path: '/learning-styles', label: 'Learning Styles' },
  { path: '/contact', label: 'Contact' },
];

export const SOCIAL_LINKS = [
  { platform: 'Facebook', url: 'https://facebook.com/geauxacademy' },
  { platform: 'Twitter', url: 'https://twitter.com/geauxacademy' },
  { platform: 'Instagram', url: 'https://instagram.com/geauxacademy' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/company/geauxacademy' },
];

export const LEARNING_STYLES = {
  visual: {
    title: 'Visual Learner',
    description: 'You learn best through seeing and observing',
    tips: [
      'Use diagrams and charts',
      'Watch video tutorials',
      'Create mind maps',
    ],
  },
  auditory: {
    title: 'Auditory Learner',
    description: 'You learn best through listening and speaking',
    tips: [
      'Listen to lectures',
      'Participate in group discussions',
      'Use audio recordings',
    ],
  },
  reading: {
    title: 'Reading/Writing Learner',
    description: 'You learn best through written words',
    tips: [
      'Take detailed notes',
      'Read textbooks and articles',
      'Write summaries',
    ],
  },
  kinesthetic: {
    title: 'Kinesthetic Learner',
    description: 'You learn best through doing and experiencing',
    tips: [
      'Hands-on activities',
      'Physical movement while studying',
      'Practice exercises',
    ],
  },

user avatar
cont

model avatar
Continuing with the remaining configurations and utilities:

// utils/constants.js (continued)
  // More constants...
  GRADE_LEVELS: {
    elementary: {
      name: 'Elementary School',
      grades: ['K', '1st', '2nd', '3rd', '4th', '5th'],
      features: [
        'Interactive Learning Games',
        'Basic Skills Development',
        'Foundational Knowledge',
        'Parent-Teacher Communication',
      ],
    },
    middle: {
      name: 'Middle School',
      grades: ['6th', '7th', '8th'],
      features: [
        'Project-Based Learning',
        'Critical Thinking Development',
        'Subject Specialization',
        'Study Skills Building',
      ],
    },
    high: {
      name: 'High School',
      grades: ['9th', '10th', '11th', '12th'],
      features: [
        'Advanced Placement Courses',
        'College Preparation',
        'Career Guidance',
        'Standardized Test Prep',
      ],
    },
  },

  SUBJECTS: {
    math: {
      name: 'Mathematics',
      topics: ['Algebra', 'Geometry', 'Statistics', 'Calculus'],
      icon: '�',
    },
    science: {
      name: 'Science',
      topics: ['Biology', 'Chemistry', 'Physics', 'Environmental Science'],
      icon: '�',
    },
    english: {
      name: 'English Language Arts',
      topics: ['Literature', 'Writing', 'Grammar', 'Comprehension'],
      icon: '�',
    },
    history: {
      name: 'Social Studies',
      topics: ['World History', 'U.S. History', 'Geography', 'Civics'],
      icon: '�',
    },
  },
};
Let's add some utility functions:

// utils/helpers.js
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const calculateProgress = (completed, total) => {
  return Math.round((completed / total) * 100);
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-\$)+/g, '');
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+\$/.test(email);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
Add a service for API calls:

// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer \${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
};

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updatePreferences: (preferences) => api.put('/user/preferences', preferences),
};

export const learningService = {
  getAssessment: () => api.get('/learning/assessment'),
  submitAssessment: (answers) => api.post('/learning/assessment', answers),
  getLearningPath: () => api.get('/learning/path'),
  updateProgress: (progressData) => api.post('/learning/progress', progressData),
};

export const courseService = {
  getCourses: (filters) => api.get('/courses', { params: filters }),
  getCourseDetails: (courseId) => api.get(`/courses/\${courseId}`),
  enrollCourse: (courseId) => api.post(`/courses/\${courseId}/enroll`),
  getProgress: (courseId) => api.get(`/courses/\${courseId}/progress`),
};
Add context for managing global state:

// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authService.getProfile();
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
Add a context for managing learning styles:

// context/LearningStyleContext.jsx
import { createContext, useContext, useState } from 'react';
import { learningService } from '../services/api';

const LearningStyleContext = createContext({});

export const LearningStyleProvider = ({ children }) => {
  const [learningStyle, setLearningStyle] = useState(null);
  const [assessmentProgress, setAssessmentProgress] = useState(0);

  const startAssessment = async () => {
    try {
      const response = await learningService.getAssessment();
      return response.data;
    } catch (error) {
      console.error('Failed to start assessment:', error);
      throw error;
    }
  };

  const submitAssessment = async (answers) => {
    try {
      const response = await learningService.submitAssessment(answers);
      setLearningStyle(response.data.style);
      return response.data;
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      throw error;
    }
  };

  return (
    <LearningStyleContext.

user avatar
cont


model avatar
Continuing with the LearningStyleContext and adding more necessary configurations:

// context/LearningStyleContext.jsx (continued)
    <LearningStyleContext.Provider 
      value={{ 
        learningStyle, 
        assessmentProgress, 
        startAssessment, 
        submitAssessment,
        setAssessmentProgress 
      }}
    >
      {children}
    </LearningStyleContext.Provider>
  );
};

export const useLearningStyle = () => useContext(LearningStyleContext);
Add a context for managing the curriculum:

// context/CurriculumContext.jsx
import { createContext, useContext, useState } from 'react';
import { courseService } from '../services/api';

const CurriculumContext = createContext({});

export const CurriculumProvider = ({ children }) => {
  const [currentCourse, setCurrentCourse] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(false);

  const loadCourse = async (courseId) => {
    setLoading(true);
    try {
      const response = await courseService.getCourseDetails(courseId);
      setCurrentCourse(response.data);
      const progressResponse = await courseService.getProgress(courseId);
      setUserProgress(progressResponse.data);
    } catch (error) {
      console.error('Failed to load course:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (courseId, progressData) => {
    try {
      const response = await courseService.updateProgress(courseId, progressData);
      setUserProgress(prev => ({
        ...prev,
        [courseId]: response.data
      }));
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  };

  return (
    <CurriculumContext.Provider 
      value={{ 
        currentCourse,
        userProgress,
        loading,
        loadCourse,
        updateProgress
      }}
    >
      {children}
    </CurriculumContext.Provider>
  );
};

export const useCurriculum = () => useContext(CurriculumContext);
Add error handling utilities:

// utils/errorHandling.js
export class AppError extends Error {
  constructor(message, status = 'error', code = 500) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return new AppError(
      error.response.data.message || 'Server error',
      'error',
      error.response.status
    );
  } else if (error.request) {
    // Request made but no response
    return new AppError('Network error', 'error', 503);
  } else {
    // Error setting up request
    return new AppError('Application error', 'error', 500);
  }
};

export const errorMessages = {
  network: 'Unable to connect to the server. Please check your internet connection.',
  auth: 'Authentication failed. Please log in again.',
  validation: 'Please check your input and try again.',
  server: 'Something went wrong on our end. Please try again later.',
  notFound: 'The requested resource was not found.',
  permission: 'You do not have permission to perform this action.',
};
Add a provider component to combine all contexts:

// providers/AppProvider.jsx
import { AuthProvider } from '../context/AuthContext';
import { LearningStyleProvider } from '../context/LearningStyleContext';
import { CurriculumProvider } from '../context/CurriculumContext';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';

const AppProvider = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <LearningStyleProvider>
          <CurriculumProvider>
            {children}
          </CurriculumProvider>
        </LearningStyleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
Add configuration for environment variables:

// config/config.js
const config = {
  development: {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    debug: true,
    analyticsEnabled: false,
  },
  production: {
    apiUrl: import.meta.env.VITE_API_URL,
    debug: false,
    analyticsEnabled: true,
  },
  test: {
    apiUrl: 'http://localhost:3000/api',
    debug: true,
    analyticsEnabled: false,
  },
};

const environment = import.meta.env.MODE || 'development';

export default config[environment];
Update the main index file:

// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppProvider from './providers/AppProvider';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  registerSW();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
Finally, update the App component to use all providers and handle loading states:

// App.jsx
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/shared/LoadingSpinner';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { useScrollToTop } from './hooks/useScrollToTop';
import GlobalStyle from './styles/GlobalStyle';

function App() {
  const { loading } = useAuth();
  useScrollToTop();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <GlobalStyle />
      <Router>
        <Header />
        <AnimatePresence mode='wait'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/learning-styles" element={<LearningStyles />} />
            <Route path="/contact" element={<Contact />} />
            {/* Add more routes as needed */}
          </Routes>
        </AnimatePresence>
        <Footer />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
```

---

## /remoteconfig.template.json

```json
{}
```

---

## /repository_content.md

```markdown
qwq
```

---

## /theme.js

```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
    },
  },
});

export default theme;
```

---

## /tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/config/*": ["src/config/*"]
    },
    "types": ["node", "jest"],
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## /tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "allowJs": true,
    "types": ["node", "vite/client"],
    "target": "es2017",
    "outDir": "dist",
    "strict": true
  },
  "include": [
    "src",
    "scripts",
    "vite.config.ts",
    "vite.config.js"
  ],
  "exclude": [
    "vite.config.js",
    "dist/**/*",
    "public",
    "src/**/*.js",
    "*.js",
    "functions/**/*.js",
    "dataconnect-generated/**/*.js",
    "node_modules"
  ]
}
```

---

## /vite.config.js

```javascript
import fs from 'fs';
import { resolve } from 'path';
import path from "path";

import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Get SSL certificates for local development
const getHttpsConfig = () => {
  const certPath = path.join(process.cwd(), 'certificates');
  
  // Only use HTTPS in development
  if (process.env.NODE_ENV === 'development') {
    try {
      return {
        key: fs.readFileSync(path.join(certPath, 'localhost-key.pem')),
        cert: fs.readFileSync(path.join(certPath, 'localhost.pem'))
      };
    } catch (e) {
      console.warn('No SSL certificates found. Run `npm run generate-certs` to create them.');
      return false;
    }
  }
  return false;
};

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
      // Enable React Router v7 future flags
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }
    }),
    vue()
  ],
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'firebase-messaging-sw': resolve(__dirname, 'public/firebase-messaging-sw.js')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          'firebase-app': ['firebase/app'],
          'firebase-auth': ['firebase/auth'],
          'firebase-firestore': ['firebase/firestore']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        'src/test/setup.ts'
      ]
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    https: false, // <--- This enables HTTPS if certs exist
    host: 'localhost',
    cors: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseio.com https://*.firebase.com https://*.googleapis.com https://*.gstatic.com https://www.googletagmanager.com;
  connect-src 'self' http://localhost:5173 ws://localhost:5173 https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com https://*.googleapis.com https://firestore.googleapis.com wss://firestore.googleapis.com;
        frame-src 'self' https://*.firebaseapp.com https://*.firebase.com https://accounts.google.com https://*.googleapis.com;
        img-src 'self' data: https: blob:;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        worker-src 'self' blob: 'unsafe-inline';
      `.replace(/\s+/g, ' '),
    },
    proxy: {
      '/api': {
        target: process.env.VITE_AZURE_ENDPOINT,
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/auth': {
        target: process.env.VITE_CHESHIRE_API_URL || 'https://cheshire.geaux.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/auth/, '/auth'),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Proxying request:', req.method, req.url);
            proxyReq.setHeader('Cookie', 'Global=Auth');
          });
        }
      },
      '/message': {
        target: process.env.VITE_CHESHIRE_API_URL || 'https://cheshire.geaux.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/message/, '/message'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Cookie', 'Global=Auth');
          });
        }
      },
      '/__/auth/*': {
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    },
    hmr: {
  protocol: 'ws',
      host: 'localhost',
  port: 5173,
  clientPort: 5173,
      timeout: 120000
    },
    watch: {
      usePolling: true
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  define: {
    __VITE_FIREBASE_API_KEY__: `"${process.env.VITE_FIREBASE_API_KEY}"`,
    __VITE_FIREBASE_AUTH_DOMAIN__: `"${process.env.VITE_FIREBASE_AUTH_DOMAIN}"`,
    __VITE_FIREBASE_PROJECT_ID__: `"${process.env.VITE_FIREBASE_PROJECT_ID}"`,
    __VITE_FIREBASE_STORAGE_BUCKET__: `"${process.env.VITE_FIREBASE_STORAGE_BUCKET}"`,
    __VITE_FIREBASE_MESSAGING_SENDER_ID__: `"${process.env.VITE_FIREBASE_MESSAGING_SENDER_ID}"`,
    __VITE_FIREBASE_APP_ID__: `"${process.env.VITE_FIREBASE_APP_ID}"`,
    __VITE_FIREBASE_MEASUREMENT_ID__: `"${process.env.VITE_FIREBASE_MEASUREMENT_ID}"`,
    __VITE_FIREBASE_DATABASE_URL__: `"${process.env.VITE_FIREBASE_DATABASE_URL}"`,
    // Enable React Router v7 future flags
    'process.env.ROUTER_FUTURE_FLAGS': JSON.stringify({
      v7_startTransition: true,
      v7_relativeSplatPath: true
    })
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth']
  }
});
```

---

## /.vscode/settings.json

```json
{
    "github.copilot.chat.followUps": "always",
    "github.copilot.chat.scopeSelection": true,
    "github.copilot.chat.edits.codesearch.enabled": true,
    "github.copilot.nextEditSuggestions.enabled": true,
    "github.copilot.chat.completionContext.typescript.mode": "on",
    "github.copilot.chat.editor.temporalContext.enabled": true,
    "github.copilot.chat.enableUserPreferences": true,
    "github.copilot.chat.generateTests.codeLens": true,
    "github.copilot.chat.languageContext.typescript.enabled": true,
    "github.copilot.chat.search.semanticTextResults": true,
    "files.autoSave": "afterDelay",
    "editor.wordWrap": "on",
    "github.copilot.chat.codeGeneration.useInstructionFiles": true,
    "github.copilot.chat.edits.temporalContext.enabled": true,

    "github.copilot.chat.testGeneration.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.test.tsx",
            "instructions": "Generate unit tests using Jest & React Testing Library. Cover both success and failure cases. Use Mock Service Worker (MSW) for API mocking."
        },
        {
            "file": "",
            "filePattern": "backend/tests/**/*.py",
            "instructions": "Use FastAPI TestClient and Pytest for backend tests. Ensure JWT authentication and RBAC security tests are included."
        },
        {
            "file": "",
            "filePattern": "src/pages/**/*.test.tsx",
            "instructions": "For integration tests, use Cypress with end-to-end scenarios covering user authentication, navigation, and API calls."
        }
    ],

    "github.copilot.chat.commitMessageGeneration.instructions": [
        {
            "file": "",
            "filePattern": "*",
            "instructions": "Format commit messages using Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`. Provide a short, clear summary in the present tense."
        }
    ],

    "github.copilot.chat.reviewSelection.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.tsx",
            "instructions": "Ensure TypeScript compliance, proper prop typing, and React best practices. Avoid inline styles; prefer Styled Components or Tailwind CSS."
        },
        {
            "file": "",
            "filePattern": "backend/**/*.py",
            "instructions": "Ensure FastAPI routes use Pydantic models for validation, JWT authentication, and RBAC. Implement proper error handling and response models."
        },
        {
            "file": "",
            "filePattern": ".github/workflows/*.yml",
            "instructions": "Validate CI/CD pipeline integrity. Ensure workflows include ESLint, Jest, Cypress, and dependency security scans."
        }
    ],

    "github.copilot.chat.codeReview.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.tsx",
            "instructions": "Check for performance optimizations, React hooks best practices, and clean code formatting. Ensure absolute imports are used."
        },
        {
            "file": "",
            "filePattern": "backend/**/*.py",
            "instructions": "Validate API endpoint security, response models, and authentication handling. Ensure database queries use ORM best practices."
        },
        {
            "file": "",
            "filePattern": "firestore.rules",
            "instructions": "Ensure Firestore security rules enforce RBAC. No public read/write access unless explicitly required."
        }
    ],
    "github-actions.workflows.pinned.workflows": []
}
```

---

## /.github/.eslintrc.js

```javascript
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module"
    },
    plugins: [
        "react",
        "@typescript-eslint",
        "react-hooks"
    ],
    rules: {
        "constructor-super": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": "error",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/react-in-jsx-scope": "off"
    },
                                                                                    settings: {
        react: {
            version: "detect"
        }
    }
};
```

---

## /.github/CODEOWNERS

```plaintext
# This file specifies the code owners for different parts of the project

# Default code owners for the entire repository
*       @default-owner

# Specific code owners for frontend components
/src/components/ @frontend-owner

# Specific code owners for backend components
/backend/ @backend-owner

# Specific code owners for documentation
/docs/ @docs-owner

# Specific code owners for GitHub Actions workflows
/.github/workflows/ @ci-cd-owner
```

---

## /.github/CONTRIBUTING.md

```markdown
# Contributing to Geaux Academy

Thank you for considering contributing to Geaux Academy! We welcome contributions from the community and are grateful for your support.

## How to Contribute

### Reporting Bugs

If you find a bug, please report it by creating a new issue in the [issue tracker](https://github.com/GeauxAcademy/GA-MVP/issues). Please include as much detail as possible, including steps to reproduce the bug, the expected behavior, and any relevant screenshots or logs.

### Suggesting Features

If you have an idea for a new feature, please create a new issue in the [issue tracker](https://github.com/GeauxAcademy/GA-MVP/issues) and describe your idea in detail. Please include any relevant use cases or examples to help us understand the value of the feature.

### Submitting Pull Requests

1. **Fork the repository**: Click the "Fork" button at the top right corner of the repository page to create a copy of the repository in your GitHub account.
2. **Clone the repository**: Clone your forked repository to your local machine using the following command:
   ```bash
   git clone https://github.com/your-username/GA-MVP.git
   ```
3. **Create a new branch**: Create a new branch for your changes using the following command:
   ```bash
   git checkout -b my-feature-branch
   ```
4. **Make your changes**: Make your changes to the codebase. Please follow the [coding standards](./DEVELOPMENT_GUIDE.md#coding-standards) and [testing strategy](./DEVELOPMENT_GUIDE.md#testing-strategy) outlined in the development guide.
5. **Commit your changes**: Commit your changes using the following command:
   ```bash
   git commit -m "Description of your changes"
   ```
6. **Push your changes**: Push your changes to your forked repository using the following command:
   ```bash
   git push origin my-feature-branch
   ```
7. **Create a pull request**: Create a pull request from your forked repository to the main repository. Please include a detailed description of your changes and any relevant screenshots or logs.

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

### License

By contributing to Geaux Academy, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

Thank you for your contributions!
```

---

## /.github/COPILOT.md

```markdown
# GitHub Copilot Guide for Geaux Academy

## File Organization

All files should be referenced with their complete paths:

```plaintext
/src/
├── components/                    # /src/components/* - Reusable components
│   ├── auth/                     # /src/components/auth/* - Authentication components
│   │   ├── LoginForm.tsx
│   │   └── SignUpForm.tsx
│   ├── common/                   # /src/components/common/* - Shared UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.styles.ts
│   │   └── Card/
│   │       ├── Card.tsx
│   │       └── Card.styles.ts
│   ├── layout/                   # /src/components/layout/* - Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Navigation/
│   │   └── Sidebar/
│   └── features/                 # /src/components/features/* - Feature-specific components
│       ├── home/
│       ├── profile/
│       └── dashboard/
├── pages/                        # /src/pages/* - Page components
│   ├── Home/
│   │   ├── index.tsx
│   │   └── Home.styles.ts
│   └── Dashboard/
│       ├── index.tsx
│       └── Dashboard.styles.ts
├── hooks/                        # /src/hooks/* - Custom React hooks
│   └── useAuth.ts
├── services/                     # /src/services/* - API and external services
│   ├── api/
│   │   └── index.ts
│   └── firebase/
│       └── config.ts
├── store/                        # /src/store/* - State management
│   ├── slices/
│   └── index.ts
├── types/                        # /src/types/* - TypeScript types/interfaces
│   └── index.ts
├── utils/                        # /src/utils/* - Utility functions
│   └── helpers.ts
├── styles/                       # /src/styles/* - Global styles
│   ├── theme.ts
│   └── global.ts
└── config/                       # /src/config/* - Configuration files
    └── env.ts
```

## Styling Convention

The application uses styled-components exclusively for styling. No separate CSS files are needed as all styles are encapsulated within their respective components.

```jsx
// Good
import styled from 'styled-components';

const StyledComponent = styled.div`
  // Component styles here
`;

// Bad
import './styles.css';
```

## File Path Convention

When working with files, always reference the complete path from the project root. For example:

```jsx
// Good
// filepath: /src/components/layout/Header.tsx
import React from 'react';

// Bad
// Header.tsx
import React from 'react';
```

## Component Structure

Each component should be organized as follows:

```jsx
// filepath: /src/components/Example.tsx
import React from 'react';
import styled from 'styled-components';

// Component definition
const Example = () => {
  // ...
};

// Styled components
const StyledExample = styled.div`
  // ...
`;

export default Example;
```

## Style Organization

Styles should be organized using styled-components following this pattern:

```jsx
// filepath: /src/components/StyledComponent.tsx
import styled from 'styled-components';

const StyledComponent = styled.div`
  // Base styles
  
  // Modifiers
  ${props => props.variant && `
    // Variant styles
  `}
  
  // Media queries
  @media (max-width: 768px) {
    // Responsive styles
  }
`;
```

## Testing Files

Test files should be placed next to their components with the following convention:

```jsx
// filepath: /src/components/Component.test.tsx
import { render } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  // ...
});
```

## GitHub Copilot Instructions

When working with GitHub Copilot, always:

1. Start files with the complete filepath comment
2. Use consistent naming conventions
3. Include type definitions where applicable
4. Document complex functions and components
5. Use proper imports with absolute paths from src/

Example usage:

```jsx
// filepath: /src/components/NewFeature.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * NewFeature component description
 * @param {Object} props - Component props
 * @param {string} props.title - Feature title
 */
const NewFeature = ({ title }) => {
  // Component implementation
};

export default NewFeature;
```

---

## /.github/SECURITY.md

```markdown
# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please follow the steps below to report it:

1. **Do not disclose the vulnerability publicly.** Instead, report it directly to the project maintainers.
2. **Send an email to [security@geauxacademy.com](mailto:security@geauxacademy.com)** with the following details:
   - A description of the vulnerability.
   - Steps to reproduce the vulnerability.
   - Any potential impact or risk associated with the vulnerability.
   - Your contact information for further communication.

## Response Time

We take security vulnerabilities seriously and will respond to your report as quickly as possible. Our typical response time is within 48 hours. During this time, we may reach out to you for additional information or clarification.

## Disclosure Policy

Once the vulnerability has been confirmed and a fix has been implemented, we will coordinate with you to disclose the vulnerability responsibly. We will provide credit to the reporter unless they wish to remain anonymous.

## Security Best Practices

To help ensure the security of this project, we follow these best practices:

- **Regular Security Audits:** We conduct regular security audits to identify and address potential vulnerabilities.
- **Dependency Management:** We keep our dependencies up to date and monitor for known vulnerabilities using tools like Dependabot.
- **Code Reviews:** All code changes are reviewed by multiple team members to ensure they meet our security standards.
- **Secure Coding Practices:** We follow secure coding practices to minimize the risk of introducing vulnerabilities.

Thank you for helping us keep Geaux Academy secure!
```

---

## /.github/catapi.md

```markdown
v1.8.0OAS 3.1.0
😸 Cheshire-Cat API
Download OpenAPI Document
Production ready AI assistant framework

Server
Base URL
Selected:
https://cheshire.geaux.app

Authentication
Optional

Auth Type
No authentication selected
Client Libraries
Curl Shell
Home​#Copy link to "Home"
HomeEndpoints
GET
/
POST
/message
Status​#Copy link to "Status"
Server status

Responses
Expand
200
Successful Response
application/json
GET
/
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/

Test Request
(get /)
200
Copy content
{}
Successful Response

Message With Cat​#Copy link to "Message With Cat"
Get a response from the Cat

Body
application/json
object
default: 
{ "text": "hello!" }
Responses
Expand
200
Successful Response
application/json
Expand
422
Validation Error
application/json
POST
/message
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/message \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "text": "hello!"
}'

Test Request
(post /message)
200
422
Copy content
{
  "user_id": "…",
  "when": 1,
  "who": "AI",
  "text": "…",
  "image": "…",
  "audio": "…",
  "type": "chat",
  "why": {
    "input": "…",
    "intermediate_steps": [],
    "memory": {},
    "model_interactions": [
      {
        "model_type": "llm",
        "source": "…",
        "prompt": "…",
        "input_tokens": 1,
        "started_at": 1,
        "reply": "…",
        "output_tokens": 1,
        "ended_at": 1
      }
    ],
    "ANY_ADDITIONAL_PROPERTY": "anything"
  },
  "message": "…",
  "content": "…",
  "ANY_ADDITIONAL_PROPERTY": "anything"
}
Successful Response

User Auth​#Copy link to "User Auth"
User AuthEndpoints
GET
/auth/available-permissions
POST
/auth/token
Get Available Permissions​#Copy link to "Get Available Permissions"
Returns all available resources and permissions.

Responses
Expand
200
Successful Response
application/json
GET
/auth/available-permissions
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/auth/available-permissions

Test Request
(get /auth/available-permissions)
200
Copy content
{
  "ANY_ADDITIONAL_PROPERTY": [
    "WRITE"
  ]
}
Successful Response

Auth Token​#Copy link to "Auth Token"
Endpoint called from client to get a JWT from local identity provider. This endpoint receives username and password as form-data, validates credentials and issues a JWT.

Body
application/json
username
string
required
password
string
required
Responses
Expand
200
Successful Response
application/json
Expand
422
Validation Error
application/json
POST
/auth/token
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/auth/token \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "username": "",
  "password": ""
}'

Test Request
(post /auth/token)
200
422
Copy content
{
  "access_token": "…",
  "token_type": "bearer"
}
Successful Response

Users​#Copy link to "Users"
UsersEndpoints
POST
/users/
GET
/users/
GET
/users/{user_id}
PUT
/users/{user_id}
DELETE
/users/{user_id}
Show More
Settings​#Copy link to "Settings"
SettingsEndpoints
GET
/settings/
POST
/settings/
GET
/settings/{settingId}
PUT
/settings/{settingId}
DELETE
/settings/{settingId}
Show More
Large Language Model​#Copy link to "Large Language Model"
Large Language ModelEndpoints
GET
/llm/settings
GET
/llm/settings/{languageModelName}
PUT
/llm/settings/{languageModelName}
Show More
Embedder​#Copy link to "Embedder"
EmbedderEndpoints
GET
/embedder/settings
GET
/embedder/settings/{languageEmbedderName}
PUT
/embedder/settings/{languageEmbedderName}
Show More
Plugins​#Copy link to "Plugins"
PluginsEndpoints
GET
/plugins/
POST
/plugins/upload
POST
/plugins/upload/registry
PUT
/plugins/toggle/{plugin_id}
GET
/plugins/settings
GET
/plugins/settings/{plugin_id}
PUT
/plugins/settings/{plugin_id}
GET
/plugins/{plugin_id}
DELETE
/plugins/{plugin_id}
Show More
Vector Memory - Points​#Copy link to "Vector Memory - Points"
Vector Memory - PointsEndpoints
GET
/memory/recall
POST
/memory/recall
POST
/memory/collections/{collection_id}/points
DELETE
/memory/collections/{collection_id}/points
GET
/memory/collections/{collection_id}/points
DELETE
/memory/collections/{collection_id}/points/{point_id}
PUT
/memory/collections/{collection_id}/points/{point_id}
Show More
Vector Memory - Collections​#Copy link to "Vector Memory - Collections"
Vector Memory - CollectionsEndpoints
GET
/memory/collections
DELETE
/memory/collections
DELETE
/memory/collections/{collection_id}
Show More
Working Memory - Current Conversation​#Copy link to "Working Memory - Current Conversation"
Working Memory - Current ConversationEndpoints
GET
/memory/conversation_history
DELETE
/memory/conversation_history
Show More
Rabbit Hole​#Copy link to "Rabbit Hole"
Rabbit HoleEndpoints
POST
/rabbithole/
POST
/rabbithole/batch
POST
/rabbithole/web
POST
/rabbithole/memory
GET
/rabbithole/allowed-mimetypes
Show More
AuthHandler​#Copy link to "AuthHandler"
AuthHandlerEndpoints
GET
/auth_handler/settings
GET
/auth_handler/settings/{auth_handler_name}
PUT
/auth_handler/settings/{auth_handler_name}
Show More
Models
AuthPermission​#Copy link to "AuthPermission"
string
enum
WRITE
EDIT
LIST
READ
DELETE
AuthResource​#Copy link to "AuthResource"
string
enum
STATUS
MEMORY
CONVERSATION
SETTINGS
LLM
Body_install_plugin​#Copy link to "Body_install_plugin"
file
string
binary
required
binary data, used to describe files

Body_recall_memory_points​#Copy link to "Body_recall_memory_points"
text
string
required
Find memories similar to this text.

k
integer
default: 
100
How many memories to return.

metadata
object
default: 
{}
Flat dictionary where each key-value pair represents a filter.The memory points returned will match the specified metadata criteria.

Body_upload_file​#Copy link to "Body_upload_file"
file
string
binary
required
binary data, used to describe files

chunk_size
integer | nullable
Maximum length of each chunk after the document is split (in tokens)

chunk_overlap
integer | nullable
Chunk overlap (in tokens)

metadata
string
default: 
{}
Metadata to be stored with each chunk (e.g. author, category, etc.). Since we are passing this along side form data, must be a JSON string (use json.dumps(metadata)).

Body_upload_files​#Copy link to "Body_upload_files"
files
array string[]
required
chunk_size
integer | nullable
Maximum length of each chunk after the document is split (in tokens)

chunk_overlap
integer | nullable
Chunk overlap (in tokens)

metadata
string
default: 
{}
Metadata to be stored where each key is the name of a file being uploaded, and the corresponding value is another dictionary containing metadata specific to that file. Since we are passing this along side form data, metadata must be a JSON string (use json.dumps(metadata)).

Body_upload_memory​#Copy link to "Body_upload_memory"
file
string
binary
required
binary data, used to describe files

CatMessage​#Copy link to "CatMessage"
Represents a Cat message.

Attributes
type : str The type of message. Defaults to "chat". user_id : str Unique identifier for the user associated with the message. when : float The timestamp when the message was sent. Defaults to the current time. who : str The name of the message author. text : Optional[str], default=None The text content of the message. image : Optional[str], default=None Image file URLs or base64 data URIs that represent image associated with the message. audio : Optional[str], default=None Audio file URLs or base64 data URIs that represent audio associated with the message. why : Optional[MessageWhy] Additional contextual information related to the message.

Notes
The content parameter and attribute are deprecated. Use text instead.
user_id
string
required
when
number
who
string
default: 
AI
text
string | nullable
image
string | nullable
audio
string | nullable
type
string
default: 
chat
why
object | nullable
message
string
read-only
required
This attribute is deprecated. Use text instead.

The text content of the message. Use text instead.

Returns
str The text content of the message.

content
string
read-only
required
This attribute is deprecated. Use text instead.

The text content of the message. Use text instead.

Returns
str The text content of the message.

additional properties
anything
EmbedderModelInteraction​#Copy link to "EmbedderModelInteraction"
Represents an interaction with an embedding model.

Inherits from ModelInteraction and includes attributes specific to embedding interactions.

Attributes
model_type : Literal["embedder"] The type of model, which is fixed to "embedder". source : str The source of the interaction, defaulting to "recall". reply : List[float] The embeddings generated by the embedder.

model_type
const: 
embedder
source
string
default: 
recall
prompt
string
required
input_tokens
integer
required
Integer numbers.

started_at
number
reply
array number[]
required
HTTPValidationError​#Copy link to "HTTPValidationError"
detail
array object[]

ValidationError
JWTResponse​#Copy link to "JWTResponse"
access_token
string
required
token_type
string
default: 
bearer
LLMModelInteraction​#Copy link to "LLMModelInteraction"
Represents an interaction with a large language model (LLM).

Inherits from ModelInteraction and adds specific attributes related to LLM interactions.

Attributes
model_type : Literal["llm"] The type of model, which is fixed to "llm". reply : str The response generated by the LLM. output_tokens : int The number of output tokens generated by the LLM. ended_at : float The timestamp when the interaction ended.

model_type
const: 
llm
source
string
required
prompt
string
required
input_tokens
integer
required
Integer numbers.

started_at
number
reply
string
required
output_tokens
integer
required
Integer numbers.

ended_at
number
required
MemoryPoint​#Copy link to "MemoryPoint"
content
string
required
metadata
object
default: 
{}
id
string
required
vector
array number[]
required
MemoryPointBase​#Copy link to "MemoryPointBase"
content
string
required
metadata
object
default: 
{}
MessageWhy​#Copy link to "MessageWhy"
A class for encapsulating the context and reasoning behind a message, providing details on input, intermediate steps, memory, and interactions with models.

Attributes
input : str The initial input message that triggered the response. intermediate_steps : List A list capturing intermediate steps or actions taken as part of processing the message. memory : dict A dictionary containing relevant memory information used during the processing of the message. model_interactions : List[Union[LLMModelInteraction, EmbedderModelInteraction]] A list of interactions with language or embedding models, detailing how models were used in generating or understanding the message context.

input
string
required
intermediate_steps
array
required
memory
object
required
model_interactions
array
required
Represents an interaction with a large language model (LLM).

Inherits from ModelInteraction and adds specific attributes related to LLM interactions.

Attributes
model_type : Literal["llm"] The type of model, which is fixed to "llm". reply : str The response generated by the LLM. output_tokens : int The number of output tokens generated by the LLM. ended_at : float The timestamp when the interaction ended.


LLMModelInteraction
Represents an interaction with an embedding model.

Inherits from ModelInteraction and includes attributes specific to embedding interactions.

Attributes
model_type : Literal["embedder"] The type of model, which is fixed to "embedder". source : str The source of the interaction, defaulting to "recall". reply : List[float] The embeddings generated by the embedder.


EmbedderModelInteraction
additional properties
anything
SettingBody​#Copy link to "SettingBody"
name
string
required
value
anyOf
required

object

array
category
string | nullable
UploadURLConfig​#Copy link to "UploadURLConfig"
url
string
required
URL of the website to which you want to save the content

chunk_size
integer | nullable
Maximum length of each chunk after the document is split (in tokens)

chunk_overlap
integer | nullable
Chunk overlap (in tokens)

metadata
object
default: 
{}
Metadata to be stored with each chunk (e.g. author, category, etc.)

UserCreate​#Copy link to "UserCreate"
username
string
min: 
2
required
permissions
object
default: 
{ "CONVERSATION": [ "WRITE", "EDIT", "LIST", "READ", "DELETE" ], "MEMORY": [ "READ", "LIST" ], "STATIC": [ "READ" ], "STATUS": [ "READ" ] }

Permissions
password
string
min: 
5
required
UserCredentials​#Copy link to "UserCredentials"
username
string
required
password
string
required
UserResponse​#Copy link to "UserResponse"
username
string
min: 
2
required
permissions
object
default: 
{ "CONVERSATION": [ "WRITE", "EDIT", "LIST", "READ", "DELETE" ], "MEMORY": [ "READ", "LIST" ], "STATIC": [ "READ" ], "STATUS": [ "READ" ] }

Permissions
id
string
required
UserUpdate​#Copy link to "UserUpdate"
username
string
min: 
2
permissions
object

Permissions
password
string
min: 
4
ValidationError​#Copy link to "ValidationError"
loc
array
required

string

integer
msg
string
required
type
string
requiredMessage With Cat​#Copy link to "Message With Cat"
Get a response from the Cat

Body
application/json
object
default: 
{ "text": "hello!" }
Responses
Expand
200
Successful Response
application/json
Expand
422
Validation Error
application/json
POST
/message
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/message \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "text": "hello!"
}'

Test Request
(post /message)
200
422
Copy content
{
  "user_id": "…",
  "when": 1,
  "who": "AI",
  "text": "…",
  "image": "…",
  "audio": "…",
  "type": "chat",
  "why": {
    "input": "…",
    "intermediate_steps": [],
    "memory": {},
    "model_interactions": [
      {
        "model_type": "llm",
        "source": "…",
        "prompt": "…",
        "input_tokens": 1,
        "started_at": 1,
        "reply": "…",
        "output_tokens": 1,
        "ended_at": 1
      }
    ],
    "ANY_ADDITIONAL_PROPERTY": "anything"
  },
  "message": "…",
  "content": "…",
  "ANY_ADDITIONAL_PROPERTY": "anything"
}
Successful Response

User Auth​#Copy link to "User Auth"
User AuthEndpoints
GET
/auth/available-permissions
POST
/auth/token
Get Available Permissions​#Copy link to "Get Available Permissions"
Returns all available resources and permissions.

Responses
Expand
200
Successful Response
application/json
GET
/auth/available-permissions
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/auth/available-permissions

Test Request
(get /auth/available-permissions)
200
Copy content
{
  "ANY_ADDITIONAL_PROPERTY": [
    "WRITE"
  ]
}
Successful Response

Auth Token​#Copy link to "Auth Token"
Endpoint called from client to get a JWT from local identity provider. This endpoint receives username and password as form-data, validates credentials and issues a JWT.

Body
application/json
username
string
required
password
string
required
Responses
Expand
200
Successful Response
application/json
Expand
422
Validation Error
application/json
POST
/auth/token
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/auth/token \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "username": "",
  "password": ""
}'

Test Request
(post /auth/token)
200
422
Copy content
{
  "access_token": "…",
  "token_type": "bearer"
}
Successful Response

Users​#Copy link to "Users"
UsersEndpoints
POST
/users/
GET
/users/
GET
/users/{user_id}
PUT
/users/{user_id}
DELETE
/users/{user_id}
Show More
Settings​#Copy link to "Settings"
SettingsEndpoints
GET
/settings/
POST
/settings/
GET
/settings/{settingId}
PUT
/settings/{settingId}
DELETE
/settings/{settingId}
Show More
Large Language Model​#Copy link to "Large Language Model"
Large Language ModelEndpoints
GET
/llm/settings
GET
/llm/settings/{languageModelName}
PUT
/llm/settings/{languageModelName}
Show More
Embedder​#Copy link to "Embedder"
EmbedderEndpoints
GET
/embedder/settings
GET
/embedder/settings/{languageEmbedderName}
PUT
/embedder/settings/{languageEmbedderName}
Show More
Plugins​#Copy link to "Plugins"
PluginsEndpoints
GET
/plugins/
POST
/plugins/upload
POST
/plugins/upload/registry
PUT
/plugins/toggle/{plugin_id}
GET
/plugins/settings
GET
/plugins/settings/{plugin_id}
PUT
/plugins/settings/{plugin_id}
GET
/plugins/{plugin_id}
DELETE
/plugins/{plugin_id}
Show More
Vector Memory - Points​#Copy link to "Vector Memory - Points"
Vector Memory - PointsEndpoints
GET
/memory/recall
POST
/memory/recall
POST
/memory/collections/{collection_id}/points
DELETE
/memory/collections/{collection_id}/points
GET
/memory/collections/{collection_id}/points
DELETE
/memory/collections/{collection_id}/points/{point_id}
PUT
/memory/collections/{collection_id}/points/{point_id}
Show More
Vector Memory - Collections​#Copy link to "Vector Memory - Collections"
Vector Memory - CollectionsEndpoints
GET
/memory/collections
DELETE
/memory/collections
DELETE
/memory/collections/{collection_id}
Show More
Working Memory - Current Conversation​#Copy link to "Working Memory - Current Conversation"
Working Memory - Current ConversationEndpoints
GET
/memory/conversation_history
DELETE
/memory/conversation_history
Show More
Rabbit Hole​#Copy link to "Rabbit Hole"
Rabbit HoleEndpoints
POST
/rabbithole/
POST
/rabbithole/batch
POST
/rabbithole/web
POST
/rabbithole/memory
GET
/rabbithole/allowed-mimetypes
Show More
AuthHandler​#Copy link to "AuthHandler"
AuthHandlerEndpoints
GET
/auth_handler/settings
GET
/auth_handler/settings/{auth_handler_name}
PUT
/auth_handler/settings/{auth_handler_name}
Show More
Models
AuthPermission​#Copy link to "AuthPermission"
string
enum
WRITE
EDIT
LIST
READ
DELETE
AuthResource​#Copy link to "AuthResource"
Body_install_plugin​#Copy link to "Body_install_plugin"
Body_recall_memory_points​#Copy link to "Body_recall_memory_points"
Body_upload_file​#Copy link to "Body_upload_file"
Body_upload_files​#Copy link to "Body_upload_files"
Body_upload_memory​#Copy link to "Body_upload_memory"
CatMessage​#Copy link to "CatMessage"
EmbedderModelInteraction​#Copy link to "EmbedderModelInteraction"
HTTPValidationError
```

---

## /.github/copilot-instructions.md

```markdown
# **GitHub Copilot Instructions for Geaux Academy**

This document provides **guidelines and best practices** for using **GitHub Copilot** within the **Geaux Academy** repository.  
All Copilot-generated code must adhere to these **standards and conventions** to maintain **code quality, security, and consistency** across the project.

---

## **� Project Overview**
Geaux Academy is a **React, TypeScript, Firebase, and FastAPI-based interactive learning platform**.  
The platform adheres to the following **best practices**:

✅ **Strict TypeScript enforcement** (`.tsx` for React components, explicit types for props & state).  
✅ **Modular and reusable code architecture** for maintainability.  
✅ **Absolute imports (`@/components/...`)** to maintain a clean project structure.  
✅ **Security best practices**, including **JWT authentication & Firestore RBAC**.  
✅ **Comprehensive testing**, including **unit tests (`.test.tsx`, `.test.py`) & integration tests**.  
✅ **CI/CD automation via GitHub Actions** (linting, tests, security scans, & deployments).  

---

## **� File Header Template**
All files must begin with the following **header comment**:

```tsx
// File: /relative/path/filename.ext
// Description: [Brief description of the file's purpose]
// Author: [Your Name]
// Created: [Date]
```

---

## **� Copilot Usage Guidelines**

### **� React Component Development**
- **Use functional components (`.tsx`)**.
- **Ensure TypeScript typings** (`Props`, `State`, `Event Handlers`).
- **Use Styled Components or Tailwind CSS for styling** (avoid inline styles).
- **Follow the project’s component structure** (keep reusable components in `/src/components/`).

✅ **Example - Good Component**:
```tsx
// File: /src/components/ProfileCard.tsx
// Description: Displays a user's profile information with avatar and bio.

import React from "react";

interface ProfileCardProps {
  name: string;
  bio: string;
  avatarUrl: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, bio, avatarUrl }) => {
  return (
    <div className="p-4 shadow-md rounded-lg">
      <img src={avatarUrl} alt={`${name}'s Avatar`} className="w-16 h-16 rounded-full" />
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-sm">{bio}</p>
    </div>
  );
};

export default ProfileCard;
```

� **Bad Example:**
❌ **No TypeScript types**  
❌ **Uses inline styles instead of Tailwind CSS or Styled Components**  
```tsx
function ProfileCard({ name, bio, avatarUrl }) {
  return (
    <div style={{ padding: "10px", border: "1px solid #ddd" }}>
      <img src={avatarUrl} alt={name} style={{ width: "50px", height: "50px" }} />
      <h2>{name}</h2>
      <p>{bio}</p>
    </div>
  );
}
```

---

### **� Backend & API Development (FastAPI)**
- **Follow RESTful API principles**.
- **Use `Pydantic` models for request validation**.
- **Enforce authentication (JWT) & role-based access control (RBAC)**.
- **Implement error handling with appropriate HTTP status codes**.

✅ **Example - FastAPI Endpoint**:
```python
# File: /backend/routes/users.py
# Description: User authentication and profile retrieval API.

from fastapi import APIRouter, Depends, HTTPException
from models.user import User
from schemas.user import UserSchema
from auth.jwt_handler import get_current_user

router = APIRouter()

@router.get("/users/me", response_model=UserSchema)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return current_user
```

� **Bad Example:**  
❌ **No authentication**  
❌ **No response model (makes API unpredictable)**  
```python
@router.get("/user")
def get_user():
    return {"user": "John Doe"}
```

---

### **� Unit Testing Guidelines**
- **Create test files** with a `.test.tsx` or `.test.py` suffix.
- **Test both valid and invalid inputs**.
- **Mock API calls using `Mock Service Worker (MSW)`**.

✅ **Example - React Unit Test**:
```tsx
// File: /src/components/__tests__/ProfileCard.test.tsx

import { render, screen } from "@testing-library/react";
import ProfileCard from "../ProfileCard";

test("renders ProfileCard with correct props", () => {
  render(<ProfileCard name="John Doe" bio="Developer" avatarUrl="/avatar.jpg" />);
  
  expect(screen.getByText("John Doe")).toBeInTheDocument();
  expect(screen.getByText("Developer")).toBeInTheDocument();
});
```

✅ **Example - FastAPI Unit Test**:
```python
# File: /backend/tests/test_users.py

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_user_profile():
    response = client.get("/users/me")
    assert response.status_code == 401  # Expect unauthorized without authentication
```

---

## **� File Structure Consistency**
- **Frontend:**
    ```
    /src
        ├── components/
        ├── pages/
        ├── hooks/
        ├── utils/
        ├── styles/
    ```
- **Backend:**
    ```
    /backend
        ├── routes/
        ├── models/
        ├── schemas/
        ├── auth/
    ```

---

## **� Copilot Request Format**
When submitting a **Copilot request**, include:

1️⃣ **A clear description** of the feature or function you need.  
2️⃣ **The intended file path** where the code should be placed.  
3️⃣ **Context on how it integrates with existing code**.  

✅ **Example Prompt**:
```plaintext
"Create a new React component at /src/components/ProfileCard.tsx that displays a user's profile.
Include proper TypeScript types for props and a unit test for this component."
```

� **Bad Prompt**:
```plaintext
"Make a profile component."
```
_(Too vague; lacks context on file path, TypeScript, testing, or expected functionality.)_

---

## **✅ Summary: What Copilot Should Always Follow**
✔ **Strict TypeScript best practices**  
✔ **Use absolute imports (`@/src/...`)**  
✔ **Ensure API security (JWT, RBAC, Firestore rules)**  
✔ **Follow ESLint + Prettier formatting**  
✔ **Write unit tests (`.test.tsx` or `.test.py`) for all new code**  
✔ **Use Tailwind CSS or Styled Components for styling**  

� **By following these instructions, GitHub Copilot will generate code that aligns with Geaux Academy's development standards!**

---

## **Comprehensive Development Guide**

### **Project Overview**
Geaux Academy is an innovative educational platform designed to provide personalized learning experiences for students. The platform leverages advanced technologies such as AI and machine learning to tailor educational content to individual learning styles, ensuring that each student can learn at their own pace and in their own way.

### **Goals**
1. **Personalized Learning Paths**: Develop a system that creates customized learning paths for each student based on their unique learning style and progress.
2. **Interactive Content**: Integrate interactive and engaging content to enhance the learning experience.
3. **Progress Tracking**: Implement a robust progress tracking system to monitor student performance and provide feedback.
4. **Scalability**: Ensure the platform can scale to accommodate a growing number of users without compromising performance.
5. **Security**: Implement strong security measures to protect user data and ensure privacy.

### **Architecture Overview**

#### **Frontend**
- React 18+ with TypeScript
- Vite for build tooling
- Firebase SDK for auth/storage
- Context API + Redux for state management
- Styled Components & CSS Modules

#### **Backend**
- Python FastAPI backend
- Firebase Authentication
- Firestore Database
- OpenAI integration for chat

### **Development Roadmap**

#### **Phase 1: Foundation (Week 1-2)**
- [x] Project setup and configuration
- [x] Basic authentication flow
- [ ] Core UI components
  - [ ] Navigation
  - [ ] Layout system
  - [ ] Theme implementation
- [ ] Basic Firebase integration
- [ ] Test environment setup

#### **Phase 2: Core Features (Week 3-4)**
- [ ] Learning Style Assessment
  - [ ] Chat interface implementation
  - [ ] OpenAI integration
  - [ ] Response analysis system
  - [ ] Results storage and retrieval
- [ ] User Profile System
  - [ ] Profile creation/editing
  - [ ] Learning style data integration
  - [ ] Progress tracking

#### **Phase 3: Learning Experience (Week 5-6)**
- [ ] Content Management
  - [ ] Learning material organization
  - [ ] Content adaptation based on VARK
  - [ ] Resource recommendation engine
- [ ] Progress Tracking
  - [ ] Analytics dashboard
  - [ ] Performance metrics
  - [ ] Learning path visualization

#### **Phase 4: Enhancement (Week 7-8)**
- [ ] Advanced Features
  - [ ] Real-time collaboration
  - [ ] Interactive exercises
  - [ ] Peer learning features
- [ ] Performance Optimization
  - [ ] Caching implementation
  - [ ] Load time optimization
  - [ ] API efficiency improvements

### **Development Guidelines**

#### **Code Organization**
```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── contexts/      # React contexts
├── services/      # API/Firebase services
├── store/         # Redux store
└── utils/         # Helpers and utilities
```

#### **Coding Standards**
- Use TypeScript for type safety
- Follow ESLint configuration
- Write unit tests for critical components
- Document complex functions and components

#### **Git Workflow**
1. Create feature branch from `develop`
2. Follow conventional commits
3. Submit PR with description
4. Require review approval
5. Squash merge to `develop`

#### **Testing Strategy**
- Unit tests for utilities and hooks
- Integration tests for major features
- E2E tests for critical user flows
- Regular security testing

#### **Performance Targets**
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse score > 90
- API response time < 200ms

### **Environment Setup**

#### **Development Environment**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Check types
npm run type-check
```

#### **Firebase Configuration**
Required environment variables:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

#### **OpenAI Integration**
Required for chat features:
```
VITE_OPENAI_API_KEY
VITE_OPENAI_MODEL
```

### **Deployment**

#### **Staging Deployment**
1. Merge to `develop`
2. Automatic deployment to staging
3. Run integration tests
4. Manual QA review

#### **Production Deployment**
1. Create release branch
2. Version bump
3. Generate changelog
4. Deploy to production
5. Tag release

### **Monitoring**

#### **Key Metrics**
- User engagement metrics
- Learning effectiveness
- System performance
- Error rates

#### **Logging**
- Application logs in Firebase
- Error tracking in Sentry
- Performance monitoring in Firebase Performance

### **Support and Documentation**

#### **Internal Resources**
- API Documentation
- Component Storybook
- Architecture diagrams
- Test coverage reports

#### **External Resources**
- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **TIPI Development Guide**

#### **Prerequisites**

- Docker installed and running
- Node.js 16+ and npm
- TIPI CLI (optional but recommended)

#### **Getting Started**

1. Start the TIPI container:
```bash
docker run -d \
  --name cheshire-cat \
  -p 1865:1865 \
  -v $PWD/cat_data:/app/cat_data \
  ghcr.io/cheshire-cat-ai/core:latest
```

2. Copy the environment template:
```bash
cp .env.example .env
```

3. Configure your .env file with TIPI settings:
```
VITE_CHESHIRE_API_URL=http://localhost:1865
VITE_CHESHIRE_ADMIN_PASSWORD=admin
VITE_CHESHIRE_DEBUG=true
```

4. Start the development server:
```bash
npm run dev
```

#### **Troubleshooting**

##### **Common Issues**

1. CORS Errors
- Ensure the TIPI container is running with proper CORS settings
- Check that vite.config.js proxy settings are correct
- Verify your VITE_CHESHIRE_API_URL matches the TIPI container URL

2. Connection Issues
- Check if the TIPI container is running: `docker ps`
- Verify the port mapping: `docker port cheshire-cat`
- Test direct connection: `curl http://localhost:1865`

3. Authentication Issues
- Verify VITE_CHESHIRE_ADMIN_PASSWORD matches TIPI container settings
- Check network logs for auth token responses
- Try restarting TIPI container if auth persists

##### **Development Tips**

1. Enable debug mode for detailed logs:
```
VITE_CHESHIRE_DEBUG=true
```

2. Monitor TIPI container logs:
```bash
docker logs -f cheshire-cat
```

3. Reset TIPI container if needed:
```bash
docker restart cheshire-cat
```

#### **Development Workflow**

1. Start TIPI container
2. Run development server
3. Initialize Cheshire service (automatic on app start)
4. Monitor logs for connection issues
5. Use CheshireService.checkTipiHealth() to verify connection

#### **API Integration**

The Cheshire Cat service automatically handles:
- Connection management
- Authentication
- Retries on failure
- Error handling with detailed logs

See `src/services/cheshireService.ts` for implementation details.
```

---

## /.github/dependabot.yml

```plaintext
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
  - package-ecosystem: "pip"
    directory: "/backend"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

## /.github/labels.yml

```plaintext
labels:
  - name: bug
    color: F00
    description: An issue with the system
  - name: enhancement
    color: 0E8A16
    description: New feature or request
  - name: documentation
    color: 0075CA
    description: Improvements or additions to documentation
  - name: question
    color: C2E0C6
    description: Further information is requested
  - name: wontfix
    color: 000000
    description: This will not be worked on
  - name: duplicate
    color: CCCCCC
    description: This issue or pull request already exists
  - name: invalid
    color: E4E669
    description: This doesn't seem right
  - name: help wanted
    color: 128A0C
    description: Extra attention is needed
  - name: good first issue
    color: 7057FF
    description: Good for newcomers
  - name: needs investigation
    color: FBCA04
    description: Further investigation is required
```

---

## /.github/pull_request_template.md

```markdown
# Pull Request Template

## Description

Please include a summary of the changes and the related issue. Please also include relevant motivation and context. List any dependencies that are required for this change.

Fixes # (issue)

## Type of change

Please delete options that are not relevant.

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

## How Has This Been Tested?

Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce. Please also list any relevant details for your test configuration.

- [ ] Test A
- [ ] Test B

**Test Configuration**:
* Firmware version:
* Hardware:
* Toolchain:
* SDK:

## Checklist:

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules
```

---

## /.github/stale.yml

```plaintext
# Configuration for the stale bot to automatically close stale issues and pull requests

# Number of days of inactivity before an issue becomes stale
daysUntilStale: 30

# Number of days to wait to close a stale issue
daysUntilClose: 7

# Exempt certain labels from being marked as stale
exemptLabels:
  - "pinned"
  - "security"

# Only issues with these labels will be marked as stale
onlyLabels:
  - "bug"
  - "enhancement"

# Exempt certain milestones from being marked as stale
exemptMilestones:
  - "v1.0"

# Exempt certain projects from being marked as stale
exemptProjects:
  - "Roadmap"

# Exempt certain assignees from being marked as stale
exemptAssignees:
  - "project-lead"

# Message to post when marking an issue as stale
staleMessage: "This issue has been automatically marked as stale due to inactivity. If this issue is still relevant, please comment or remove the stale label."

# Message to post when closing a stale issue
closeMessage: "This issue has been automatically closed due to inactivity. If you still need help, please open a new issue."

# Limit the number of actions per run
limitPerRun: 30

# Run the stale bot on a schedule
schedule:
  - cron: "0 0 * * *"
```

---

## /.github/task.md

```markdown
# Geaux Academy Development Roadmap

## [Milestone 1: Core Platform Development](pplx://action/followup)
### 1.[1 Dynamic Learning Pathways](pplx://action/followup)
- Develop algorithm for real-time curriculum difficulty adjustment
- Implement performance metrics tracking (accuracy, engagement, completion time)
- Create adaptive content delivery system
- **Integrate CrewAI for curriculum research**
- **Implement K-12 educational curriculum scraping of state-approved grade-appropriate assignments**
- **Develop teacher personas and curriculum content generation based on the identified learning style of each student**
- **Implement learning style assessment and storage/ingestion of all files using Cheshire AI framework**

### 1.[2 AI-Powered Recommendation Engine](pplx://action/followup)
- Integrate Amazon SageMaker for ML models
- Develop resource suggestion algorithm based on learning analytics
- Create content tagging system for 50+ resource types

## [Milestone 2: Collaborative Ecosystem](pplx://action/followup)
### 2.[1 Peer Interaction System](pplx://action/followup)
- Build WebRTC-powered virtual classroom
- Implement collaborative whiteboard feature
- Develop group project management tools

### 2.[2 Parent Dashboard](pplx://action/followup)
- Create real-time progress visualization system
- Implement human-in-the-loop verification protocol
- Develop parent-teacher communication module

## [Milestone 3: AI Optimization](pplx://action/followup)
### 3.[1 Model Fine-Tuning](pplx://action/followup)
- Collect state curriculum datasets from 20+ states
- Develop domain-specific training pipelines
- Implement model validation framework

### 3.[2 Multi-Model Orchestration](pplx://action/followup)
- Build dynamic model scoring system
- Create cost-aware API routing layer
- Implement response caching system

## [Milestone 4: Scalability Infrastructure](pplx://action/followup)
### 4.[1 Multi-Tenancy Architecture](pplx://action/followup)
- Develop institution-specific namespace system
- Implement role-based access controls
- Create admin dashboard template

### 4.[2 Cloud Optimization](pplx://action/followup)
- Configure Kubernetes cluster for auto-scaling
- Implement database sharding strategy
- Develop serverless function suite

## [Milestone 5: Quality Assurance](pplx://action/followup)
### 5.[1 Automated Testing](pplx://action/followup)
- Create 500+ unit tests for core features
- Develop load testing scenarios for 10k concurrent users
- Implement security penetration testing protocol

### 5.[2 Beta Program](pplx://action/followup)
- Recruit 200+ beta testers across 5 grade levels
- Develop feedback collection system
- Create bug triage workflow

## [Milestone 6: Deployment & Monitoring](pplx://action/followup)
### 6.[1 CI/CD Pipeline](pplx://action/followup)
- Set up GitHub Actions workflows
- Implement blue-green deployment strategy
- Configure automated rollback system

### 6.[2 Observability Stack](pplx://action/followup)
- Deploy Prometheus/Grafana monitoring
- Set up ELK logging infrastructure
- Create alerting rules for 50+ KPIs

## [Milestone 7: Accessibility & Localization](pplx://action/followup)
### 7.[1 WCAG Compliance](pplx://action/followup)
- Implement screen reader support
- Develop keyboard navigation system
- Create high contrast theme options

### 7.[2 Multilingual Support](pplx://action/followup)
- Translate UI to 5 core languages
- Integrate real-time translation API
- Develop locale-specific content filters

## [Milestone 8: Growth & Marketing](pplx://action/followup)
### 8.[1 Institutional Onboarding](pplx://action/followup)
- Create school administrator toolkit
- Develop bulk user import system
- Build custom analytics dashboards

### 8.[2 Community Engagement](pplx://action/followup)
- Launch ambassador program
- Develop content creator toolkit
- Implement social learning features
```

---

## /.github/workflows/ci.yml

```plaintext
name: CI Workflow

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Run ESLint
        run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to Firebase
        run: npm run deploy
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

---

## /.github/workflows/dependency-review.yml

```plaintext
name: Dependency Review

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Run dependency review
        run: npm outdated
```

---

## /.github/workflows/deploy.yml

```plaintext
name: Deploy

on:
  push:
    branches:
      - main
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to Firebase
        run: npm run deploy
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

---

## /.github/workflows/firebase-deploy.yml

```plaintext
name: Firebase Deploy

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_GEAUX_ACADEMY }}
          channelId: live
          projectId: geaux-academy
```

---

## /.github/workflows/main.yml

```plaintext
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
    paths-ignore:
      - '**.md'
      - '.github/copilot-instructions.md'
      - 'docs/**'
  pull_request:
    branches: [ main, develop ]
    paths-ignore:
      - '**.md'
      - '.github/copilot-instructions.md'
      - 'docs/**'

permissions:
  checks: write
  contents: read
  pull-requests: write

env:
  NODE_VERSION: '20'
  VITE_USE_SECURE_COOKIES: 'true'
  VITE_AUTH_PERSISTENCE: 'LOCAL'
  VITE_AUTH_POPUP_FALLBACK: 'true'
  VITE_SERVICE_WORKER_TIMEOUT: '10000'
  VITE_MAX_AUTH_RETRIES: '3'
  VITE_AUTH_POPUP_REDIRECT_RESOLVER: 'browser'

jobs:
  validate-environment:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Validate development environment
        run: |
          if [ -f "devcontainer.json" ]; then
            echo "✅ Development container configuration validated"
          else
            echo "❌ Error: Missing devcontainer.json"
            exit 1
          fi

  build-and-test:
    needs: validate-environment
    runs-on: ubuntu-latest
    timeout-minutes: 15
    environment: production

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Clear npm cache
      run: npm cache clean --force
      
    - name: Install dependencies
      run: npm ci --legacy-peer-deps

    - name: Setup Supabase CLI
      uses: supabase/setup-cli@v1
      with:
        version: latest

    - name: Start Supabase Local Development
      run: |
        supabase init
        supabase start

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm test
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        VITE_SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.VITE_SUPABASE_SERVICE_ROLE_KEY }}
        VITE_CHESHIRE_API_URL: ${{ secrets.VITE_CHESHIRE_API_URL }}
        VITE_CHESHIRE_API_TOKEN: ${{ secrets.VITE_CHESHIRE_API_TOKEN }}
        VITE_CHESHIRE_API_TOKEN_TYPE: ${{ secrets.VITE_CHESHIRE_API_TOKEN_TYPE }}
        VITE_CHESHIRE_DEBUG: ${{ secrets.VITE_CHESHIRE_DEBUG }}
        VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}

    - name: Build
      run: npm run build
      env:
        NODE_ENV: production
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        VITE_SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.VITE_SUPABASE_SERVICE_ROLE_KEY }}
        VITE_CHESHIRE_API_URL: ${{ secrets.VITE_CHESHIRE_API_URL }}
        VITE_CHESHIRE_API_TOKEN: ${{ secrets.VITE_CHESHIRE_API_TOKEN }}
        VITE_CHESHIRE_API_TOKEN_TYPE: ${{ secrets.VITE_CHESHIRE_API_TOKEN_TYPE }}
        VITE_CHESHIRE_DEBUG: ${{ secrets.VITE_CHESHIRE_DEBUG }}
        VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}

    - name: Check bundle size
      run: npm run analyze-bundle || true

    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build
        path: dist/

  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    timeout-minutes: 15
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install Supabase CLI
      uses: supabase/setup-cli@v1
      with:
        version: latest

    - name: Download build artifacts
      uses: actions/download-artifact@v4
      with:
        name: build
        path: dist/

    - name: Setup Supabase Project
      run: |
        supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_ID }} -p ${{ secrets.SUPABASE_DB_PASSWORD }}
      env:
        SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

    - name: Deploy Supabase Functions
      run: |
        supabase functions deploy
      env:
        SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

    - name: Deploy Static Assets
      uses: supabase/hosting-deploy@v1
      with:
        project_id: ${{ secrets.SUPABASE_PROJECT_ID }}
        access_token: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
        dist_dir: dist/

    - name: Deploy to Firebase Hosting
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: ${{ secrets.GITHUB_TOKEN }}
        firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_GEAUX_ACADEMY }}
        channelId: live
        projectId: geaux-academy
```

---

## /.github/prompts/claude-prompt.md

```markdown
SYSTEM (role instruction):
You are a lead engineer at Geaux Academy with deep expertise in:

CrewAI for multi-agent orchestration (e.g., defining specialized roles such as Teacher, Researcher, Supervisor)
Cheshire Cat memory systems and plugin development (including vector-based recall and conversation integration)
React/Firebase full-stack integrations for real-time data management and user interface design
Building and maintaining robust, modular codebases for cross-service AI tasks
Your mission is to help the development team refine our Geaux Academy codebase fundamentals. Provide step-by-step guidance on integrating CrewAI with the Cheshire Cat Agent framework while ensuring our React/Firebase components remain seamlessly connected. Emphasize best practices such as clear module organization, asynchronous messaging between agents, and effective memory storage and recall.

USER (task instruction & placeholders):
<instructions>

Project Objectives:
We need guidance on extending the Geaux Academy codebase to integrate:

CrewAI for advanced multi-agent orchestration (with roles like Teacher, Researcher, and Supervisor)
Cheshire Cat for AI memory management, plugin development, and conversation context storage
React/Firebase for our user-facing interface and real-time data synchronization
Key Areas to Address:

Directory Structure & Module Organization: Provide an ideal directory tree layout and explain the purpose of each module (e.g., agents, plugins, front-end, Firebase integration).
Multi-Agent Integration: Describe strategies for bridging CrewAI tasks with Cheshire Cat memory functionalities. Include code snippets or pseudocode that demonstrate how agents (like a teacher_agent or researcher_agent) communicate, store context, and recall previous interactions.
Asynchronous Messaging: Offer recommendations on handling asynchronous events or queued message flows between agents, ensuring robust communication.
React/Firebase Integration: Provide an example (or pseudocode) showing how the front-end can trigger multi-agent tasks and then display real-time results by polling or using WebSockets.
Advanced Patterns: Suggest prompt-chaining or function calling patterns that we can leverage for large or complex tasks, and describe how we might chain multiple sub-prompts (e.g., code review, memory alignment, ChatOps with CrewAI).
Additional Context:
We have partial code in our myCurriculumDesigner plugin that sets up some memory references. If there’s an opportunity to reuse or extend this structure, please highlight it.

Response Requirements:

Include your chain-of-thought reasoning within <thinking> tags so we can follow your step-by-step logic.
Present your final recommendations, directory structure, code outlines, and sample snippets within <answer> tags.
If needed, include any additional references or known best practices in a <references> section.
</instructions>
<examples>

<example> <thinking> 1. Propose a clear directory structure—for example: - **geauxacademy/crewai/** for multi-agent orchestrator and agent-specific modules - **geauxacademy/cheshire_cat/** for memory utilities and plugin interfaces - **geauxacademy/react_frontend/** for React components and UI logic - **geauxacademy/firebase_integration/** for Firestore and authentication services 2. Outline how an orchestrator (e.g., `orchestrator.py`) can retrieve context from Cheshire Cat memory, pass payloads to agents (like `teacher_agent.py`), and aggregate responses. 3. Show sample pseudocode demonstrating asynchronous messaging or queued processing between agents. 4. Describe how the React front-end might call a unified endpoint that triggers the orchestrator and uses WebSockets or polling to update the UI. 5. Reference how our existing `myCurriculumDesigner` plugin’s memory integration might be adapted for multi-agent tasks. </thinking> <answer> **Directory Structure:** ``` geauxacademy/ crewai/ orchestrator.py # Coordinates multi-agent tasks teacher_agent.py # Handles educational content generation researcher_agent.py # Analyzes data and provides insights supervisor_agent.py # Merges and validates outputs cheshire_cat/ memory_utils.py # Functions for storing and retrieving memory plugin_interface.py # Base classes for plugin integration react_frontend/ src/ components/ MultiAgentDashboard.jsx # UI for displaying multi-agent outputs App.jsx package.json firebase_integration/ firestore_service.js # Functions for interacting with Firestore auth_service.js # Authentication logic for Firebase ```
csharp
Copy
**Example Orchestrator Code (Python pseudocode):**
```python
# crewai/orchestrator.py
from cheshire_cat.memory_utils import recall_memory, add_memory
from crewai.teacher_agent import TeacherAgent
from crewai.researcher_agent import ResearcherAgent
from crewai.supervisor_agent import SupervisorAgent

def orchestrate_multi_agent_task(payload):
    # Step 1: Retrieve context from Cheshire Cat memory
    context = recall_memory(query=f"Task context for {payload['task_id']}")
    
    # Step 2: Pass payload to the teacher agent
    teacher_output = TeacherAgent.run(payload, context)
    add_memory(content=teacher_output, metadata={'agent': 'teacher'})
    
    # Step 3: Get additional insights from the researcher agent
    researcher_output = ResearcherAgent.run(payload, context)
    add_memory(content=researcher_output, metadata={'agent': 'researcher'})
    
    # Step 4: Combine outputs in the supervisor agent for final decision-making
    final_output = SupervisorAgent.merge(teacher_output, researcher_output)
    add_memory(content=final_output, metadata={'agent': 'supervisor', 'final': True})
    
    return final_output
```

**React/Firebase Integration Example (JavaScript pseudocode):**
```javascript
// react_frontend/src/components/MultiAgentDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MultiAgentDashboard = () => {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const triggerTask = async (taskPayload) => {
    setLoading(true);
    try {
      // Call a unified API endpoint that triggers the orchestrator
      const response = await axios.post('/api/agents/orchestrate', taskPayload);
      setOutput(response.data);
    } catch (error) {
      console.error('Error during multi-agent task:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Example task payload; in practice, obtain from user input or other modules
    const taskPayload = { task_id: '12345', subject: 'math', grade: '5', learning_style: 'visual' };
    triggerTask(taskPayload);
  }, []);

  return (
    <div>
      {loading ? <p>Processing...</p> : <pre>{JSON.stringify(output, null, 2)}</pre>}
    </div>
  );
};

export default MultiAgentDashboard;
```

**Prompt Chaining Suggestions:**
- **Step 1:** Ask Claude to review and propose a refined directory structure for multi-agent tasks.  
- **Step 2:** Request a detailed walkthrough of agent communication logic with pseudocode examples.  
- **Step 3:** Ask for best practices on integrating asynchronous messaging between React and Python back-end endpoints.
</answer> </example> </examples>
<formatting>

Provide your chain-of-thought reasoning in <thinking> tags.
Present your final recommendations, code outlines, or sample snippets within <answer> tags.
Use <references> if you wish to include additional context or best practices from our existing code (e.g., the myCurriculumDesigner plugin).
```

---

## /.github/prompts/geaux-academy-dev.prompt.md

```markdown
# Geaux Academy Development Guide (React-Vite + CrewAI + Cheshire AI)

## **Objective**
You are assisting in the development of **Geaux Academy**, a web application built with:
- **React-Vite** for the frontend.
- **CrewAI** for AI-driven automation.
- **Cheshire AI Agent Framework** for intelligent decision-making.

Your role is to autonomously generate, debug, and optimize **code and architecture**, ensuring best practices in performance, scalability, and AI integration.

---

## **1. Frontend Development (React-Vite)**
**Task: Build and optimize the frontend UI/UX.**  
Follow these guidelines:
- Use **React-Vite** for fast development and optimal performance.
- Implement **Tailwind CSS or Material UI** for modern UI design.
- Manage state with **Zustand or Redux Toolkit**, depending on complexity.
- Fetch data asynchronously using **React Query** or native `fetch/axios`.
- Optimize performance with **lazy loading, memoization, and code splitting**.

### **Example Request:**
> "Generate a React-Vite component for displaying AI-generated course recommendations from CrewAI."

[📄 Reference: React Docs](https://react.dev/) | [📄 Vite Docs](https://vitejs.dev/)

---

## **2. Backend Development (CrewAI + Cheshire AI)**
**Task: Implement backend logic with CrewAI and Cheshire AI.**  
Guidelines:
- **CrewAI:** Build AI-powered automation workflows (e.g., course recommendations, student support).
- **Cheshire AI:** Deploy intelligent agents for contextual decision-making.
- Use **FastAPI (Python) or Express (Node.js)** for backend services.
- Secure and scale the API using **JWT authentication, rate limiting, and caching**.

### **Example Request:**
> "Provide a Python script for integrating CrewAI with Cheshire AI for personalized course recommendations."

[📄 CrewAI Docs](https://github.com/CrewAI/crewAI) | [📄 Cheshire AI Docs](https://github.com/CheshireAI/cheshire)

---

## **3. Database & API Integration**
**Task: Design and connect a scalable database.**  
- Use **PostgreSQL (SQL) or MongoDB (NoSQL)** based on requirements.
- Optimize database queries using **ORMs like Prisma (Node.js) or SQLAlchemy (Python)**.
- Implement **RESTful APIs or GraphQL** for data exchange.

### **Example Request:**
> "Generate a PostgreSQL schema for storing student profiles and enrolled courses."

[📄 Prisma Docs](https://www.prisma.io/) | [📄 SQLAlchemy Docs](https://www.sqlalchemy.org/)

---

## **4. AI-Powered Features**
**Task: Enhance Geaux Academy with AI-driven functionality.**  
Potential use cases:
- **Automated tutoring:** Cheshire AI agents assist students with real-time learning.
- **Personalized course recommendations:** CrewAI suggests courses based on user history.
- **Smart content generation:** AI generates quizzes and study guides.

### **Example Request:**
> "Design an AI-powered chatbot for answering student queries using CrewAI and Cheshire AI."

---

## **5. Debugging & Optimization**
**Task: Debug and improve existing code for performance and scalability.**  
- Optimize **React renders** to avoid unnecessary re-renders.
- Implement **server-side caching (Redis)** to reduce database load.
- Use **profiling tools** to analyze performance bottlenecks.

### **Example Request:**
> "Why is my CrewAI agent failing to process large datasets? Provide debugging strategies."

[📄 Debugging with React](https://react.dev/learn/debugging)

---

## **6. Security & Best Practices**
**Task: Ensure security and maintainability.**  
- Implement **OAuth2 or JWT-based authentication**.
- Enforce **role-based access control (RBAC)**.
- Validate all API inputs and sanitize responses.

### **Example Request:**
> "List security best practices for protecting CrewAI’s API endpoints."

[📄 OWASP Security Best Practices](https://owasp.org/www-project-api-security/)

---

## **How to Use This Prompt File**
1. Attach this prompt to **Copilot Chat** (`Ctrl+/` → Select Prompt...).
2. Select a **task type** (Frontend, Backend, Debugging, etc.).
3. If needed, attach additional **context files** like API specs or component references.
4. **Send a request** using the provided example structures or customize as needed.

---

## **Next Steps**
- **1️⃣ Generate a React component for CrewAI-driven recommendations.**
- **2️⃣ Set up a backend API with Cheshire AI integration.**
- **3️⃣ Debug and optimize an existing CrewAI script.**
- **4️⃣ Implement AI-driven security and access control.**

👉 **Enter the number to proceed.**
```

---

## /.github/ISSUE_TEMPLATE/api-setup.md

```markdown
---
name: API setup
about: Develop the API endpoints
title: 'API setup'
labels: ''
assignees: ''

---

## Description

Develop the API endpoints.

## Tasks

- [x] Design the API endpoints
- [x] Implement the API endpoints
- [x] Test the API endpoints
```

---

## /.github/ISSUE_TEMPLATE/bug_report.md

```markdown
---
name: Bug report
about: Create a report to help us improve
title: ''
labels: bug
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Desktop (please complete the following information):**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Smartphone (please complete the following information):**
 - Device: [e.g. iPhone6]
 - OS: [e.g. iOS8.1]
 - Browser [e.g. stock browser, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

---

## /.github/ISSUE_TEMPLATE/config.yml

```plaintext
blank_issues_enabled: false
contact_links:
  - name: Bug Report
    url: https://github.com/GeauxAcademy/GA-MVP/issues/new?template=bug_report.md
    about: Report a bug to help us improve
  - name: Feature Request
    url: https://github.com/GeauxAcademy/GA-MVP/issues/new?template=feature_request.md
    about: Suggest a new feature or enhancement
  - name: Custom Issue
    url: https://github.com/GeauxAcademy/GA-MVP/issues/new?template=custom.md
    about: Create a custom issue for other types of requests
```

---

## /.github/ISSUE_TEMPLATE/custom.md

```markdown
---
name: Custom issue
about: Create a custom issue
title: ''
labels: ''
assignees: ''

---

**Description**
A clear and concise description of the issue.

**Steps to Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Additional context**
Add any other context about the issue here.
```

---

## /.github/ISSUE_TEMPLATE/database-setup.md

```markdown
---
name: Database setup
about: Set up the database schema and models
title: 'Database setup'
labels: ''
assignees: ''

---

## Description

Set up the database schema and models.

## Tasks

- [ ] Design the database schema
- [ ] Create the database models
- [ ] Implement database migrations
- [ ] Test the database setup
```

---

## /.github/ISSUE_TEMPLATE/feature_request.md

```markdown
---
name: Feature request
about: Suggest an idea for this project
title: ''
labels: enhancement
assignees: ''

---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

---

## /.github/ISSUE_TEMPLATE/setup-authentication.md

```markdown
---
name: Setup Authentication
about: Implement Firebase authentication with Google login
title: 'Setup Authentication'
labels: ''
assignees: ''

---

## Description

Implement Firebase authentication with Google login.

## Tasks

- [ ] Set up Firebase project
- [ ] Configure Firebase Authentication
- [ ] Implement Google login in the application
- [ ] Test the authentication flow
```

---

## /.github/ISSUE_TEMPLATE/ui-setup.md

```markdown
---
name: UI setup
about: Design and implement the user interface
title: 'UI setup'
labels: ''
assignees: ''

---

## Description

Design and implement the user interface.

## Tasks

- [ ] Create wireframes and mockups
- [ ] Implement the UI components
- [ ] Ensure responsiveness and accessibility
- [ ] Test the UI thoroughly
```

---

## /public/firebase-config.js

```javascript
self.FIREBASE_CONFIG = {
  "apiKey": "AIzaSyB0V4iL1aQ_xtWeO_iWL1fuhu4_SLfqZeo",
  "authDomain": "geaux-academy.firebaseapp.com",
  "projectId": "geaux-academy",
  "messagingSenderId": "145629211979",
  "appId": "1:145629211979:web:1f9c854ecb392916adccce"
};
self.SSL_CONFIG = {
  "key": "-----BEGIN RSA PRIVATE KEY-----\r\nMIIEpAIBAAKCAQEApWa5H1wMifKEaAgvdLRM6PIxxS2tBVOwwvB4rG72cpdcsZsC\r\ntTkz5tlWhvz2drfep4FT21xjRlhIvzonaEy57F/ja0w6j3f1AnbBHeNEpRPEbN9G\r\nDcAvtlmYepcrmvIN0OTN/ICTtdggmfMn3kyoIgLEyLnaOAc5QmSRhpsUSBTnN5Mg\r\nl1FmM9bI+sbB61+ndFPKtRqi6YKlMVBcBPB3taO0BX2Gfx9ZKPypBdWuJgkLsWNK\r\n98mfXBwfRWXV9l2hXZwxL7VW/lKP/aa88hd+mkkMRXU+Z3VmqUXFZ+mV740IykoP\r\nYyH+suyrcT4Xy8Uth2m9JM3iYvQG0XAbemrgqwIDAQABAoIBADOi+jBcIF4ApG2G\r\nAKrCjzA6TGdudxGuqwRw5nuOuMnVj06zQgkprpZnS6gg2SD/DjflHDTjhuqzLSLm\r\nGN9q9LBizzD0P2QC4y69vFSEWy3eGfiTS9+HHF4lYoEDKM3au413oQcvbO3cZ3Eo\r\nhE3WSLc1fhHcU9AiETI1C2mmiJJn07fTLlEbCGlMqydefrTkRBMcf97pfeun9fta\r\n0w5FUFcLECkmzAQu1WIxEFxz32ipmZ/bVdqIyn2KucLTtT27VFldaiFEL/RmVn5B\r\nunoJMk3ZF/NLf8PypZFCu1LhK6jbE+hTIw51Zk27C9rvBp0Nss9HGZYPsgFjWUgK\r\nobWm9CECgYEA0Qbp5kTqP8gODufuAwj3CtAlFxMIfm7fnvf6J2xp/ct4b0wTbGw6\r\nrvdkf4TRSuKbc5J3OjVBib9A1dZaJBTMJZrKhr4gIlUoTfG0eJ++vLYmbimM1E6h\r\nHiuhK8t0a3x/+keWZFzCeQUJluoz0amdrwBEqkRH4ZE6gTaRJqIMLPUCgYEAypIR\r\n5zy3AlTl8yD9Z86aJe7l8YA4hQJLt/TCeyao0798G3s3fOIPVj+6Q3XactJntbtD\r\nR31uWLL2haxWUR5e26VeQmiYV/AbDpbHd0Y9LRuYz4Cc89aiamAConMccotj+2Y8\r\naMpPC+vUpXG7uliNsh23zmVJfkc49oXZ+swmUx8CgYBkZPKwo4bzDW4bILBDiunE\r\nqsY1t/GLcEs9ehMPHlYmDLUSl7J4j977rFz7llpDomVRdBaJwYxx0Ycdba+rxsVq\r\nhlchsm2Sr94E2cN5cBhXYRFCNfiq+/0MlZ36f+Sxv4FkPz/vglHxeEbr0h8DY3kV\r\n1YYlVVhE8dDswL2klY5NhQKBgQCu23W+0Cb9SUGRJCn5gFqJYfV1CIRBNCEeMpXp\r\n7g4Pchv0MOFN2Gj6v1nOP54IPV0ufu3tePVWdWzdKEz+CqRBHzcFRfoy9ly0tCyL\r\n5cKK/GZkv5U72ksqXaQIjCrDKVVtvetpXTDsjm5pPYqZqTTuyj5OWBofeeVOz23A\r\n0pZGawKBgQCluQuZa4mjpj+5ClxkOI0GH6i+rKtfB3W6TtLKUQJGtuMW+OJl9rIK\r\n/elabIvupBUzM0fLR/t7IQ6kaPBzUC/GzZSLu8kl41c9RlbTfV4u/2+xqeNOaGKK\r\nGAvbhPrZz398vZiYCEMMdVD2UTADgWpj7tmp98Mg9DhAkjwOMQx75Q==\r\n-----END RSA PRIVATE KEY-----\r\n",
  "cert": "-----BEGIN CERTIFICATE-----\r\nMIIDXzCCAkegAwIBAgIJFleoqQKXUF0fMA0GCSqGSIb3DQEBCwUAMEUxEjAQBgNV\r\nBAMTCWxvY2FsaG9zdDELMAkGA1UEBhMCVVMxIjAgBgNVBAoTGUdlYXV4IEFjYWRl\r\nbXkgRGV2ZWxvcG1lbnQwHhcNMjUwMjE1MDU1MzEzWhcNMjYwMjE1MDU1MzEzWjBF\r\nMRIwEAYDVQQDEwlsb2NhbGhvc3QxCzAJBgNVBAYTAlVTMSIwIAYDVQQKExlHZWF1\r\neCBBY2FkZW15IERldmVsb3BtZW50MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB\r\nCgKCAQEApWa5H1wMifKEaAgvdLRM6PIxxS2tBVOwwvB4rG72cpdcsZsCtTkz5tlW\r\nhvz2drfep4FT21xjRlhIvzonaEy57F/ja0w6j3f1AnbBHeNEpRPEbN9GDcAvtlmY\r\nepcrmvIN0OTN/ICTtdggmfMn3kyoIgLEyLnaOAc5QmSRhpsUSBTnN5Mgl1FmM9bI\r\n+sbB61+ndFPKtRqi6YKlMVBcBPB3taO0BX2Gfx9ZKPypBdWuJgkLsWNK98mfXBwf\r\nRWXV9l2hXZwxL7VW/lKP/aa88hd+mkkMRXU+Z3VmqUXFZ+mV740IykoPYyH+suyr\r\ncT4Xy8Uth2m9JM3iYvQG0XAbemrgqwIDAQABo1IwUDAMBgNVHRMEBTADAQH/MAsG\r\nA1UdDwQEAwIC9DAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwFAYDVR0R\r\nBA0wC4IJbG9jYWxob3N0MA0GCSqGSIb3DQEBCwUAA4IBAQAthOlIn9WyjfYnBvpO\r\nKfxhc2uD0GgFG9mwx7ICEdgudWwAcARA9GFtB0ZjlQqEVTwvl9iP7Hdm6Sl3x5Gh\r\nBnYiECUz+bNclj9qcfA9BT7wKmDUT9HxCuQc+xnoJWvDUjBEG999hg1VpJ+/iaCq\r\noE9LMRPw9AkzfYR0D0CC77yV0LxjdaNiCffLBABLVHThoomRvIrtaOqmlYxz8nPu\r\nUwrerNwo1Bk8ARbUO8WE6Vnml73XI1M8xJ9s81mF4HL0xSbQ9TawInQbps7+I3LT\r\nfEhDseeKLGDBQYTxv1Wqp9tE9uYcbFlcE4/TsyI8BgewiKVwIm7TTXx2hlauYPY9\r\niQw4\r\n-----END CERTIFICATE-----\r\n"
};
```

---

## /public/firebase-messaging-sw.js

```javascript
// File: public/firebase-messaging-sw.js
// Description: Modular Firebase Cloud Messaging service worker (background notifications)
// Author: GitHub Copilot
// Created: 2025-09-07
// Version: 2.1.1
// Registration example (in app code):
// navigator.serviceWorker.register(`/firebase-messaging-sw.js?${new URLSearchParams({ apiKey: ..., authDomain: ..., projectId: ..., storageBucket: ..., messagingSenderId: ..., appId: ... })}`, { type: 'module' });

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getMessaging, onBackgroundMessage } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-sw.js';

const params = new URL(self.location.href).searchParams;
const getParam = (k) => params.get(k) || '';
const firebaseConfig = {
  apiKey: getParam('apiKey'),
  authDomain: getParam('authDomain'),
  projectId: getParam('projectId'),
  storageBucket: getParam('storageBucket'),
  messagingSenderId: getParam('messagingSenderId'),
  appId: getParam('appId')
};

let messaging;
try {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
  console.info('[firebase-messaging-sw] init ok', { projectId: firebaseConfig.projectId });
} catch (err) {
  console.error('[firebase-messaging-sw] init failed', err);
}

if (messaging) {
  onBackgroundMessage(messaging, (payload) => {
    const title = payload?.notification?.title || 'Notification';
    const options = {
      body: payload?.notification?.body || '',
      icon: '/images/logo.svg',
      badge: '/images/logo.svg',
      tag: 'geaux-academy-notification',
      data: payload?.data || {}
    };
    self.registration.showNotification(title, options);
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.clickAction || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientsArr => {
      for (const client of clientsArr) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
      return null;
    })
  );
});

console.info('[firebase-messaging-sw] loaded');

// End of file
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
  * @license
  * Copyright 2020 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law | agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/analytics/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/analytics/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
   * in compliance with the License. You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under the License
   * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
   * or implied. See the License for the specific language governing permissions and limitations under
   * the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=firebase-messaging-sw.js.map
```

---

