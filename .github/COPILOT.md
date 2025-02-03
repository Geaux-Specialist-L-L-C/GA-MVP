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
