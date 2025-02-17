# React Application Structure and Content - Part 12

Generated on: 2025-02-17 09:19:40

## /react_codebase_part1.md

```markdown
# React Application Structure and Content - Part 1

Generated on: 2025-02-17 09:19:40

## /DEVELOPMENT_GUIDE.md

```markdown
# Development Guide

## Architecture Overview

### Frontend
- React 18+ with TypeScript
- Vite for build tooling
- Firebase SDK for auth/storage
- Context API + Redux for state management
- Styled Components & CSS Modules

### Backend
- Python FastAPI backend
- Firebase Authentication
- Firestore Database
- OpenAI integration for chat

## Development Roadmap

### Phase 1: Foundation (Week 1-2)
- [x] Project setup and configuration
- [x] Basic authentication flow
- [ ] Core UI components
  - [ ] Navigation
  - [ ] Layout system
  - [ ] Theme implementation
- [ ] Basic Firebase integration
- [ ] Test environment setup

### Phase 2: Core Features (Week 3-4)
- [ ] Learning Style Assessment
  - [ ] Chat interface implementation
  - [ ] OpenAI integration
  - [ ] Response analysis system
  - [ ] Results storage and retrieval
- [ ] User Profile System
  - [ ] Profile creation/editing
  - [ ] Learning style data integration
  - [ ] Progress tracking

### Phase 3: Learning Experience (Week 5-6)
- [ ] Content Management
  - [ ] Learning material organization
  - [ ] Content adaptation based on VARK
  - [ ] Resource recommendation engine
- [ ] Progress Tracking
  - [ ] Analytics dashboard
  - [ ] Performance metrics
  - [ ] Learning path visualization

### Phase 4: Enhancement (Week 7-8)
- [ ] Advanced Features
  - [ ] Real-time collaboration
  - [ ] Interactive exercises
  - [ ] Peer learning features
- [ ] Performance Optimization
  - [ ] Caching implementation
  - [ ] Load time optimization
  - [ ] API efficiency improvements

## Development Guidelines

### Code Organization
```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── contexts/      # React contexts
├── services/      # API/Firebase services
├── store/         # Redux store
└── utils/         # Helpers and utilities
```

### Coding Standards
- Use TypeScript for type safety
- Follow ESLint configuration
- Write unit tests for critical components
- Document complex functions and components

### Git Workflow
1. Create feature branch from `develop`
2. Follow conventional commits
3. Submit PR with description
4. Require review approval
5. Squash merge to `develop`

### Testing Strategy
- Unit tests for utilities and hooks
- Integration tests for major features
- E2E tests for critical user flows
- Regular security testing

### Performance Targets
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse score > 90
- API response time < 200ms

## Environment Setup

### Development Environment
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

### Firebase Configuration
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

### OpenAI Integration
Required for chat features:
```
VITE_OPENAI_API_KEY
VITE_OPENAI_MODEL
```

## Deployment

### Staging Deployment
1. Merge to `develop`
2. Automatic deployment to staging
3. Run integration tests
4. Manual QA review

### Production Deployment
1. Create release branch
2. Version bump
3. Generate changelog
4. Deploy to production
5. Tag release

## Monitoring

### Key Metrics
- User engagement metrics
- Learning effectiveness
- System performance
- Error rates

### Logging
- Application logs in Firebase
- Error tracking in Sentry
- Performance monitoring in Firebase Performance

## Support and Documentation

### Internal Resources
- API Documentation
- Component Storybook
- Architecture diagrams
- Test coverage reports

### External Resources
- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
```

---

## /Developmentplan.md

```markdown
# Development Plan

## Project Overview
Geaux Academy is an innovative educational platform designed to provide personalized learning experiences for students. The platform leverages advanced technologies such as AI and machine learning to tailor educational content to individual learning styles, ensuring that each student can learn at their own pace and in their own way.

