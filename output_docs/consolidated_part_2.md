# Consolidated Files (Part 2)

## .github/task.md

```
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

## .github/.eslintrc.js

```
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

## .github/copilot-instructions.md

```
Here's the optimized **`.github/copilot-instructions.md`** file for **GitHub Copilot** to follow when assisting with code generation in the **Geaux Academy** project.

---

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
```

---

### **� Updates & Enhancements**
✅ **Refined structure for clarity and consistency**  
✅ **Improved React, TypeScript, and FastAPI best practices**  
✅ **Updated security & authentication guidelines** (JWT, Firestore RBAC)  
✅ **Expanded testing guidelines** (Mock API requests, unit tests)  
✅ **Added structured file placement rules** (where Copilot should insert code)  

� **Now, GitHub Copilot will generate clean, secure, and scalable code that aligns perfectly with Geaux Academy's development workflow!** �
```

## .github/ISSUE_TEMPLATE/ui-setup.md

```
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

## .github/ISSUE_TEMPLATE/api-setup.md

```
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

## .github/ISSUE_TEMPLATE/database-setup.md

```
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

## .github/ISSUE_TEMPLATE/custom.md

```

```

## .github/ISSUE_TEMPLATE/feature_request.md

```

```

## .github/ISSUE_TEMPLATE/setup-authentication.md

```
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

## .github/ISSUE_TEMPLATE/bug_report.md

```

```

## src/index.tsx

```
// File: /src/index.tsx
// Description: Entry point for the React application, setting up providers and routing.
// Author: GitHub Copilot
// Created: [Date]

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import App from './App';
import ErrorBoundary from './components/shared/ErrorBoundary';
import './index.css';

// Listen for auth service worker status events
window.addEventListener('firebase-auth-worker-status', (event: Event) => {
  const { success, isSecure, error } = (event as CustomEvent).detail;
  if (!success) {
    console.warn(
      'Auth service worker initialization status:', 
      { success, isSecure, error }
    );
  }
});

// Listen for auth errors from service worker
window.addEventListener('firebase-auth-error', (event: Event) => {
  const { error, fallbackToRedirect } = (event as CustomEvent).detail;
  console.error('Firebase auth error:', error);
  if (fallbackToRedirect) {
    console.info('Falling back to redirect method for authentication');
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ProfileProvider>
            <App />
          </ProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

```

## src/index.css

```
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #333;
  background-color: #fff;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* Primary Colors */
  --primary-color: #D4AF37;      /* Rich Gold */
  --secondary-color: #2C3E50;    /* Dark Blue-Gray */
  --accent-color: #E67E22;       /* Warm Orange */
  
  /* Background Colors */
  --background-color: #ffffff;    /* White */
  --background-alt: #F8F9FA;     /* Light Gray */
  --header-bg: #2C3E50;          /* Dark Blue-Gray */
  
  /* Text Colors */
  --text-primary: #2C3E50;       /* Dark Blue-Gray */
  --text-secondary: #595959;     /* Medium Gray */
  --text-light: #ffffff;         /* White */
  
  /* Button Colors */
  --btn-primary-bg: #D4AF37;     /* Gold */
  --btn-primary-text: #FFFFFF;   /* White */
  --btn-secondary-bg: #2C3E50;   /* Dark Blue-Gray */
  --btn-secondary-text: #FFFFFF; /* White */
  --btn-hover-bg: #C19B26;       /* Darker Gold */
  
  /* Interactive Elements */
  --hover-color: #B8860B;        /* Darker Gold */
  --active-color: #DAA520;       /* Lighter Gold */
  --link-color: #D4AF37;         /* Gold */
  
  /* Success/Error States */
  --success-color: #2ECC71;      /* Green */
  --warning-color: #F1C40F;      /* Yellow */
  --error-color: #E74C3C;        /* Red */
  
  --max-width: 1200px;
  --header-height: 64px;
  --text-color: #333;
  --light-bg: #f5f5f5;
  --container-padding: 2rem;
  
  /* Transitions */
  --transition-speed: 0.3s;
  --transition-timing: ease;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* New Variable */
  --sidebar-width: 250px;

  /* Navbar Variables */
  --navbar-height: 64px;
  --navbar-bg: white;
  --navbar-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  color: var(--text-primary);  /* Fix incorrect variable name from --text-light-color */
  padding-top: var(--header-height); /* Set consistent padding for header */
  background: var(--background-color);
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

#root {
  min-height: 100vh;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}

/* Header Specific Styles */
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--header-bg);
  height: var(--header-height);
  z-index: 1000;
  box-shadow: var(--shadow-sm);
}

