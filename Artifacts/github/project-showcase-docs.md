# Project Showcase Component Documentation

## Overview
The ProjectShowcase component is a feature-rich React component designed to display Geaux Specialist's AI solutions and chatbot implementations in an engaging, responsive layout. It provides a modern user interface for showcasing projects, their features, and company benefits.

## Installation

### Prerequisites
- Node.js 18 or higher
- React 18 or higher
- Tailwind CSS 3.0 or higher
- shadcn/ui components

### Required Dependencies
```bash
# Install shadcn/ui components
npm install @/components/ui/card
npm install @/components/ui/badge
npm install @/components/ui/tabs

# Install Lucide icons
npm install lucide-react@0.263.1
```

### Tailwind CSS Configuration
Ensure your `tailwind.config.js` includes the necessary configuration:

```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Any custom theme extensions
    },
  },
  plugins: [],
}
```

## Component Structure

### Main Components
```
ProjectShowcase/
├── ProjectShowcase.tsx      # Main component
├── types.ts                # TypeScript interfaces
└── components/            # Sub-components (if extracted)
    ├── ProjectCard.tsx
    ├── FeatureList.tsx
    └── BenefitsSection.tsx
```

### TypeScript Interfaces

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  tags: string[];
  demoUrl: string;
}

interface ProjectShowcaseProps {
  customProjects?: Project[];
  onDemoClick?: (projectId: string) => void;
  className?: string;
}
```

## Usage

### Basic Implementation
```jsx
import { ProjectShowcase } from './components/ProjectShowcase';

function App() {
  return (
    <div className="app">
      <ProjectShowcase />
    </div>
  );
}
```

### Custom Projects Implementation
```jsx
import { ProjectShowcase } from './components/ProjectShowcase';
import { Bot } from 'lucide-react';

const customProjects = [
  {
    id: 'custom-bot',
    title: 'Custom Assistant',
    description: 'Specialized AI assistant for your needs',
    icon: <Bot className="w-6 h-6" />,
    features: [
      'Custom feature 1',
      'Custom feature 2',
      'Custom feature 3',
      'Custom feature 4'
    ],
    tags: ['Custom', 'Specialized', 'AI'],
    demoUrl: '#'
  }
];

function App() {
  const handleDemoClick = (projectId) => {
    // Custom demo handling logic
    console.log(`Opening demo for ${projectId}`);
  };

  return (
    <div className="app">
      <ProjectShowcase 
        customProjects={customProjects}
        onDemoClick={handleDemoClick}
      />
    </div>
  );
}
```

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| customProjects | Project[] | undefined | Optional array of custom projects to display |
| onDemoClick | (projectId: string) => void | undefined | Optional callback for demo button clicks |
| className | string | undefined | Optional additional CSS classes |

### Default Projects
The component comes with four pre-configured projects:
1. Enterprise Assistant
2. Technical Support Bot
3. Research Assistant
4. Customer Service Bot

### Styling
The component uses Tailwind CSS classes for styling. Key style classes include:

```css
/* Container styles */
.container
.mx-auto
.px-4
.py-8

/* Grid layout */
.grid
.grid-cols-1
.md:grid-cols-2
.lg:grid-cols-2
.gap-6

/* Card styles */
.hover:shadow-lg
.transition-shadow
.duration-300
```

## Customization

### Adding New Projects
```typescript
const newProject: Project = {
  id: 'new-project',
  title: 'New Project Title',
  description: 'Project description',
  icon: <YourIcon className="w-6 h-6" />,
  features: [
    'Feature 1',
    'Feature 2',
    'Feature 3',
    'Feature 4'
  ],
  tags: ['Tag1', 'Tag2', 'Tag3'],
  demoUrl: '#'
};

// Add to customProjects array
```

### Modifying Card Styles
```jsx
<Card className="your-custom-classes hover:your-custom-hover">
  {/* Card content */}
</Card>
```

### Custom Icon Integration
```jsx
import { YourCustomIcon } from 'your-icon-library';

const customIcon = <YourCustomIcon className="w-6 h-6" />;
```

## Accessibility

The component implements several accessibility features:

1. Semantic HTML structure
2. ARIA labels for interactive elements
3. Keyboard navigation support
4. Color contrast compliance
5. Screen reader-friendly content structure

## Best Practices

1. **Project Data Management**
   - Keep project data in a separate file/database
   - Use TypeScript interfaces for type safety
   - Validate project data before rendering

2. **Performance**
   - Implement lazy loading for images
   - Use memo for expensive computations
   - Optimize icon imports

3. **Responsive Design**
   - Test across different screen sizes
   - Ensure text remains readable
   - Maintain proper spacing on mobile

4. **Error Handling**
   - Implement fallbacks for missing data
   - Handle loading states gracefully
   - Provide meaningful error messages

## Examples

### Integration with React Router
```jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProjectShowcase } from './components/ProjectShowcase';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/projects" element={<ProjectShowcase />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Adding Analytics
```jsx
import { ProjectShowcase } from './components/ProjectShowcase';
import { trackEvent } from './analytics';

function App() {
  const handleDemoClick = (projectId) => {
    trackEvent('demo_viewed', { projectId });
  };

  return <ProjectShowcase onDemoClick={handleDemoClick} />;
}
```

## Troubleshooting

### Common Issues

1. **Icons Not Displaying**
   ```
   Solution: Ensure Lucide React is properly installed and imported
   npm install lucide-react@0.263.1
   ```

2. **Styling Inconsistencies**
   ```
   Solution: Check Tailwind CSS configuration and class names
   ```

3. **Type Errors**
   ```
   Solution: Verify proper TypeScript interface implementation
   ```

## Contributing

When contributing to the ProjectShowcase component:

1. Follow the established code style
2. Add appropriate TypeScript types
3. Update documentation for new features
4. Add unit tests for new functionality
5. Test across different browsers and devices

## Future Enhancements

Planned improvements include:

1. Interactive demo modal system
2. Advanced filtering and search
3. Animation and transition effects
4. Integration with backend APIs
5. Enhanced analytics tracking