## Goals
1. **Personalized Learning Paths**: Develop a system that creates customized learning paths for each student based on their unique learning style and progress.
2. **Interactive Content**: Integrate interactive and engaging content to enhance the learning experience.
3. **Progress Tracking**: Implement a robust progress tracking system to monitor student performance and provide feedback.
4. **Scalability**: Ensure the platform can scale to accommodate a growing number of users without compromising performance.
5. **Security**: Implement strong security measures to protect user data and ensure privacy.

## Milestones
1. **MVP Launch** (Q1 2023)
   - Complete core features: personalized learning paths, interactive content, and progress tracking.
   - Conduct initial user testing and gather feedback.
2. **User Feedback Integration** (Q2 2023)
   - Analyze user feedback and make necessary improvements.
   - Enhance user interface and user experience based on feedback.
3. **Scalability Improvements** (Q3 2023)
   - Optimize the platform for scalability.
   - Implement load testing and performance enhancements.
4. **Security Enhancements** (Q4 2023)
   - Conduct a comprehensive security audit.
   - Implement additional security measures based on audit findings.
5. **Full Launch** (Q1 2024)
   - Launch the fully optimized and secure platform to the public.
   - Initiate marketing and user acquisition campaigns.

## Timeline
- **Q1 2023**: MVP Launch
- **Q2 2023**: User Feedback Integration
- **Q3 2023**: Scalability Improvements
- **Q4 2023**: Security Enhancements
- **Q1 2024**: Full Launch
```

---

## /README.md

```markdown
# Geaux Academy

An interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery.

## Quick Start

### Prerequisites
- Node.js (v18+)
- Firebase CLI (`npm install -g firebase-tools`)

### Installation
1. Clone and install:
   ```bash
   git clone <repository-url>
   cd GA-MVP
   npm install
   ```

2. Configure environment:
   Create `.env` file with Firebase configuration (see `.env.example`)

3. Start development:
   ```bash
   npm run dev    # Start dev server
   ```

Visit `http://localhost:5173` for development.

## Key Features
- AI-powered learning style assessment through interactive chat
- Personalized learning paths based on VARK model
- Real-time progress tracking
- Google authentication
- Interactive dashboard for students and educators

## Documentation
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Detailed setup, architecture, and development roadmap
- [Component Structure](./src/components/README.md) - UI component documentation
- [API Documentation](./backend/README.md) - Backend API reference

## Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run deploy   # Deploy to Firebase
```

## Contributing
See [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) for detailed development instructions and roadmap.

## License
[MIT License](LICENSE)
```

---

## /TIPI_DEVELOPMENT.md

```markdown
# TIPI Development Guide

## Prerequisites

- Docker installed and running
- Node.js 16+ and npm
- TIPI CLI (optional but recommended)

## Getting Started

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

## Troubleshooting

### Common Issues

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

### Development Tips

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

## Development Workflow

1. Start TIPI container
2. Run development server
3. Initialize Cheshire service (automatic on app start)
4. Monitor logs for connection issues
5. Use CheshireService.checkTipiHealth() to verify connection

## API Integration

The Cheshire Cat service automatically handles:
- Connection management
- Authentication
- Retries on failure
- Error handling with detailed logs

See `src/services/cheshireService.ts` for implementation details.
```

---

## /brandColors.js

```javascript
// brandColors.js
export default {
    primaryGold: '#C29A47',
    deepGoldAccent: '#8C6B4D',
    black: '#000000',
    neutral: '#F5F3F0',
    highlight: '#FFF8E7',}
```

---

## /database.rules.json