/* Container Layout */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* Main Content Styles */
.main-content {
  padding-top: var(--header-height);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}

```

## src/App.css

```
/* Reset box-sizing */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#root {
  width: 100%;
  min-height: 100vh;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

/* Add vendor prefixes for animations */
@-webkit-keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

.app {
  min-height: 100vh;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  padding-top: var(--header-height, 64px); /* Add padding for fixed header */
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: var(--max-width, 1200px);
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: calc(100vh - var(--header-height) - var(--footer-height, 0px));
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
    margin-left: 0;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  #root {
    padding: 1rem;
  }
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

```

## src/App.tsx

```
import React, { useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import PrivateRoute from './components/PrivateRoute';
import { muiTheme, styledTheme } from './theme/theme';
import ErrorBoundary from './components/shared/ErrorBoundary';

// Lazy load components with explicit types
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Features = React.lazy(() => import('./pages/Features'));
const Login = React.lazy(() => import('./pages/Login'));
const SignUp = React.lazy(() => import('./components/auth/SignUp'));
const LearningStyles = React.lazy(() => import('./pages/LearningStyles'));
const Curriculum = React.lazy(() => import('./pages/Curriculum'));
const ParentDashboard = React.lazy(() => import('./pages/profile/ParentProfile/ParentDashboard'));
const StudentDashboard = React.lazy(() => import('./pages/profile/StudentProfile/StudentDashboard'));
const StudentProfile = React.lazy(() => import('./pages/profile/StudentProfile/StudentProfile'));
const LearningPlan = React.lazy(() => import('./pages/LearningPlan'));
const TakeAssessment = React.lazy(() => import('./pages/TakeAssessment'));
const LearningStyleChat = React.lazy(() => import('./components/chat/LearningStyleChat'));
const TestChat = React.lazy(() => import('./components/chat/TestChat'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const App: React.FC = (): JSX.Element => {
  // Register service worker for Firebase messaging
  useEffect(() => {
    const registerServiceWorker = async (): Promise<void> => {
      if (!('serviceWorker' in navigator) || 
          (!window.isSecureContext && process.env.NODE_ENV !== 'development')) {
        console.debug('Service Worker registration skipped - requires HTTPS or development environment');
        return;
      }

      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/__/auth/',
          // Removed type: 'module' to support importScripts in firebase-messaging-sw.js
          updateViaCache: process.env.NODE_ENV === 'development' ? 'none' : 'imports'
        });
        console.debug('Service Worker registered with scope:', registration.scope);
      } catch (error) {
        const logMethod = process.env.NODE_ENV === 'production' ? console.error : console.warn;
        logMethod('Service Worker registration failed:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    void registerServiceWorker();
  }, []);
  
  return (
    <ErrorBoundary>
      <MUIThemeProvider theme={muiTheme}>
        <StyledThemeProvider theme={styledTheme}>
          <AppContainer>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route element={<Layout />}>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/learning-styles" element={<LearningStyles />} />
                  <Route path="/curriculum" element={<Curriculum />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
                  <Route path="/parent-dashboard" element={<PrivateRoute><ParentDashboard /></PrivateRoute>} />
                  <Route path="/student-dashboard/:id" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
                  <Route path="/student-profile/:id" element={<PrivateRoute><StudentProfile /></PrivateRoute>} />
                  <Route path="/learning-plan" element={<PrivateRoute><LearningPlan /></PrivateRoute>} />
                  <Route path="/assessment/:studentId" element={<PrivateRoute><TakeAssessment /></PrivateRoute>} />
                  <Route path="/learning-style-chat/:studentId" element={<PrivateRoute><LearningStyleChat /></PrivateRoute>} />
                  <Route path="/test-chat" element={<PrivateRoute><TestChat /></PrivateRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </AppContainer>
        </StyledThemeProvider>
      </MUIThemeProvider>
    </ErrorBoundary>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

export default App;

```

## src/env.d.ts

```
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_DATABASE_URL: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_MAX_AUTH_RETRIES: string;
  readonly VITE_USE_SECURE_COOKIES: string;
  readonly VITE_AUTH_PERSISTENCE: string;
  readonly VITE_AUTH_POPUP_FALLBACK: string;
  readonly VITE_SERVICE_WORKER_TIMEOUT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## src/main.tsx

```
// File: /home/wicked/geauxai/GA-MVP/src/main.tsx
// Description: Main entry point for the React application
// Author: GitHub Copilot
// Created: 2024-02-12

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import App from './App';
import ErrorBoundary from './components/shared/ErrorBoundary';
import './index.css';

// Configure future flags for React Router v7
const router = createBrowserRouter([
  {
    path: "/*",
    element: (
      <ErrorBoundary>
        <AuthProvider>
          <ProfileProvider>
            <App />
          </ProfileProvider>
        </AuthProvider>
      </ErrorBoundary>
    ),
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

// Listen for auth service worker status events
window.addEventListener('firebase-auth-worker-status', (event: Event) => {
  const { success, isSecure, error } = (event as CustomEvent).detail;
  if (!success) {
    console.warn(
      'Auth service worker initialization status:', 
      { success, isSecure, error }
    );
  }
});

// Listen for auth errors from service worker
window.addEventListener('firebase-auth-error', (event: Event) => {
  const { error, fallbackToRedirect } = (event as CustomEvent).detail;
  console.error('Firebase auth error:', error);
  if (fallbackToRedirect) {
    console.info('Falling back to redirect method for authentication');
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
```

## src/pages/Contact.tsx

```
// File: /src/pages/Contact.tsx
// Description: Contact page component providing contact information and a contact form.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Contact Us</h1>
      <p className="mt-4">Feel free to reach out to us with any questions or feedback.</p>
    </div>
  );
};

export default Contact;

```

## src/pages/Login.tsx

```
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login: React.FC = () => {
  const { loginWithGoogle, loading: authLoading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [localError, setLocalError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof clearError === 'function') {
      clearError();
    }
  }, [clearError]);

  const handleDismissError = () => {
    setLocalError('');
    if (typeof clearError === 'function') {
      clearError();
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLocalError('');
      setLoading(true);
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to sign in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Welcome Back</Title>
        {(localError || authError) && (
          <ErrorMessage>
            <span>{localError || authError}</span>
            <DismissButton 
              onClick={handleDismissError}
              type="button"
              aria-label="Dismiss error message"
            >✕</DismissButton>
          </ErrorMessage>
        )}
        
        <GoogleButton 
          onClick={handleGoogleLogin} 
          disabled={loading}
          type="button"
          aria-label="Sign in with Google"
        >
          <FcGoogle />
          Sign in with Google
        </GoogleButton>
        <SignUpPrompt>
          Don't have an account? <StyledLink to="/signup">Sign up</StyledLink>
        </SignUpPrompt>
      </LoginBox>
    </LoginContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 20px;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: white;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SignUpPrompt = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #666;
`;

const StyledLink = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c00;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: #c00;
  cursor: pointer;
  padding: 0 0.5rem;
  
  &:hover {
    opacity: 0.7;
  }
`;

export default Login;

```

## src/pages/NotFound.tsx

```
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const NotFound: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Login error:', err);
    }
  };

  return (
    <NotFoundContainer>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for might have been removed or doesn't exist.</p>
      <StyledLink to="/">Return to Home</StyledLink>
      <GoogleButton onClick={handleGoogleLogin}>
        <FcGoogle className="text-xl" />
        Sign in with Google
      </GoogleButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;

  h1 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: var(--text-color);
  }
`;

const StyledLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
`;

export default NotFound;
```

## src/pages/Features.tsx

```
// File: /src/pages/Features.tsx
// Description: Features page component highlighting the key features of Geaux Academy.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';

const Features: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Features</h1>
      <ul className="mt-4 list-disc list-inside">
        <li>AI-powered learning style assessment</li>
        <li>Personalized learning paths</li>
        <li>Real-time progress tracking</li>
        <li>Interactive dashboard</li>
      </ul>
    </div>
  );
};

export default Features;

```

## src/pages/Home.tsx

```
import React, { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { FaGraduationCap, FaChartLine, FaLightbulb } from "react-icons/fa";

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  background-color: #f5f5f5;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 0;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  h1 {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.5rem;
    color: var(--text-color);
    margin-bottom: 2rem;
  }
`;

const HeroImage = styled.img`
  max-width: 100%;
  height: auto;
  margin: 2rem auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 1rem;
`;

const FlipContainer = styled.div`
  perspective: 1000px;
  height: 200px;
`;

const FlipInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  cursor: pointer;

  &:hover {
    transform: rotateY(180deg);
  }
`;

const FlipFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FlipBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: var(--primary-color);
  color: white;
  transform: rotateY(180deg);
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const CallToAction = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  margin: 2rem 0;

  h2 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
    color: var(--text-color);
    margin-bottom: 2rem;
  }
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin: 2rem 0;
  padding: 2rem;

  p {
    margin-bottom: 1rem;
    color: var(--text-color);
  }
`;

const GoogleLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 auto;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  margin-top: 1rem;
  text-align: center;
`;

interface FlipCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ icon, title, description }) => {
  return (
    <FlipContainer>
      <FlipInner className="flip">
        <FlipFront>
          <IconWrapper>{icon}</IconWrapper>
          <h3>{title}</h3>
        </FlipFront>
        <FlipBack>
          <p>{description}</p>
        </FlipBack>
      </FlipInner>
    </FlipContainer>
  );
};

const features: Feature[] = [
  { icon: <FaGraduationCap />, title: "Expert Instruction", description: "Learn from industry professionals." },
  { icon: <FaChartLine />, title: "Track Progress", description: "Monitor your growth with analytics." },
  { icon: <FaLightbulb />, title: "Interactive Learning", description: "Engage with hands-on exercises." },
];

const Home: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleLogin = async (): Promise<void> => {
    try {
      setError("");
      await login();
      navigate("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Login error:", error);
    }
  };

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <h1>Welcome to Geaux Academy</h1>
          <p>Empowering Personalized Learning through AI</p>
          <HeroImage src="/images/hero-learning.svg" alt="Learning illustration" />
        </HeroContent>
      </HeroSection>

      <FeaturesGrid>
        {features.map((feature, index) => (
          <FlipCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </FeaturesGrid>

      <CallToAction>
        <h2>Ready to Start Your Learning Journey?</h2>
        <p>Join Geaux Academy today and unlock your full potential.</p>
        <GoogleLoginSection>
          <p>Sign in with Google to get started</p>
          <GoogleLoginButton onClick={handleLogin}>
            <img src="/google-icon.svg" alt="Google" width="24" height="24" />
            Sign in with Google
          </GoogleLoginButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </GoogleLoginSection>
      </CallToAction>
    </Container>
  );
};

export default memo(Home);

```

## src/pages/LearningPlan.tsx

```
import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

interface Subject {
  name: string;
  description: string;
  activities: string[];
}

interface UserData {
  learningStyle: string;
  grade: string;
  learningPlan: Subject[];
}

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const LearningPlan: React.FC = () => {
  const { currentUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [learningStyle, setLearningStyle] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, [currentUser]);

  const fetchUserProfile = async (): Promise<void> => {
    if (!currentUser?.uid) return;
    
    try {
      const userRef = doc(firestore, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as UserData;
        setLearningStyle(userData.learningStyle || "");
        setGrade(userData.grade || "");
        setSubjects(userData.learningPlan || []);
      }
    } catch (error) {
      setError("Failed to load user profile");
      console.error("Error:", error);
    }
  };

  const generateLearningPlan = async (): Promise<void> => {
    if (!currentUser) {
      setError("Please sign in first");
      return;
    }
    
    if (!learningStyle || !grade) {
      setError("Please complete your profile first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: `Create a learning plan for a ${grade} grade student with ${learningStyle} learning style.`
          }],
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const newPlan = JSON.parse(data.choices[0].message.content);
      
      await saveToFirestore(newPlan);
      setSubjects(newPlan);
    } catch (error) {
      setError("Failed to generate learning plan");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveToFirestore = async (plan: Subject[]): Promise<void> => {
    if (!currentUser) {
      throw new Error("User must be signed in");
    }
    
    try {
      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, {
        learningPlan: plan
      });
    } catch (error) {
      throw new Error("Failed to save learning plan");
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Personalized Learning Plan</h1>
      
      {error && (
        <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="mb-4">
          <p>Learning Style: <span className="font-semibold">{learningStyle}</span></p>
          <p>Grade Level: <span className="font-semibold">{grade}</span></p>
        </div>

        <button
          onClick={generateLearningPlan}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Learning Plan"}
        </button>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FcGoogle className="text-xl" />
        Sign in with Google
      </button>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6">
          {subjects.map((subject, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">{subject.name}</h3>
              <p className="text-gray-600 mb-2">{subject.description}</p>
              <ul className="list-disc list-inside">
                {subject.activities.map((activity, idx) => (
                  <li key={idx} className="text-gray-700">{activity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPlan;

```

## src/pages/Curriculum.tsx

```
// File: /src/pages/Curriculum.tsx
// Description: Curriculum page component outlining the learning curriculum.
// Author: GitHub Copilot
// Created: 2023-10-10

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import CourseCard from "../components/CourseCard";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
  image?: string;
}

const Curriculum: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<'elementary' | 'middle' | 'high'>('middle');
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    try {
      setError('');
      await login();
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Login error:', error);
    }
  };

  const subjects: Course[] = [
    {
      id: '1',
      title: 'Mathematics',
      description: 'Core mathematics curriculum covering algebra, geometry, and more.',
      level: selectedGrade,
      duration: '9 months',
      type: 'Video Animated',
      category: 'math'
    },
    {
      id: '2',
      title: 'Science',
      description: 'Comprehensive science program including biology, chemistry, and physics.',
      level: selectedGrade,
      duration: '9 months',
      type: 'Video Animated',
      category: 'science'
    }
    // Add more courses as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Curriculum</h1>
      <p className="mt-4">Our curriculum is designed to adapt to your learning style and pace.</p>

      <div className="flex justify-center gap-4 mt-8">
        <button 
          className={`px-4 py-2 rounded ${selectedGrade === 'elementary' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} 
          onClick={() => setSelectedGrade('elementary')}
        >
          Elementary School
        </button>
        <button 
          className={`px-4 py-2 rounded ${selectedGrade === 'middle' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} 
          onClick={() => setSelectedGrade('middle')}
        >
          Middle School
        </button>
        <button 
          className={`px-4 py-2 rounded ${selectedGrade === 'high' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} 
          onClick={() => setSelectedGrade('high')}
        >
          High School
        </button>
      </div>

      {error && <div className="text-red-500 bg-red-100 p-2 rounded mt-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {subjects.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>

      <div className="text-center mt-16 p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold">Ready to Start Learning?</h2>
        <p className="mt-4">Join our platform to access the full curriculum and personalized learning paths.</p>
        <button 
          className="flex items-center gap-2 px-4 py-2 border rounded mt-4" 
          onClick={handleLogin}
        >
          <FcGoogle />
          <span>Sign in with Google to Get Started</span>
        </button>
      </div>
    </div>
  );
};

export default Curriculum;

```

## src/pages/VarkStyles.tsx

```
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaEye, FaHeadphones, FaBookReader, FaRunning } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface LearningStyle {
  icon: JSX.Element;
  title: string;
  description: string;
  characteristics: string[];
}

const VarkStyles: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Login error:", err);
    }
  };

  const styles: LearningStyle[] = [
    {
      icon: <FaEye />,
      title: "Visual Learning",
      description: "Learn through seeing and observing",
      characteristics: [
        "Prefer diagrams and charts",
        "Remember visual details",
        "Benefit from visual aids",
        "Excel with graphic organizers"
      ]
    },
    {
      icon: <FaHeadphones />,
      title: "Auditory Learning",
      description: "Learn through listening and speaking",
      characteristics: [
        "Excel in discussions",
        "Remember spoken information",
        "Benefit from lectures",
        "Learn through verbal repetition"
      ]
    },
    {
      icon: <FaBookReader />,
      title: "Read/Write Learning",
      description: "Learn through written words",
      characteristics: [
        "Enjoy reading materials",
        "Take detailed notes",
        "Prefer written instructions",
        "Learn through writing summaries"
      ]
    },
    {
      icon: <FaRunning />,
      title: "Kinesthetic Learning",
      description: "Learn through doing and experiencing",
      characteristics: [
        "Learn by doing",
        "Prefer hands-on activities",
        "Remember through practice",
        "Benefit from role-playing"
      ]
    }
  ];

  return (
    <Container>
      <Header>
        <m.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Your VARK Learning Style
        </m.h1>
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Understanding how you learn best is the first step to academic success
        </m.p>
      </Header>

      <StylesGrid>
        {styles.map((style, index) => (
          <StyleCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <IconWrapper>{style.icon}</IconWrapper>
            <h2>{style.title}</h2>
            <p>{style.description}</p>
            <CharacteristicsList>
              {style.characteristics.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </CharacteristicsList>
          </StyleCard>
        ))}
      </StylesGrid>

      <CTASection>
        <h2>Ready to optimize your learning journey?</h2>
        <p>Take our assessment to discover your learning style and get personalized recommendations.</p>
        <ButtonGroup>
          <PrimaryButton to="/signup">Get Started Now</PrimaryButton>
          <SecondaryButton to="/about">Learn More</SecondaryButton>
        </ButtonGroup>
      </CTASection>

      <GoogleLoginSection>
        <GoogleButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </GoogleLoginSection>
    </Container>
  );
};

const Container = styled(m.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Header = styled(m.header)`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
  }

  p {
    font-size: 1.25rem;
    color: var(--text-color);
  }
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StyleCard = styled(m.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const CharacteristicsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;

  li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;

    &:before {
      content: "•";
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 3rem;
  background: var(--background-alt);
  border-radius: 12px;

  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const GoogleButton = styled.button`
  background-color: #4285f4;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

export default VarkStyles;

```

## src/pages/TakeAssessment.tsx

```
import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { getStudentProfile, updateStudentAssessmentStatus } from "../services/profileService";
import type { Student } from '../types/student';
import styled from 'styled-components';
import LearningStyleChat from '../components/chat/LearningStyleChat';

const TakeAssessment: React.FC = () => {
  const { currentUser } = useAuth();
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async (): Promise<void> => {
      if (!studentId || !currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const studentProfile = await getStudentProfile(studentId);
        if (!studentProfile || !studentProfile.id) {
          setError("Student profile not found");
        } else {
          setStudent({
            ...studentProfile,
            id: studentProfile.id
          });
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
        setError("Failed to load student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [currentUser, studentId]);

  const handleAssessmentCompletion = async (): Promise<void> => {
    if (!studentId) {
      setError("Student ID is required");
      return;
    }

    try {
      setLoading(true);
      await updateStudentAssessmentStatus(studentId, "completed");
      setStudent(prev => prev ? { ...prev, hasTakenAssessment: true } : null);
    } catch (error) {
      console.error("Error completing assessment:", error);
      setError("Failed to complete assessment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Loading assessment...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  if (!student) {
    return <ErrorContainer>No student found</ErrorContainer>;
  }

  return (
    <AssessmentContainer>
      <Header>
        <h1>Learning Style Assessment</h1>
        <StudentName>for {student.name}</StudentName>
      </Header>

      <ContentSection>
        <p>Chat with our AI assistant to help determine your learning style. The assistant will ask you questions and analyze your responses to identify the learning style that best suits you.</p>
        <LearningStyleChat />
      </ContentSection>

      <ActionSection>
        <CompleteButton 
          onClick={handleAssessmentCompletion}
          disabled={loading}
        >
          {loading ? "Completing..." : "Complete Assessment"}
        </CompleteButton>
      </ActionSection>
    </AssessmentContainer>
  );
};

const AssessmentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
`;

const StudentName = styled.h2`
  font-size: 1.25rem;
  color: var(--text-color);
`;

const ContentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: center;
`;

const CompleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.1rem;
  color: var(--text-color);
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background-color: #fee2e2;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
`;

export default TakeAssessment;

```

