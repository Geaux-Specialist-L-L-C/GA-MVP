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