```json
{
  /* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

---

## /devcontainer.json

```json
{
  "name": "Geaux Academy Dev Container",
  "dockerFile": "Dockerfile",
  "context": ".",
  "appPort": [3000, 5000],
  "runArgs": ["--env-file", ".env"],
  "customizations": {
    "vscode": {
      "settings": {
        "terminal.integrated.shell.linux": "/bin/bash"
      },
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-azuretools.vscode-docker",
        "ms-vscode.vscode-typescript-tslint-plugin"
      ]
    }
  },
  "postCreateCommand": "npm install",
  "remoteEnv": {
    "VITE_FIREBASE_API_KEY": "${localEnv:VITE_FIREBASE_API_KEY}",
    "VITE_FIREBASE_AUTH_DOMAIN": "${localEnv:VITE_FIREBASE_AUTH_DOMAIN}",
    "VITE_FIREBASE_PROJECT_ID": "${localEnv:VITE_FIREBASE_PROJECT_ID}",
    "VITE_FIREBASE_STORAGE_BUCKET": "${localEnv:VITE_FIREBASE_STORAGE_BUCKET}",
    "VITE_FIREBASE_MESSAGING_SENDER_ID": "${localEnv:VITE_FIREBASE_MESSAGING_SENDER_ID}",
    "VITE_FIREBASE_APP_ID": "${localEnv:VITE_FIREBASE_APP_ID}",
    "VITE_FIREBASE_MEASUREMENT_ID": "${localEnv:VITE_FIREBASE_MEASUREMENT_ID}",
    "VITE_FIREBASE_DATABASE_URL": "${localEnv:VITE_FIREBASE_DATABASE_URL}",
    "VITE_OPENAI_API_KEY": "${localEnv:VITE_OPENAI_API_KEY}",
    "VITE_CHESHIRE_API_URL": "${localEnv:VITE_CHESHIRE_API_URL}",
    "VITE_CHESHIRE_API_TOKEN": "${localEnv:VITE_CHESHIRE_API_TOKEN}",
    "VITE_CHESHIRE_API_TOKEN_TYPE": "${localEnv:VITE_CHESHIRE_API_TOKEN_TYPE}",
    "VITE_CHESHIRE_ADMIN_USERNAME": "${localEnv:VITE_CHESHIRE_ADMIN_USERNAME}",
    "VITE_CHESHIRE_ADMIN_PASSWORD": "${localEnv:VITE_CHESHIRE_ADMIN_PASSWORD}",
    "VITE_CHESHIRE_DEBUG": "${localEnv:VITE_CHESHIRE_DEBUG}",
    "REACT_APP_AZURE_ENDPOINT": "${localEnv:REACT_APP_AZURE_ENDPOINT}",
    "REACT_APP_MODEL_NAME": "${localEnv:REACT_APP_MODEL_NAME}",
    "REACT_APP_AZURE_API_KEY": "${localEnv:REACT_APP_AZURE_API_KEY}",
    "AGENTOPS_API_KEY": "${localEnv:AGENTOPS_API_KEY}",
    "ANTHROPIC_API_KEY": "${localEnv:ANTHROPIC_API_KEY}",
    "AWS_ACCESS_KEY_ID": "${localEnv:AWS_ACCESS_KEY_ID}",
    "AWS_SECRET_ACCESS_KEY": "${localEnv:AWS_SECRET_ACCESS_KEY}",
    "DATABASE_URL": "${localEnv:DATABASE_URL}",
    "DB_USERNAME": "${localEnv:DB_USERNAME}",
    "DB_PASSWORD": "${localEnv:DB_PASSWORD}",
    "GROQ_API_KEY": "${localEnv:GROQ_API_KEY}",
    "SERPER_SEARCH": "${localEnv:SERPER_SEARCH}",
    "SUPERABASE_SERVICE_KEY": "${localEnv:SUPERABASE_SERVICE_KEY}",
    "TWILIO_AUTH_TOKEN": "${localEnv:TWILIO_AUTH_TOKEN}",
    "REPLICATE": "${localEnv:REPLICATE}",
    "WEBSITE_URL": "${localEnv:WEBSITE_URL}"
  }
}
```

---

## /eslint.config.js

```javascript
// File: /eslint.config.js
// Description: ESLint flat configuration for Geaux Academy

