# Geaux Specialist Chatbot API Documentation

## API Overview

Base URL: `https://api.geaux-specialist.com/v1`

### Authentication
All API requests require an API key passed in the header:
```
Authorization: Bearer your-api-key
```

### Rate Limiting
- 100 requests per minute for standard tier
- 1000 requests per minute for enterprise tier
- Rate limit headers included in responses:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1582834800
  ```

### Response Format
All responses follow the format:
```json
{
  "status": "success" | "error",
  "data": object | array | null,
  "error": {
    "code": string,
    "message": string
  } | null
}
```

## Enterprise Assistant API

### Create Conversation
```http
POST /enterprise/conversations
```

Request body:
```json
{
  "department": "hr" | "it" | "finance" | "sales",
  "initialMessage": string,
  "userData": {
    "userId": string,
    "role": string,
    "permissions": string[]
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "conversationId": string,
    "department": string,
    "createdAt": string,
    "context": object
  }
}
```

### Send Message
```http
POST /enterprise/conversations/{conversationId}/messages
```

Request body:
```json
{
  "message": string,
  "attachments": Array<{
    "type": "file" | "image" | "document",
    "url": string,
    "metadata": object
  }>,
  "context": {
    "workflowId": string?,
    "stepId": string?
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "messageId": string,
    "response": string,
    "actions": Array<{
      "type": "button" | "form" | "workflow",
      "data": object
    }>,
    "workflow": {
      "status": "active" | "completed" | "pending",
      "nextStep": object?
    }
  }
}
```

### Get Workflows
```http
GET /enterprise/workflows
```

Query parameters:
- `department`: string
- `status`: "active" | "completed" | "all"
- `limit`: number
- `offset`: number

Response:
```json
{
  "status": "success",
  "data": {
    "workflows": Array<{
      "id": string,
      "name": string,
      "department": string,
      "steps": Array<{
        "id": string,
        "name": string,
        "requiredRole": string,
        "status": "pending" | "completed" | "blocked"
      }>,
      "status": "active" | "completed",
      "createdAt": string,
      "updatedAt": string
    }>,
    "pagination": {
      "total": number,
      "limit": number,
      "offset": number
    }
  }
}
```

## Technical Support Bot API

### Analyze Code
```http
POST /technical/analyze
```

Request body:
```json
{
  "code": string,
  "language": string,
  "context": {
    "framework": string?,
    "dependencies": Array<{
      "name": string,
      "version": string
    }>,
    "environment": object?
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "analysis": {
      "language": string,
      "issues": Array<{
        "type": "error" | "warning" | "suggestion",
        "message": string,
        "line": number,
        "column": number,
        "severity": number
      }>,
      "suggestions": Array<{
        "description": string,
        "code": string?,
        "documentation": string?
      }>,
      "references": Array<{
        "type": "documentation" | "stackoverflow" | "github",
        "url": string,
        "relevance": number
      }>
    }
  }
}
```

### Search Documentation
```http
GET /technical/docs/search
```

Query parameters:
- `query`: string
- `sources`: Array<"github" | "docs" | "stackoverflow">
- `language`: string?
- `framework`: string?
- `limit`: number
- `offset`: number

Response:
```json
{
  "status": "success",
  "data": {
    "results": Array<{
      "title": string,
      "source": "github" | "docs" | "stackoverflow",
      "url": string,
      "content": string,
      "relevance": number,
      "metadata": {
        "author": string?,
        "datePublished": string?,
        "votes": number?,
        "views": number?
      }
    }>,
    "pagination": {
      "total": number,
      "limit": number,
      "offset": number
    }
  }
}
```

### Create Issue
```http
POST /technical/issues
```

Request body:
```json
{
  "title": string,
  "description": string,
  "type": "bug" | "feature" | "question",
  "priority": "low" | "medium" | "high",
  "labels": string[],
  "attachments": Array<{
    "type": string,
    "url": string
  }>,
  "assignees": string[]
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "issueId": string,
    "url": string,
    "status": "open",
    "createdAt": string
  }
}
```

## Research Assistant API

### Start Research
```http
POST /research/projects
```

Request body:
```json
{
  "topic": string,
  "field": string,
  "parameters": {
    "methodology": "qualitative" | "quantitative" | "mixed",
    "dateRange": {
      "start": string,
      "end": string
    },
    "sources": Array<"academic" | "journals" | "books" | "web">,
    "languages": string[]
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "projectId": string,
    "status": "initiated",
    "estimatedDuration": number,
    "phases": Array<{
      "name": string,
      "status": "pending" | "active" | "completed",
      "estimatedCompletion": string
    }>
  }
}
```

### Analyze Dataset
```http
POST /research/analysis
```

Request body:
```json
{
  "dataset": {
    "type": "csv" | "json" | "excel",
    "url": string | {
      "data": Array<object>
    }
  },
  "analysis": {
    "type": Array<"descriptive" | "inferential" | "predictive">,
    "variables": Array<{
      "name": string,
      "type": "numerical" | "categorical" | "temporal",
      "role": "independent" | "dependent"
    }>,
    "methods": Array<"regression" | "classification" | "clustering">
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "analysisId": string,
    "results": {
      "summary": object,
      "visualizations": Array<{
        "type": string,
        "data": object,
        "metadata": object
      }>,
      "insights": Array<{
        "description": string,
        "confidence": number,
        "support": object
      }>,
      "exports": {
        "pdf": string,
        "csv": string,
        "json": string
      }
    }
  }
}
```

## Customer Service Bot API

### Initialize Chat
```http
POST /customer-service/chats
```

Request body:
```json
{
  "customerId": string,
  "language": string,
  "channel": "web" | "mobile" | "email",
  "context": {
    "history": Array<{
      "type": "interaction" | "purchase" | "support",
      "timestamp": string,
      "data": object
    }>,
    "preferences": object
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "chatId": string,
    "token": string,
    "supportedFeatures": Array<string>,
    "suggestedResponses": Array<{
      "text": string,
      "confidence": number
    }>
  }
}
```

### Send Customer Message
```http
POST /customer-service/chats/{chatId}/messages
```

Request body:
```json
{
  "message": string,
  "attachments": Array<{
    "type": string,
    "url": string
  }>,
  "sentiment": {
    "score": number,
    "labels": string[]
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "messageId": string,
    "response": {
      "text": string,
      "type": "text" | "quick_replies" | "buttons" | "template",
      "components": Array<{
        "type": string,
        "data": object
      }>,
      "context": {
        "intent": string,
        "confidence": number,
        "entities": Array<{
          "type": string,
          "value": string,
          "confidence": number
        }>
      }
    },
    "actions": Array<{
      "type": string,
      "data": object
    }>
  }
}
```

### Create Ticket
```http
POST /customer-service/tickets
```

Request body:
```json
{
  "chatId": string,
  "customerId": string,
  "issue": {
    "type": string,
    "description": string,
    "priority": "low" | "medium" | "high",
    "category": string
  },
  "metadata": {
    "source": string,
    "tags": string[],
    "attachments": Array<{
      "type": string,
      "url": string
    }>
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "ticketId": string,
    "status": "created",
    "assignedTo": string?,
    "estimatedResponse": string,
    "priority": string
  }
}
```

## Webhooks

### Register Webhook
```http
POST /webhooks
```

Request body:
```json
{
  "url": string,
  "events": Array<"message.created" | "workflow.completed" | "ticket.updated">,
  "secret": string,
  "metadata": {
    "description": string?,
    "version": string?
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "webhookId": string,
    "status": "active",
    "createdAt": string
  }
}
```

### Webhook Payload Format
```json
{
  "id": string,
  "timestamp": string,
  "type": string,
  "data": object,
  "signature": string
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `auth_error` | Authentication failed |
| `invalid_request` | Invalid request parameters |
| `rate_limit_exceeded` | Rate limit exceeded |
| `resource_not_found` | Requested resource not found |
| `service_error` | Internal service error |
| `validation_error` | Request validation failed |

## SDK Examples

### Node.js
```javascript
const GeauxSpecialist = require('geaux-specialist-node');

const client = new GeauxSpecialist({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Enterprise Assistant
const conversation = await client.enterprise.createConversation({
  department: 'hr',
  initialMessage: 'Need help with onboarding'
});

// Technical Support
const analysis = await client.technical.analyzeCode({
  code: sourceCode,
  language: 'javascript'
});

// Research Assistant
const research = await client.research.startProject({
  topic: 'AI Ethics',
  field: 'Computer Science'
});

// Customer Service
const chat = await client.customerService.initializeChat({
  customerId: 'customer-123',
  language: 'en'
});
```

### Python
```python
from geaux_specialist import Client

client = Client(
    api_key='your-api-key',
    environment='production'
)

# Enterprise Assistant
conversation = client.enterprise.create_conversation(
    department='hr',
    initial_message='Need help with onboarding'
)

# Technical Support
analysis = client.technical.analyze_code(
    code=source_code,
    language='python'
)

# Research Assistant
research = client.research.start_project(
    topic='AI Ethics',
    field='Computer Science'
)

# Customer Service
chat = client.customer_service.initialize_chat(
    customer_id='customer-123',
    language='en'
)
```

## Testing

### Test Environment
```
Base URL: https://api-test.geaux-specialist.com/v1
API Key: test-api-key
```

### Test Data
```json
{
  "customers": [
    {
      "id": "test-customer-1",
      "email": "test@example.com"
    }
  ],
  "workflows": [
    {
      "id": "test-workflow-1",
      "name": "Test Workflow"
    }
  ]
}
```

## Best Practices

1. **Error Handling**
   - Always check response status
   - Implement exponential backoff for retries
   - Log detailed error information

2. **Rate Limiting**
   - Monitor rate limit headers
   - Implement request queuing
   - Use bulk endpoints when possible

3. **Authentication**
   - Rotate API keys regularly
   - Use environment variables
   - Implement key expiration handling

4. **Webhooks**
   - Verify webhook signatures
   - Implement retry logic
   - Store webhook events

## Migration Guides

### v1 to v2 Migration
```javascript
// Old v1 format
client.sendMessage({
  text: message
});

// New v2 format
client.messages.create({
  content: message,
  metadata: {}
});
```

## Support

- Documentation: https://docs.geaux-specialist.com
- API Status: https://status.geaux-specialist.com
- Support Email: api-support@geaux-specialist.com

