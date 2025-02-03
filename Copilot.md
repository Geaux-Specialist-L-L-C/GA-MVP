# GitHub Copilot Guide for Geaux Academy

## File Organization

All files should be referenced with their complete paths:

```plaintext
/src/
  ├── components/
  │   ├── layout/
  │   │   ├── Header.jsx
  │   │   ├── Footer.jsx
  │   │   ├── Navigation.jsx
  │   │   └── Sidebar.jsx
  │   ├── home/
  │   │   ├── Hero.jsx
  │   │   ├── Features.jsx
  │   │   └── LearningStyles.jsx
  │   └── common/
  │       ├── Button.jsx
  │       └── Card.jsx
  └── pages/
      ├── Home.jsx
      ├── About.jsx
      ├── Features.jsx
      ├── Curriculum.jsx
      ├── LearningStyles.jsx
      └── Contact.jsx
```

## Styling Convention

The application uses styled-components exclusively for styling. No separate CSS files are needed as all styles are encapsulated within their respective components.

```jsx
```jsx
import styled from 'styled-components';

const StyledComponent = styled.div`
  // Component styles here
`;

import './styles.css';
```

## File Path Convention

When working with files, always reference the complete path from the project root. For example:

```jsx
import React from 'react';

import React from 'react';
```

## Component Structure

Each component should be organized as follows:

```jsx
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
