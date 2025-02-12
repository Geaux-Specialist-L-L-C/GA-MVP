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
