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
✔ **Follow Rollup + Prettier formatting**  
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

## Development Roadmap Completion Status

From your React Application Structure and Content - Part 1, I've reviewed the Development Guide, Development Plan, and README.md to check which roadmap tasks are complete and what remains.

✅ Phase 1: Foundation (Week 1-2)
Task	Status
Project setup and configuration	✅ Completed
Basic authentication flow	✅ Completed (Firebase Auth)
Core UI components	⏳ In Progress
- Navigation	❌ Not Started
- Layout system	❌ Not Started
- Theme implementation	✅ Completed (Styled Components)
Basic Firebase integration	⏳ In Progress
Test environment setup	❌ Not Started

✅ Phase 2: Core Features (Week 3-4)
Task	Status
Learning Style Assessment	⏳ In Progress
- Chat interface implementation	✅ Completed (Chat Component)
- OpenAI integration	✅ Completed (API Key Setup)
- Response analysis system	❌ Not Started
- Results storage and retrieval	✅ Completed (Firestore Integration)
User Profile System	⏳ In Progress
- Profile creation/editing	✅ Completed
- Learning style data integration	⏳ Partially Done
- Progress tracking	❌ Not Started

⏳ Phase 3: Learning Experience (Week 5-6)
Task	Status
Content Management	⏳ In Progress
- Learning material organization	❌ Not Started
- Content adaptation based on VARK	❌ Not Started
- Resource recommendation engine	❌ Not Started
Progress Tracking	❌ Not Started
- Analytics dashboard	❌ Not Started
- Performance metrics	❌ Not Started
- Learning path visualization	❌ Not Started

❌ Phase 4: Enhancement (Week 7-8)
Task	Status
Advanced Features	❌ Not Started
- Real-time collaboration	❌ Not Started
- Interactive exercises	❌ Not Started
- Peer learning features	❌ Not Started
Performance Optimization	❌ Not Started
- Caching implementation	❌ Not Started
- Load time optimization	❌ Not Started
- API efficiency improvements	❌ Not Started

📌 Summary of Completion

✅ Completed (40%)

    Authentication System (Firebase)
    Theme Implementation (Styled Components)
    Chat Interface for Learning Assessment
    OpenAI API Integration
    Profile Creation & Editing
    Results Storage in Firestore

⏳ In Progress (30%)

    Basic Firebase Integration
    Navigation & Layout System
    Learning Style Data Integration
    Core UI Components
    Content Management System

❌ Not Started (30%)

    Progress Tracking & Analytics
    Learning Path Visualization
    Advanced Features (Collaboration, Exercises, Peer Learning)
    Performance Optimization (Caching, Load Time, API Efficiency)

🚀 Next Steps & Prioritization
1️⃣ Complete Phase 1

    Navigation System (Sidebar, Top Bar)
    Layout System (Parent Dashboard, Student Dashboard)
    Basic Firebase Integration (Firestore, Storage)
    Unit Test Setup (Jest, React Testing Library)

2️⃣ Advance Phase 2

    Learning Style Analysis (CrewAI & NLP Integration)
    Progress Tracking & Reports
    Curriculum Adaptation Based on VARK Learning Style

3️⃣ Introduce Phase 3

    Content Recommendation Engine
    Analytics & Performance Dashboard
    Interactive Learning Paths Visualization

## Note on TypeScript and JSX Syntax Errors

All TypeScript and JSX syntax errors have been fixed in the affected files, and all JSX elements now have corresponding closing tags.
