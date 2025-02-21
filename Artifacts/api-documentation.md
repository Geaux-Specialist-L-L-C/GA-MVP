# Geaux Academy Assessment API
Version: 1.0.0

## Overview

The Geaux Academy Assessment API provides a comprehensive interface for managing learning style assessments, student interactions, and adaptive content delivery. This RESTful API supports real-time updates through WebSocket connections and integrates with Firebase for authentication and data persistence.

## Base URL
```
Production: https://api.geauxacademy.com/v1
Development: https://dev-api.geauxacademy.com/v1
```

## Authentication

All API requests require authentication using Firebase JWT tokens. Include the token in the Authorization header:

```typescript
const headers = {
  'Authorization': `Bearer ${firebaseToken}`,
  'Content-Type': 'application/json'
};
```

## Core Types

```typescript
interface AssessmentSession {
  id: string;
  studentId: string;
  startTime: FirebaseTimestamp;
  status: 'active' | 'completed' | 'paused';
  currentSection: AssessmentSection;
  metrics: AssessmentMetrics;
}

interface AssessmentMetrics {
  styleConfidence: number;
  engagementScore: number;
  progressRate: number;
  adaptationLevel: number;
  timestamp: FirebaseTimestamp;
}

interface LearningStyle {
  primary: string;
  secondary: string[];
  confidence: number;
  lastUpdated: FirebaseTimestamp;
}

interface StudentResponse {
  questionId: string;
  response: string | number;
  timeSpent: number;
  confidence: number;
  metadata: ResponseMetadata;
}
```

## Endpoints

### Assessment Management

#### Create Assessment Session
```typescript
POST /assessments
Content-Type: application/json

Request:
{
  studentId: string;
  gradeLevel: string;
  initialDifficulty?: 'easy' | 'medium' | 'hard';
  preferences?: AssessmentPreferences;
}

Response:
{
  sessionId: string;
  initialQuestion: Question;
  configuration: AssessmentConfig;
}
```

#### Submit Response
```typescript
POST /assessments/{sessionId}/responses
Content-Type: application/json

Request:
{
  response: StudentResponse;
  metadata: {
    timeZone: string;
    deviceInfo: DeviceInfo;
    contextual: ContextualData;
  };
}

Response:
{
  nextQuestion?: Question;
  adaptations?: ContentAdaptation[];
  feedback: FeedbackResponse;
  metrics: AssessmentMetrics;
}
```

#### Get Assessment Progress
```typescript
GET /assessments/{sessionId}/progress

Response:
{
  completionRate: number;
  currentSection: AssessmentSection;
  metrics: AssessmentMetrics;
  recommendations: Recommendation[];
  nextMilestone: Milestone;
}
```

### Learning Style Analysis

#### Get Learning Style Profile
```typescript
GET /students/{studentId}/learning-style

Response:
{
  primary: LearningStyle;
  secondary: LearningStyle[];
  confidence: number;
  evidence: StyleEvidence[];
  recommendations: StyleRecommendation[];
}
```

#### Update Learning Style
```typescript
PATCH /students/{studentId}/learning-style
Content-Type: application/json

Request:
{
  updates: Partial<LearningStyle>;
  evidence: StyleEvidence[];
}

Response:
{
  updated: LearningStyle;
  changes: StyleChange[];
  impact: StyleImpact;
}
```

### Content Adaptation

#### Get Adapted Content
```typescript
GET /content/{contentId}/adapt
Query Parameters:
  studentId: string
  context: string
  difficulty: string

Response:
{
  content: AdaptedContent;
  modifications: ContentModification[];
  rationale: AdaptationRationale;
}
```

#### Submit Content Interaction
```typescript
POST /content/{contentId}/interactions
Content-Type: application/json

Request:
{
  studentId: string;
  interactionType: InteractionType;
  duration: number;
  outcome: InteractionOutcome;
}

Response:
{
  recorded: boolean;
  impact: InteractionImpact;
  suggestions: InteractionSuggestion[];
}
```

## WebSocket Events

Connect to WebSocket for real-time updates:
```typescript
const ws = new WebSocket('wss://api.geauxacademy.com/ws');

// Event Types
interface WSEvent {
  type: 'assessment' | 'adaptation' | 'engagement';
  payload: any;
  timestamp: number;
}

// Assessment Updates
ws.on('assessment.update', (event: WSEvent) => {
  const { metrics, adaptations } = event.payload;
  // Handle real-time assessment updates
});

// Engagement Tracking
ws.on('engagement.track', (event: WSEvent) => {
  const { level, indicators } = event.payload;
  // Handle engagement updates
});
```

## Error Handling

The API uses standard HTTP status codes and returns detailed error information:

```typescript
interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: number;
}

// Example error response
{
  "error": {
    "code": "ASSESSMENT_NOT_FOUND",
    "message": "Assessment session not found",
    "details": {
      "sessionId": "invalid_id"
    },
    "timestamp": 1645564789
  }
}
```

## Rate Limiting

- Standard tier: 100 requests per minute
- Premium tier: 1000 requests per minute
- Enterprise tier: Custom limits

## SDK Integration

### React Integration
```typescript
import { useAssessment } from '@geaux/assessment-sdk';

const AssessmentComponent: React.FC = () => {
  const {
    session,
    submitResponse,
    trackEngagement,
    adaptContent
  } = useAssessment({
    studentId,
    onUpdate: handleUpdate,
    onError: handleError
  });

  // Handle response submission
  const handleSubmit = async (response: StudentResponse) => {
    try {
      const result = await submitResponse(response);
      // Handle result
    } catch (error) {
      // Handle error
    }
  };

  return (
    <AssessmentContext.Provider value={session}>
      <AssessmentInterface onSubmit={handleSubmit} />
    </AssessmentContext.Provider>
  );
};
```

### Firebase Integration
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { AssessmentAPI } from '@geaux/assessment-sdk';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const api = new AssessmentAPI({
  firestore: db,
  baseUrl: 'https://api.geauxacademy.com/v1',
  options: {
    caching: true,
    realtime: true
  }
});
```

## Security Considerations

1. Authentication
   - All requests must include a valid Firebase JWT token
   - Tokens are validated on each request
   - Role-based access control is enforced

2. Data Protection
   - All data is encrypted in transit (TLS 1.3)
   - Sensitive data is encrypted at rest
   - GDPR and FERPA compliance built-in

3. Rate Limiting
   - Per-user and per-endpoint limits
   - Graduated backoff for excessive requests
   - DDoS protection

## Best Practices

1. Error Handling
```typescript
try {
  const response = await api.submitResponse(studentResponse);
  handleSuccess(response);
} catch (error) {
  if (error instanceof AssessmentError) {
    handleAssessmentError(error);
  } else {
    handleGenericError(error);
  }
}
```

2. Real-time Updates
```typescript
const unsubscribe = api.subscribeToUpdates(sessionId, {
  onUpdate: (update) => {
    handleUpdate(update);
  },
  onError: (error) => {
    handleError(error);
  },
  filter: {
    types: ['metrics', 'adaptations'],
    minConfidence: 0.8
  }
});
```

3. Batch Operations
```typescript
const batchUpdate = await api.createBatch();

responses.forEach(response => {
  batchUpdate.addResponse(response);
});

await batchUpdate.commit();
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Support

For API support and questions:
- Documentation: https://docs.geauxacademy.com/api
- Email: api-support@geauxacademy.com
- Status: https://status.geauxacademy.com