import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  // Global ignore patterns
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/dataconnect-generated/**",
      "**/*.d.ts",
      "**/public/**/*.js"  // Ignore plain JS files in public
    ]
  },

  // Handle JSX files in public directory separately
  {
    files: ["public/**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        jsx: true,
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        React: "readonly"
      }
    },
    plugins: {
      react: reactPlugin
    },
    rules: {
      "react/react-in-jsx-scope": "off"
    },
    settings: {
      react: { version: "detect" }
    }
  },

  // Base configuration for all JavaScript files
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    ignores: ["public/**"],  // Skip files already handled
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        jsx: true
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly"
      }
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin
    },
    rules: {
      "react-hooks/rules-of-hooks": "warn", // Changed from error to warn
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }], // Changed from error to warn
      "import/order": [
        "warn", // Changed from error to warn
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc" }
        }
      ]
    },
    settings: { 
      react: { version: "detect" }
    }
  },

  // TypeScript-specific configuration
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }], // Changed from error to warn
      "@typescript-eslint/explicit-function-return-type": ["warn", { 
        allowExpressions: true, 
        allowTypedFunctionExpressions: true 
      }],
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "warn", // Changed from error to warn
      "react-hooks/exhaustive-deps": "warn"
    },
    settings: {
      react: { version: "detect" }
    }
  }
];
```

---

## /firebase.json

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "dataconnect": {
    "source": "dataconnect"
  },
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "predeploy": [
        "npm --prefix \"$RESOURCE_DIR\" run build"
      ]
    }
  ],
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Content-Security-Policy",
            "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://*.firebase.com https://apis.google.com https://www.googletagmanager.com https://*.gstatic.com; connect-src 'self' https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://firebaseinstallations.googleapis.com https://www.googleapis.com; frame-src 'self' https://*.firebaseapp.com https://*.firebase.com https://accounts.google.com https://apis.google.com; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; worker-src 'self' blob: 'unsafe-inline'; manifest-src 'self';"
          },
          {
            "key": "Cross-Origin-Opener-Policy",
            "value": "same-origin-allow-popups"
          },
          {
            "key": "Cross-Origin-Embedder-Policy",
            "value": "unsafe-none"
          },
          {
            "key": "Cross-Origin-Resource-Policy",
            "value": "cross-origin"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "Permissions-Policy",
            "value": "accelerometer=(), autoplay=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(self), usb=(), web-share=(), xr-spatial-tracking=()"
          }
        ]
      },
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|gif|webp|svg|woff|woff2)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/firebase-messaging-sw.js",
        "headers": [
          {
            "key": "Service-Worker-Allowed",
            "value": "/"
          },
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          },
          {
            "key": "Content-Type",
            "value": "application/javascript; charset=utf-8"
          }
        ]
      },
      {
        "source": "/__/auth/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  },
  "remoteconfig": {
    "template": "remoteconfig.template.json"
  },
  "database": {
    "rules": "database.rules.json"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "pubsub": {
      "port": 8085
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "host": "localhost",
      "port": 4000
    }
  }
}
```

---

## /firestore.indexes.json

```json
{
  "indexes": [],
  "fieldOverrides": []
}
```

---

## /index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" crossorigin="anonymous" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Geaux Academy</title>
    <!-- Security Headers -->
    <meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups" />
    <meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp" />
    <meta http-equiv="Cross-Origin-Resource-Policy" content="same-site" />
    <!-- CSP -->
    <meta http-equiv="Content-Security-Policy" content="
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseio.com https://*.firebase.com https://*.googleapis.com https://*.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com;
      connect-src 'self' https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com https://*.googleapis.com https://firestore.googleapis.com wss://firestore.googleapis.com https://*.google-analytics.com https://*.googletagmanager.com;
      frame-src 'self' https://*.firebaseapp.com https://*.firebase.com https://accounts.google.com https://*.googleapis.com;
      img-src 'self' data: https: blob:;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      worker-src 'self' blob: 'unsafe-inline';
    " />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## /instructions.md

```markdown
```markdown
# **GitHub Copilot Request Instructions**

This document provides **guidelines and best practices** for using **GitHub Copilot** to generate code for the **Geaux Academy** project. **All AI-generated code should align with the project's conventions** to ensure consistency, maintainability, and adherence to best practices.

---

## **Overview**
Geaux Academy is an **interactive learning platform** built using:
- **Frontend**: React, TypeScript, Vite, Firebase Authentication
- **Backend**: FastAPI, Firestore, and Python
- **State Management**: Context API & Redux
- **Styling**: Styled Components or Tailwind CSS
- **Testing**: Jest & React Testing Library for unit tests, Cypress for E2E tests
- **CI/CD**: GitHub Actions for linting, testing, and deployment automation

**Copilot-generated content must adhere to the following guidelines:**
✅ **Code Quality**: Modular, readable, and well-commented  
✅ **File Headers**: Every file must start with a header comment (**see template below**)  
✅ **TypeScript Best Practices**: Explicit types for props, state, and functions  
✅ **Import Paths**: Use **absolute imports (`@/components/...`)** where applicable  
✅ **Documentation**: Include inline comments, JSDoc, and meaningful variable names  
✅ **Security**: Ensure **proper authentication handling** and **RBAC in API routes**  
✅ **Testing**: Generate **unit tests** (`.test.tsx` or `.test.py`) for all new components and APIs  

---

## **File Header Template**
All files must include the following **standard header** at the top:

```tsx
// File: /relative/path/filename.ext
// Description: [Brief description of the file's purpose]
// Author: [Your Name]
// Created: [Date]
```

---

## **Copilot Usage Guidelines**

### **Component Development (React)**
- **Always use functional components (`.tsx`)**  
- **Use proper TypeScript typings** (`Props`, `State`, `Event Handlers`)  
- **Follow project styling conventions** (Styled Components or Tailwind CSS)  
- **Avoid inline styles unless absolutely necessary**  

✅ Example **Good Component**:
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

❌ **Bad Example:**
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

### **Backend & API Development (FastAPI)**
- **Follow RESTful API principles**  
- **Use `Pydantic` models for validation**  
- **Secure endpoints with JWT authentication & role-based access control (RBAC)**  
- **Implement error handling with proper HTTP status codes**  

✅ Example **FastAPI Endpoint**:
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

❌ **Bad Example:**  
❌ **No authentication or error handling**  
❌ **No response model, making the API unpredictable**  
```python
@router.get("/user")
def get_user():
        return {"user": "John Doe"}
```

---

### **Unit Testing Guidelines**
- **Create test files** with naming conventions like `ComponentName.test.tsx` or `api_route.test.py`
- **Ensure coverage for all edge cases** (valid, invalid inputs)
- **Mock API requests using `Mock Service Worker (MSW)`**

✅ Example **React Unit Test**:
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

✅ Example **FastAPI Unit Test**:
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

## **File Structure Consistency**
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

## **Copilot Request Format**
When submitting a **Copilot request**, always provide:

1️⃣ **A clear description** of the feature or function you need  
2️⃣ **The intended file path** or directory for the new code  
3️⃣ **Context on how it integrates with existing code**  

✅ **Example Prompt**:
```plaintext
"Create a new React component at /src/components/ProfileCard.tsx that displays a user's profile.
Include proper TypeScript types for props and a unit test for this component."
```

❌ **Bad Prompt**:
```plaintext
"Make a profile component."
```
_(Too vague; lacks context on file path, TypeScript, testing, or expected functionality.)_

---

## **Summary: What Copilot Should Always Follow**
✔ **Strict TypeScript best practices**  
✔ **Use absolute imports from `@/src`**  
✔ **Ensure API security (JWT, RBAC, Firestore rules)**  
✔ **Follow ESLint + Prettier formatting**  
✔ **Write unit tests (`.test.tsx` or `.test.py`) for all new code**  
✔ **Use Tailwind CSS or Styled Components for styling**  

By following these instructions, GitHub Copilot will generate code that aligns with Geaux Academy's development standards.
```
```

---

## /jest.config.js

```javascript
/** @type {import('jest').Config} */
// File: /jest.config.js
// Description: Jest configuration file for the project.

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.json' }],
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }]
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@mui/(.*)$': '<rootDir>/node_modules/@mui/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@mui|@emotion|react-icons)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '\\.d\\.ts$'
  ],
  watchPathIgnorePatterns: ['node_modules', 'dist', '.git']
};
```

---
```

---

