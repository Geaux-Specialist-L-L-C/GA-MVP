# React Application Structure and Content - Part 5

Generated on: 2025-02-17 09:09:44

## /public/JSX/Layout.jsx

```jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <LayoutContainer>
      {!isAuthPage && (
        <Header>
          <HeaderLeft>
            {currentUser && (
              <MenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                ☰
              </MenuButton>
            )}
            <Logo>Geaux Academy</Logo>
          </HeaderLeft>
          <NavLinks>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/features">Features</NavLink>
            <NavLink to="/curriculum">Curriculum</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </NavLinks>
        </Header>
      )}

      <Content>
        {currentUser && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )}
        <MainContent $isSidebarOpen={isSidebarOpen && currentUser}>
          {children}
        </MainContent>
      </Content>
    </LayoutContainer>
  );
};

/* Styled Components */
const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  width: 100%;
  background: #fff;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #ddd;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 15px;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-weight: 600;
  color: #333;

  &:hover {
    color: #007bff;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  display: block;
`;

const Content = styled.div`
  display: flex;
  height: 100vh;
  margin-top: 60px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  transition: margin-left 0.3s ease-in-out;
  margin-left: ${({ $isSidebarOpen }) => ($isSidebarOpen ? "250px" : "0px")};

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

export default Layout;
```

---

## /public/JSX/ts3.jsx

```jsx
import React from 'react';

const PlaceholderComponent = () => {
  return (
    <div>
      <p>This is a placeholder component with a simple message.</p>
    </div>
  );
};

export default PlaceholderComponent;
```

---

## /.github/.eslintrc.js

```javascript
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

---

## /.github/CONTRIBUTING.md

```markdown

```

---

## /.github/COPILOT.md

```markdown
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
```

---

## /.github/catapi.md

```markdown
v1.8.0OAS 3.1.0
😸 Cheshire-Cat API
Download OpenAPI Document
Production ready AI assistant framework

Server
Base URL
Selected:
https://cheshire.geaux.app

Authentication
Optional

Auth Type
No authentication selected
Client Libraries
Curl Shell
Home​#Copy link to "Home"
HomeEndpoints
GET
/
POST
/message
Status​#Copy link to "Status"
Server status

Responses
Expand
200
Successful Response
application/json
GET
/
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/

Test Request
(get /)
200
Copy content
{}
Successful Response

Message With Cat​#Copy link to "Message With Cat"
Get a response from the Cat

Body
application/json
object
default: 
{ "text": "hello!" }
Responses
Expand
200
Successful Response
application/json
Expand
422
Validation Error
application/json
POST
/message
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/message \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "text": "hello!"
}'

Test Request
(post /message)
200
422
Copy content
{
  "user_id": "…",
  "when": 1,
  "who": "AI",
  "text": "…",
  "image": "…",
  "audio": "…",
  "type": "chat",
  "why": {
    "input": "…",
    "intermediate_steps": [],
    "memory": {},
    "model_interactions": [
      {
        "model_type": "llm",
        "source": "…",
        "prompt": "…",
        "input_tokens": 1,
        "started_at": 1,
        "reply": "…",
        "output_tokens": 1,
        "ended_at": 1
      }
    ],
    "ANY_ADDITIONAL_PROPERTY": "anything"
  },
  "message": "…",
  "content": "…",
  "ANY_ADDITIONAL_PROPERTY": "anything"
}
Successful Response

User Auth​#Copy link to "User Auth"
User AuthEndpoints
GET
/auth/available-permissions
POST
/auth/token
Get Available Permissions​#Copy link to "Get Available Permissions"
Returns all available resources and permissions.

Responses
Expand
200
Successful Response
application/json
GET
/auth/available-permissions
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/auth/available-permissions

Test Request
(get /auth/available-permissions)
200
Copy content
{
  "ANY_ADDITIONAL_PROPERTY": [
    "WRITE"
  ]
}
Successful Response

Auth Token​#Copy link to "Auth Token"
Endpoint called from client to get a JWT from local identity provider. This endpoint receives username and password as form-data, validates credentials and issues a JWT.

Body
application/json
username
string
required
password
string
required
Responses
Expand
200
Successful Response
application/json
Expand
422
Validation Error
application/json
POST
/auth/token
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/auth/token \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "username": "",
  "password": ""
}'

Test Request
(post /auth/token)
200
422
Copy content
{
  "access_token": "…",
  "token_type": "bearer"
}
Successful Response

Users​#Copy link to "Users"
UsersEndpoints
POST
/users/
GET
/users/
GET
/users/{user_id}
PUT
/users/{user_id}
DELETE
/users/{user_id}
Show More
Settings​#Copy link to "Settings"
SettingsEndpoints
GET
/settings/
POST
/settings/
GET
/settings/{settingId}
PUT
/settings/{settingId}
DELETE
/settings/{settingId}
Show More
Large Language Model​#Copy link to "Large Language Model"
Large Language ModelEndpoints
GET
/llm/settings
GET
/llm/settings/{languageModelName}
PUT
/llm/settings/{languageModelName}
Show More
Embedder​#Copy link to "Embedder"
EmbedderEndpoints
GET
/embedder/settings
GET
/embedder/settings/{languageEmbedderName}
PUT
/embedder/settings/{languageEmbedderName}
Show More
Plugins​#Copy link to "Plugins"
PluginsEndpoints
GET
/plugins/
POST
/plugins/upload
POST
/plugins/upload/registry
PUT
/plugins/toggle/{plugin_id}
GET
/plugins/settings
GET
/plugins/settings/{plugin_id}
PUT
/plugins/settings/{plugin_id}
GET
/plugins/{plugin_id}
DELETE
/plugins/{plugin_id}
Show More
Vector Memory - Points​#Copy link to "Vector Memory - Points"
Vector Memory - PointsEndpoints
GET
/memory/recall
POST
/memory/recall
POST
/memory/collections/{collection_id}/points
DELETE
/memory/collections/{collection_id}/points
GET
/memory/collections/{collection_id}/points
DELETE
/memory/collections/{collection_id}/points/{point_id}
PUT
/memory/collections/{collection_id}/points/{point_id}
Show More
Vector Memory - Collections​#Copy link to "Vector Memory - Collections"
Vector Memory - CollectionsEndpoints
GET
/memory/collections
DELETE
/memory/collections
DELETE
/memory/collections/{collection_id}
Show More
Working Memory - Current Conversation​#Copy link to "Working Memory - Current Conversation"
Working Memory - Current ConversationEndpoints
GET
/memory/conversation_history
DELETE
/memory/conversation_history
Show More
Rabbit Hole​#Copy link to "Rabbit Hole"
Rabbit HoleEndpoints
POST
/rabbithole/
POST
/rabbithole/batch
POST
/rabbithole/web
POST
/rabbithole/memory
GET
/rabbithole/allowed-mimetypes
Show More
AuthHandler​#Copy link to "AuthHandler"
AuthHandlerEndpoints
GET
/auth_handler/settings
GET
/auth_handler/settings/{auth_handler_name}
PUT
/auth_handler/settings/{auth_handler_name}
Show More
Models
AuthPermission​#Copy link to "AuthPermission"
string
enum
WRITE
EDIT
LIST
READ
DELETE
AuthResource​#Copy link to "AuthResource"
string
enum
STATUS
MEMORY
CONVERSATION
SETTINGS
LLM
Body_install_plugin​#Copy link to "Body_install_plugin"
file
string
binary
required
binary data, used to describe files

Body_recall_memory_points​#Copy link to "Body_recall_memory_points"
text
string
required
Find memories similar to this text.

k
integer
default: 
100
How many memories to return.

metadata
object
default: 
{}
Flat dictionary where each key-value pair represents a filter.The memory points returned will match the specified metadata criteria.

Body_upload_file​#Copy link to "Body_upload_file"
file
string
binary
required
binary data, used to describe files

chunk_size
integer | nullable
Maximum length of each chunk after the document is split (in tokens)

chunk_overlap
integer | nullable
Chunk overlap (in tokens)

metadata
string
default: 
{}
Metadata to be stored with each chunk (e.g. author, category, etc.). Since we are passing this along side form data, must be a JSON string (use json.dumps(metadata)).

Body_upload_files​#Copy link to "Body_upload_files"
files
array string[]
required
chunk_size
integer | nullable
Maximum length of each chunk after the document is split (in tokens)

chunk_overlap
integer | nullable
Chunk overlap (in tokens)

metadata
string
default: 
{}
Metadata to be stored where each key is the name of a file being uploaded, and the corresponding value is another dictionary containing metadata specific to that file. Since we are passing this along side form data, metadata must be a JSON string (use json.dumps(metadata)).

Body_upload_memory​#Copy link to "Body_upload_memory"
file
string
binary
required
binary data, used to describe files

CatMessage​#Copy link to "CatMessage"
Represents a Cat message.

Attributes
type : str The type of message. Defaults to "chat". user_id : str Unique identifier for the user associated with the message. when : float The timestamp when the message was sent. Defaults to the current time. who : str The name of the message author. text : Optional[str], default=None The text content of the message. image : Optional[str], default=None Image file URLs or base64 data URIs that represent image associated with the message. audio : Optional[str], default=None Audio file URLs or base64 data URIs that represent audio associated with the message. why : Optional[MessageWhy] Additional contextual information related to the message.

Notes
The content parameter and attribute are deprecated. Use text instead.
user_id
string
required
when
number
who
string
default: 
AI
text
string | nullable
image
string | nullable
audio
string | nullable
type
string
default: 
chat
why
object | nullable
message
string
read-only
required
This attribute is deprecated. Use text instead.

The text content of the message. Use text instead.

Returns
str The text content of the message.

content
string
read-only
required
This attribute is deprecated. Use text instead.

The text content of the message. Use text instead.

Returns
str The text content of the message.

additional properties
anything
EmbedderModelInteraction​#Copy link to "EmbedderModelInteraction"
Represents an interaction with an embedding model.

Inherits from ModelInteraction and includes attributes specific to embedding interactions.

Attributes
model_type : Literal["embedder"] The type of model, which is fixed to "embedder". source : str The source of the interaction, defaulting to "recall". reply : List[float] The embeddings generated by the embedder.

model_type
const: 
embedder
source
string
default: 
recall
prompt
string
required
input_tokens
integer
required
Integer numbers.

started_at
number
reply
array number[]
required
HTTPValidationError​#Copy link to "HTTPValidationError"
detail
array object[]

ValidationError
JWTResponse​#Copy link to "JWTResponse"
access_token
string
required
token_type
string
default: 
bearer
LLMModelInteraction​#Copy link to "LLMModelInteraction"
Represents an interaction with a large language model (LLM).

Inherits from ModelInteraction and adds specific attributes related to LLM interactions.

Attributes
model_type : Literal["llm"] The type of model, which is fixed to "llm". reply : str The response generated by the LLM. output_tokens : int The number of output tokens generated by the LLM. ended_at : float The timestamp when the interaction ended.

model_type
const: 
llm
source
string
required
prompt
string
required
input_tokens
integer
required
Integer numbers.

started_at
number
reply
string
required
output_tokens
integer
required
Integer numbers.

ended_at
number
required
MemoryPoint​#Copy link to "MemoryPoint"
content
string
required
metadata
object
default: 
{}
id
string
required
vector
array number[]
required
MemoryPointBase​#Copy link to "MemoryPointBase"
content
string
required
metadata
object
default: 
{}
MessageWhy​#Copy link to "MessageWhy"
A class for encapsulating the context and reasoning behind a message, providing details on input, intermediate steps, memory, and interactions with models.

Attributes
input : str The initial input message that triggered the response. intermediate_steps : List A list capturing intermediate steps or actions taken as part of processing the message. memory : dict A dictionary containing relevant memory information used during the processing of the message. model_interactions : List[Union[LLMModelInteraction, EmbedderModelInteraction]] A list of interactions with language or embedding models, detailing how models were used in generating or understanding the message context.

input
string
required
intermediate_steps
array
required
memory
object
required
model_interactions
array
required
Represents an interaction with a large language model (LLM).

Inherits from ModelInteraction and adds specific attributes related to LLM interactions.

Attributes
model_type : Literal["llm"] The type of model, which is fixed to "llm". reply : str The response generated by the LLM. output_tokens : int The number of output tokens generated by the LLM. ended_at : float The timestamp when the interaction ended.


LLMModelInteraction
Represents an interaction with an embedding model.

Inherits from ModelInteraction and includes attributes specific to embedding interactions.

Attributes
model_type : Literal["embedder"] The type of model, which is fixed to "embedder". source : str The source of the interaction, defaulting to "recall". reply : List[float] The embeddings generated by the embedder.


EmbedderModelInteraction
additional properties
anything
SettingBody​#Copy link to "SettingBody"
name
string
required
value
anyOf
required

object

array
category
string | nullable
UploadURLConfig​#Copy link to "UploadURLConfig"
url
string
required
URL of the website to which you want to save the content

chunk_size
integer | nullable
Maximum length of each chunk after the document is split (in tokens)

chunk_overlap
integer | nullable
Chunk overlap (in tokens)

metadata
object
default: 
{}
Metadata to be stored with each chunk (e.g. author, category, etc.)

UserCreate​#Copy link to "UserCreate"
username
string
min: 
2
required
permissions
object
default: 
{ "CONVERSATION": [ "WRITE", "EDIT", "LIST", "READ", "DELETE" ], "MEMORY": [ "READ", "LIST" ], "STATIC": [ "READ" ], "STATUS": [ "READ" ] }

Permissions
password
string
min: 
5
required
UserCredentials​#Copy link to "UserCredentials"
username
string
required
password
string
required
UserResponse​#Copy link to "UserResponse"
username
string
min: 
2
required
permissions
object
default: 
{ "CONVERSATION": [ "WRITE", "EDIT", "LIST", "READ", "DELETE" ], "MEMORY": [ "READ", "LIST" ], "STATIC": [ "READ" ], "STATUS": [ "READ" ] }

Permissions
id
string
required
UserUpdate​#Copy link to "UserUpdate"
username
string
min: 
2
permissions
object

Permissions
password
string
min: 
4
ValidationError​#Copy link to "ValidationError"
loc
array
required

string

integer
msg
string
required
type
string
requiredMessage With Cat​#Copy link to "Message With Cat"
Get a response from the Cat

Body
application/json
object
default: 
{ "text": "hello!" }
Responses
Expand
200
Successful Response
application/json
Expand
422
Validation Error
application/json
POST
/message
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/message \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "text": "hello!"
}'

Test Request
(post /message)
200
422
Copy content
{
  "user_id": "…",
  "when": 1,
  "who": "AI",
  "text": "…",
  "image": "…",
  "audio": "…",
  "type": "chat",
  "why": {
    "input": "…",
    "intermediate_steps": [],
    "memory": {},
    "model_interactions": [
      {
        "model_type": "llm",
        "source": "…",
        "prompt": "…",
        "input_tokens": 1,
        "started_at": 1,
        "reply": "…",
        "output_tokens": 1,
        "ended_at": 1
      }
    ],
    "ANY_ADDITIONAL_PROPERTY": "anything"
  },
  "message": "…",
  "content": "…",
  "ANY_ADDITIONAL_PROPERTY": "anything"
}
Successful Response

User Auth​#Copy link to "User Auth"
User AuthEndpoints
GET
/auth/available-permissions
POST
/auth/token
Get Available Permissions​#Copy link to "Get Available Permissions"
Returns all available resources and permissions.

Responses
Expand
200
Successful Response
application/json
GET
/auth/available-permissions
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/auth/available-permissions

Test Request
(get /auth/available-permissions)
200
Copy content
{
  "ANY_ADDITIONAL_PROPERTY": [
    "WRITE"
  ]
}
Successful Response

Auth Token​#Copy link to "Auth Token"
Endpoint called from client to get a JWT from local identity provider. This endpoint receives username and password as form-data, validates credentials and issues a JWT.

Body
application/json
username
string
required
password
string
required
Responses
Expand
200
Successful Response
application/json
Expand
422
Validation Error
application/json
POST
/auth/token
Selected HTTP client:Shell Curl

Curl
Copy content
curl https://cheshire.geaux.app/auth/token \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "username": "",
  "password": ""
}'

Test Request
(post /auth/token)
200
422
Copy content
{
  "access_token": "…",
  "token_type": "bearer"
}
Successful Response

Users​#Copy link to "Users"
UsersEndpoints
POST
/users/
GET
/users/
GET
/users/{user_id}
PUT
/users/{user_id}
DELETE
/users/{user_id}
Show More
Settings​#Copy link to "Settings"
SettingsEndpoints
GET
/settings/
POST
/settings/
GET
/settings/{settingId}
PUT
/settings/{settingId}
DELETE
/settings/{settingId}
Show More
Large Language Model​#Copy link to "Large Language Model"
Large Language ModelEndpoints
GET
/llm/settings
GET
/llm/settings/{languageModelName}
PUT
/llm/settings/{languageModelName}
Show More
Embedder​#Copy link to "Embedder"
EmbedderEndpoints
GET
/embedder/settings
GET
/embedder/settings/{languageEmbedderName}
PUT
/embedder/settings/{languageEmbedderName}
Show More
Plugins​#Copy link to "Plugins"
PluginsEndpoints
GET
/plugins/
POST
/plugins/upload
POST
/plugins/upload/registry
PUT
/plugins/toggle/{plugin_id}
GET
/plugins/settings
GET
/plugins/settings/{plugin_id}
PUT
/plugins/settings/{plugin_id}
GET
/plugins/{plugin_id}
DELETE
/plugins/{plugin_id}
Show More
Vector Memory - Points​#Copy link to "Vector Memory - Points"
Vector Memory - PointsEndpoints
GET
/memory/recall
POST
/memory/recall
POST
/memory/collections/{collection_id}/points
DELETE
/memory/collections/{collection_id}/points
GET
/memory/collections/{collection_id}/points
DELETE
/memory/collections/{collection_id}/points/{point_id}
PUT
/memory/collections/{collection_id}/points/{point_id}
Show More
Vector Memory - Collections​#Copy link to "Vector Memory - Collections"
Vector Memory - CollectionsEndpoints
GET
/memory/collections
DELETE
/memory/collections
DELETE
/memory/collections/{collection_id}
Show More
Working Memory - Current Conversation​#Copy link to "Working Memory - Current Conversation"
Working Memory - Current ConversationEndpoints
GET
/memory/conversation_history
DELETE
/memory/conversation_history
Show More
Rabbit Hole​#Copy link to "Rabbit Hole"
Rabbit HoleEndpoints
POST
/rabbithole/
POST
/rabbithole/batch
POST
/rabbithole/web
POST
/rabbithole/memory
GET
/rabbithole/allowed-mimetypes
Show More
AuthHandler​#Copy link to "AuthHandler"
AuthHandlerEndpoints
GET
/auth_handler/settings
GET
/auth_handler/settings/{auth_handler_name}
PUT
/auth_handler/settings/{auth_handler_name}
Show More
Models
AuthPermission​#Copy link to "AuthPermission"
string
enum
WRITE
EDIT
LIST
READ
DELETE
AuthResource​#Copy link to "AuthResource"
Body_install_plugin​#Copy link to "Body_install_plugin"
Body_recall_memory_points​#Copy link to "Body_recall_memory_points"
Body_upload_file​#Copy link to "Body_upload_file"
Body_upload_files​#Copy link to "Body_upload_files"
Body_upload_memory​#Copy link to "Body_upload_memory"
CatMessage​#Copy link to "CatMessage"
EmbedderModelInteraction​#Copy link to "EmbedderModelInteraction"
HTTPValidationError
```

---

## /.github/copilot-instructions.md

```markdown
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

---

## /.github/dependabot.yml

```plaintext

```

---

## /.github/pull_request_template.md

```markdown

```

---

## /.github/workflows/main.yml

```plaintext
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
    paths-ignore:
      - '**.md'
      - '.github/copilot-instructions.md'
      - 'docs/**'
  pull_request:
    branches: [ main, develop ]
    paths-ignore:
      - '**.md'
      - '.github/copilot-instructions.md'
      - 'docs/**'

permissions:
  checks: write
  contents: read
  pull-requests: write

env:
  NODE_VERSION: '20'
  VITE_USE_SECURE_COOKIES: 'true'
  VITE_AUTH_PERSISTENCE: 'LOCAL'
  VITE_AUTH_POPUP_FALLBACK: 'true'
  VITE_SERVICE_WORKER_TIMEOUT: '10000'
  VITE_MAX_AUTH_RETRIES: '3'
  VITE_AUTH_POPUP_REDIRECT_RESOLVER: 'browser'

jobs:
  validate-environment:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Validate development environment
        run: |
          if [ -f "devcontainer.json" ]; then
            echo "✅ Development container configuration validated"
          else
            echo "❌ Error: Missing devcontainer.json"
            exit 1
          fi

  build-and-test:
    needs: validate-environment
    runs-on: ubuntu-latest
    timeout-minutes: 15
    environment: production

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Clear npm cache
      run: npm cache clean --force
      
    - name: Install dependencies
      run: npm ci --legacy-peer-deps

    - name: Setup Firebase Tools
      run: npm install -g firebase-tools

    - name: Run linter
      run: npm run lint

    - name: Prepare Service Worker
      run: node scripts/prepare-service-worker.js
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
      
    - name: Start Firebase Emulators
      run: firebase emulators:start --only auth,firestore,functions &
      
    - name: Wait for Emulators
      run: sleep 10

    - name: Run tests
      run: npm test
      env:
        FIREBASE_AUTH_EMULATOR_HOST: localhost:9099
        FIRESTORE_EMULATOR_HOST: localhost:8080
        FIREBASE_FUNCTIONS_EMULATOR_HOST: localhost:5001
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}
        VITE_FIREBASE_DATABASE_URL: ${{ secrets.VITE_FIREBASE_DATABASE_URL }}
        VITE_CHESHIRE_API_URL: ${{ secrets.VITE_CHESHIRE_API_URL }}
        VITE_CHESHIRE_API_TOKEN: ${{ secrets.VITE_CHESHIRE_API_TOKEN }}
        VITE_CHESHIRE_API_TOKEN_TYPE: ${{ secrets.VITE_CHESHIRE_API_TOKEN_TYPE }}
        VITE_CHESHIRE_DEBUG: ${{ secrets.VITE_CHESHIRE_DEBUG }}
        VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}

    - name: Build
      run: npm run build
      env:
        NODE_ENV: production
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}
        VITE_FIREBASE_DATABASE_URL: ${{ secrets.VITE_FIREBASE_DATABASE_URL }}
        VITE_CHESHIRE_API_URL: ${{ secrets.VITE_CHESHIRE_API_URL }}
        VITE_CHESHIRE_API_TOKEN: ${{ secrets.VITE_CHESHIRE_API_TOKEN }}
        VITE_CHESHIRE_API_TOKEN_TYPE: ${{ secrets.VITE_CHESHIRE_API_TOKEN_TYPE }}
        VITE_CHESHIRE_DEBUG: ${{ secrets.VITE_CHESHIRE_DEBUG }}
        VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}

    - name: Check bundle size
      run: npm run analyze-bundle || true

    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build
        path: dist/

  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    timeout-minutes: 15
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install Firebase CLI
      run: npm install -g firebase-tools

    - name: Download build artifacts
      uses: actions/download-artifact@v4
      with:
        name: build
        path: dist/

    - name: Update Firebase Security Headers
      run: |
        cat > firebase.json << 'EOF'
        {
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
                    "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://*.firebase.com https://*.googleapis.com https://*.gstatic.com https://www.googletagmanager.com https://tagmanager.google.com; connect-src 'self' https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://firebaseinstallations.googleapis.com https://*.googleapis.com https://www.googletagmanager.com https://*.google-analytics.com; frame-src 'self' https://*.firebaseapp.com https://*.firebase.com https://accounts.google.com https://*.googleapis.com; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://tagmanager.google.com; font-src 'self' data: https://fonts.gstatic.com https://*.public.atl-paas.net; worker-src 'self' blob: 'unsafe-inline'; manifest-src 'self'; media-src 'self' blob:;"
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
                    "value": "accelerometer=(), autoplay=(), camera=(), cross-origin-isolated=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(self), usb=(), web-share=(), xr-spatial-tracking=()"
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
          }
        }
        EOF

    - name: Deploy to Firebase
      run: |
        echo ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS }} > $HOME/service-account.json
        firebase use ${{ secrets.FIREBASE_PROJECT_ID }} --non-interactive
        firebase deploy --only hosting --non-interactive
      env:
        GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS }}
```

---

## /.github/ISSUE_TEMPLATE/api-setup.md

```markdown
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

---

## /.github/ISSUE_TEMPLATE/bug_report.md

```markdown

```

---

## /.github/ISSUE_TEMPLATE/custom.md

```markdown

```

---

## /.github/ISSUE_TEMPLATE/database-setup.md

```markdown
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

---

## /.github/ISSUE_TEMPLATE/feature_request.md

```markdown

```

---

## /.github/ISSUE_TEMPLATE/setup-authentication.md

```markdown
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

---

## /.github/ISSUE_TEMPLATE/ui-setup.md

```markdown
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

---

## /functions/.eslintrc.js

```javascript
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
  },
};
```

---

## /functions/package-lock.json

```json
{
  "name": "functions",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "functions",
      "dependencies": {
        "@genkit-ai/firebase": "^0.9.12",
        "@genkit-ai/googleai": "^1.0.4",
        "@genkit-ai/vertexai": "^0.9.12",
        "express": "^4.21.2",
        "firebase-admin": "^12.6.0",
        "firebase-functions": "^6.0.1",
        "genkit": "^1.0.4"
      },
      "devDependencies": {
        "@types/firebase": "^2.4.32",
        "eslint": "^9.18.0",
        "firebase-functions-test": "^3.1.0",
        "genkit-cli": "^0.9.12",
        "tsx": "^4.19.2",
        "typescript": "^4.9.5"
      },
      "engines": {
        "node": "18"
      }
    },
    "node_modules/@ampproject/remapping": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/@ampproject/remapping/-/remapping-2.3.0.tgz",
      "integrity": "sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw==",
      "dev": true,
      "license": "Apache-2.0",
      "peer": true,
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@anthropic-ai/sdk": {
      "version": "0.24.3",
      "resolved": "https://registry.npmjs.org/@anthropic-ai/sdk/-/sdk-0.24.3.tgz",
      "integrity": "sha512-916wJXO6T6k8R6BAAcLhLPv/pnLGy7YSEBZXZ1XTFbLcTZE8oTy3oDW9WJf9KKZwMvVcePIfoTSvzXHRcGxkQQ==",
      "dependencies": {
        "@types/node": "^18.11.18",
        "@types/node-fetch": "^2.6.4",
        "abort-controller": "^3.0.0",
        "agentkeepalive": "^4.2.1",
        "form-data-encoder": "1.7.2",
        "formdata-node": "^4.3.2",
        "node-fetch": "^2.6.7",
        "web-streams-polyfill": "^3.2.1"
      }
    },
    "node_modules/@anthropic-ai/sdk/node_modules/@types/node": {
      "version": "18.19.74",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-18.19.74.tgz",
      "integrity": "sha512-HMwEkkifei3L605gFdV+/UwtpxP6JSzM+xFk2Ia6DNFSwSVBRh9qp5Tgf4lNFOMfPVuU0WnkcWpXZpgn5ufO4A==",
      "dependencies": {
        "undici-types": "~5.26.4"
      }
    },
    "node_modules/@anthropic-ai/sdk/node_modules/undici-types": {
      "version": "5.26.5",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-5.26.5.tgz",
      "integrity": "sha512-JlCMO+ehdEIKqlFxk6IfVoAUVmgz7cU7zD/h9XZ0qzeosSHmUJVOzSQvvYSYWXkFXC+IfLKSIffhv0sVZup6pA=="
    },
    "node_modules/@anthropic-ai/vertex-sdk": {
      "version": "0.4.3",
      "resolved": "https://registry.npmjs.org/@anthropic-ai/vertex-sdk/-/vertex-sdk-0.4.3.tgz",
      "integrity": "sha512-2Uef0C5P2Hx+T88RnUSRA3u4aZqmqnrRSOb2N64ozgKPiSUPTM5JlggAq2b32yWMj5d3MLYa6spJXKMmHXOcoA==",
      "dependencies": {
        "@anthropic-ai/sdk": ">=0.14 <1",
        "google-auth-library": "^9.4.2"
      }
    },
    "node_modules/@asteasolutions/zod-to-openapi": {
      "version": "7.3.0",
      "resolved": "https://registry.npmjs.org/@asteasolutions/zod-to-openapi/-/zod-to-openapi-7.3.0.tgz",
      "integrity": "sha512-7tE/r1gXwMIvGnXVUdIqUhCU1RevEFC4Jk6Bussa0fk1ecbnnINkZzj1EOAJyE/M3AI25DnHT/zKQL1/FPFi8Q==",
      "dev": true,
      "dependencies": {
        "openapi3-ts": "^4.1.2"
      },
      "peerDependencies": {
        "zod": "^3.20.2"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.26.2",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.26.2.tgz",
      "integrity": "sha512-RJlIHRueQgwWitWgF8OdFYGZX328Ax5BCemNGlqHfplnRT9ESi8JkFlvaVYbS+UubVY6dpv87Fs2u5M29iNFVQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.25.9",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.0.0"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.26.8",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.26.8.tgz",
      "integrity": "sha512-oH5UPLMWR3L2wEFLnFJ1TZXqHufiTKAiLfqw5zkhS4dKXLJ10yVztfil/twG8EDTA4F/tvVNw9nOl4ZMslB8rQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.26.8",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.26.8.tgz",
      "integrity": "sha512-l+lkXCHS6tQEc5oUpK28xBOZ6+HwaH7YwoYQbLFiYb4nS2/l1tKnZEtEWkD0GuiYdvArf9qBS0XlQGXzPMsNqQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@ampproject/remapping": "^2.2.0",
        "@babel/code-frame": "^7.26.2",
        "@babel/generator": "^7.26.8",
        "@babel/helper-compilation-targets": "^7.26.5",
        "@babel/helper-module-transforms": "^7.26.0",
        "@babel/helpers": "^7.26.7",
        "@babel/parser": "^7.26.8",
        "@babel/template": "^7.26.8",
        "@babel/traverse": "^7.26.8",
        "@babel/types": "^7.26.8",
        "@types/gensync": "^1.0.0",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/core/node_modules/debug": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.0.tgz",
      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/@babel/core/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/@babel/generator": {
      "version": "7.26.8",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.26.8.tgz",
      "integrity": "sha512-ef383X5++iZHWAXX0SXQR6ZyQhw/0KtTkrTz61WXRhFM6dhpHulO/RJz79L8S6ugZHJkOOkUrUdxgdF2YiPFnA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/parser": "^7.26.8",
        "@babel/types": "^7.26.8",
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.25",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.26.5",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.26.5.tgz",
      "integrity": "sha512-IXuyn5EkouFJscIDuFF5EsiSolseme1s0CZB+QxVugqJLYmKdxI1VfIBOst0SUu4rnk2Z7kqTwmoO1lp3HIfnA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/compat-data": "^7.26.5",
        "@babel/helper-validator-option": "^7.25.9",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.25.9",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.25.9.tgz",
      "integrity": "sha512-tnUA4RsrmflIM6W6RFTLFSXITtl0wKjgpnLgXyowocVPrbYrLUXSBXDgTs8BlbmIzIdlBySRQjINYs2BAkiLtw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/traverse": "^7.25.9",
        "@babel/types": "^7.25.9"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.26.0",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.26.0.tgz",
      "integrity": "sha512-xO+xu6B5K2czEnQye6BHA7DolFFmS3LB7stHZFaOLb1pAwO1HWLS8fXA+eh0A2yIvltPVmx3eNNDBJA2SLHXFw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-module-imports": "^7.25.9",
        "@babel/helper-validator-identifier": "^7.25.9",
        "@babel/traverse": "^7.25.9"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-plugin-utils": {
      "version": "7.26.5",
      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.26.5.tgz",
      "integrity": "sha512-RS+jZcRdZdRFzMyr+wcsaqOmld1/EqTghfaBGQQd/WnRdzdlvSZ//kF7U8VQTxf1ynZ4cjUcYgjVGx13ewNPMg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.25.9",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.25.9.tgz",
      "integrity": "sha512-4A/SCr/2KLd5jrtOMFzaKjVtAei3+2r/NChoBNoZ3EyP/+GlhoaEGoWOZUmFmoITP7zOJyHIMm+DYRd8o3PvHA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.25.9",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.25.9.tgz",
      "integrity": "sha512-Ed61U6XJc3CVRfkERJWDz4dJwKe7iLmmJsbOGu9wSloNSFttHV0I8g6UAgb7qnK5ly5bGLPd4oXZlxCdANBOWQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.25.9",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.25.9.tgz",
      "integrity": "sha512-e/zv1co8pp55dNdEcCynfj9X7nyUKUXoUEwfXqaZt0omVOmDe9oOTdKStH4GmAw6zxMFs50ZayuMfHDKlO7Tfw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.26.7",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.26.7.tgz",
      "integrity": "sha512-8NHiL98vsi0mbPQmYAGWwfcFaOy4j2HY49fXJCfuDcdE7fMIsH9a7GdaeXpIBsbT7307WU8KCMp5pUVDNL4f9A==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/template": "^7.25.9",
        "@babel/types": "^7.26.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.26.8",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.26.8.tgz",
      "integrity": "sha512-TZIQ25pkSoaKEYYaHbbxkfL36GNsQ6iFiBbeuzAkLnXayKR1yP1zFe+NxuZWWsUyvt8icPU9CCq0sgWGXR1GEw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/types": "^7.26.8"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/plugin-syntax-async-generators": {
      "version": "7.8.4",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-async-generators/-/plugin-syntax-async-generators-7.8.4.tgz",
      "integrity": "sha512-tycmZxkGfZaxhMRbXlPXuVFpdWlXpir2W4AMhSJgRKzk/eDlIXOhb2LHWoLpDF7TEHylV5zNhykX6KAgHJmTNw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-bigint": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-bigint/-/plugin-syntax-bigint-7.8.3.tgz",
      "integrity": "sha512-wnTnFlG+YxQm3vDxpGE57Pj0srRU4sHE/mDkt1qv2YJJSeUAec2ma4WLUnUPeKjyrfntVwe/N6dCXpU+zL3Npg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-class-properties": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-class-properties/-/plugin-syntax-class-properties-7.12.13.tgz",
      "integrity": "sha512-fm4idjKla0YahUNgFNLCB0qySdsoPiZP3iQE3rky0mBUtMZ23yDJ9SJdg6dXTSDnulOVqiF3Hgr9nbXvXTQZYA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-class-static-block": {
      "version": "7.14.5",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-class-static-block/-/plugin-syntax-class-static-block-7.14.5.tgz",
      "integrity": "sha512-b+YyPmr6ldyNnM6sqYeMWE+bgJcJpO6yS4QD7ymxgH34GBPNDM/THBh8iunyvKIZztiwLH4CJZ0RxTk9emgpjw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.14.5"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-import-attributes": {
      "version": "7.26.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-import-attributes/-/plugin-syntax-import-attributes-7.26.0.tgz",
      "integrity": "sha512-e2dttdsJ1ZTpi3B9UYGLw41hifAubg19AtCu/2I/F1QNVclOBr1dYpTdmdyZ84Xiz43BS/tCUkMAZNLv12Pi+A==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.25.9"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-import-meta": {
      "version": "7.10.4",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-import-meta/-/plugin-syntax-import-meta-7.10.4.tgz",
      "integrity": "sha512-Yqfm+XDx0+Prh3VSeEQCPU81yC+JWZ2pDPFSS4ZdpfZhp4MkFMaDC1UqseovEKwSUpnIL7+vK+Clp7bfh0iD7g==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.10.4"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-json-strings": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-json-strings/-/plugin-syntax-json-strings-7.8.3.tgz",
      "integrity": "sha512-lY6kdGpWHvjoe2vk4WrAapEuBR69EMxZl+RoGRhrFGNYVK8mOPAW8VfbT/ZgrFbXlDNiiaxQnAtgVCZ6jv30EA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-jsx": {
      "version": "7.25.9",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-jsx/-/plugin-syntax-jsx-7.25.9.tgz",
      "integrity": "sha512-ld6oezHQMZsZfp6pWtbjaNDF2tiiCYYDqQszHt5VV437lewP9aSi2Of99CK0D0XB21k7FLgnLcmQKyKzynfeAA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.25.9"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-logical-assignment-operators": {
      "version": "7.10.4",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-logical-assignment-operators/-/plugin-syntax-logical-assignment-operators-7.10.4.tgz",
      "integrity": "sha512-d8waShlpFDinQ5MtvGU9xDAOzKH47+FFoney2baFIoMr952hKOLp1HR7VszoZvOsV/4+RRszNY7D17ba0te0ig==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.10.4"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-nullish-coalescing-operator": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-nullish-coalescing-operator/-/plugin-syntax-nullish-coalescing-operator-7.8.3.tgz",
      "integrity": "sha512-aSff4zPII1u2QD7y+F8oDsz19ew4IGEJg9SVW+bqwpwtfFleiQDMdzA/R+UlWDzfnHFCxxleFT0PMIrR36XLNQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-numeric-separator": {
      "version": "7.10.4",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-numeric-separator/-/plugin-syntax-numeric-separator-7.10.4.tgz",
      "integrity": "sha512-9H6YdfkcK/uOnY/K7/aA2xpzaAgkQn37yzWUMRK7OaPOqOpGS1+n0H5hxT9AUw9EsSjPW8SVyMJwYRtWs3X3ug==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.10.4"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-object-rest-spread": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-object-rest-spread/-/plugin-syntax-object-rest-spread-7.8.3.tgz",
      "integrity": "sha512-XoqMijGZb9y3y2XskN+P1wUGiVwWZ5JmoDRwx5+3GmEplNyVM2s2Dg8ILFQm8rWM48orGy5YpI5Bl8U1y7ydlA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-optional-catch-binding": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-optional-catch-binding/-/plugin-syntax-optional-catch-binding-7.8.3.tgz",
      "integrity": "sha512-6VPD0Pc1lpTqw0aKoeRTMiB+kWhAoT24PA+ksWSBrFtl5SIRVpZlwN3NNPQjehA2E/91FV3RjLWoVTglWcSV3Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-optional-chaining": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-optional-chaining/-/plugin-syntax-optional-chaining-7.8.3.tgz",
      "integrity": "sha512-KoK9ErH1MBlCPxV0VANkXW2/dw4vlbGDrFgz8bmUsBGYkFRcbRwMh6cIJubdPrkxRwuGdtCk0v/wPTKbQgBjkg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-private-property-in-object": {
      "version": "7.14.5",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-private-property-in-object/-/plugin-syntax-private-property-in-object-7.14.5.tgz",
      "integrity": "sha512-0wVnp9dxJ72ZUJDV27ZfbSj6iHLoytYZmh3rFcxNnvsJF3ktkzLDZPy/mA17HGsaQT3/DQsWYX1f1QGWkCoVUg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.14.5"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-top-level-await": {
      "version": "7.14.5",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-top-level-await/-/plugin-syntax-top-level-await-7.14.5.tgz",
      "integrity": "sha512-hx++upLv5U1rgYfwe1xBQUhRmU41NEvpUvrp8jkrSCdvGSnM5/qdRMtylJ6PG5OFkBaHkbTAKTnd3/YyESRHFw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.14.5"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-typescript": {
      "version": "7.25.9",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-typescript/-/plugin-syntax-typescript-7.25.9.tgz",
      "integrity": "sha512-hjMgRy5hb8uJJjUcdWunWVcoi9bGpJp8p5Ol1229PoN6aytsLwNMgmdftO23wnCLMfVmTwZDWMPNq/D1SY60JQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.25.9"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.26.8",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.26.8.tgz",
      "integrity": "sha512-iNKaX3ZebKIsCvJ+0jd6embf+Aulaa3vNBqZ41kM7iTWjx5qzWKXGHiJUW3+nTpQ18SG11hdF8OAzKrpXkb96Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/code-frame": "^7.26.2",
        "@babel/parser": "^7.26.8",
        "@babel/types": "^7.26.8"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.26.8",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.26.8.tgz",
      "integrity": "sha512-nic9tRkjYH0oB2dzr/JoGIm+4Q6SuYeLEiIiZDwBscRMYFJ+tMAz98fuel9ZnbXViA2I0HVSSRRK8DW5fjXStA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/code-frame": "^7.26.2",
        "@babel/generator": "^7.26.8",
        "@babel/parser": "^7.26.8",
        "@babel/template": "^7.26.8",
        "@babel/types": "^7.26.8",
        "debug": "^4.3.1",
        "globals": "^11.1.0"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse/node_modules/debug": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.0.tgz",
      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/@babel/traverse/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/@babel/types": {
      "version": "7.26.8",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.26.8.tgz",
      "integrity": "sha512-eUuWapzEGWFEpHFxgEaBG8e3n6S8L3MSu0oda755rOfabWPnh0Our1AozNFVUxGFIhbKgd1ksprsoDGMinTOTA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/helper-string-parser": "^7.25.9",
        "@babel/helper-validator-identifier": "^7.25.9"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@bcoe/v8-coverage": {
      "version": "0.2.3",
      "resolved": "https://registry.npmjs.org/@bcoe/v8-coverage/-/v8-coverage-0.2.3.tgz",
      "integrity": "sha512-0hYQ8SB4Db5zvZB4axdMHGwEaQjkZzFjQiN9LVYvIFB2nSUHW9tYpxWriPrWDASIxiaXax83REcLxuSdnGPZtw==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/@colors/colors": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/@colors/colors/-/colors-1.6.0.tgz",
      "integrity": "sha512-Ir+AOibqzrIsL6ajt3Rz3LskB7OiMVHqltZmspbW/TJuTVuyOMirVqAkjfY6JISiLHgyNqicAC8AyHHGzNd/dA==",
      "engines": {
        "node": ">=0.1.90"
      }
    },
    "node_modules/@dabh/diagnostics": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/@dabh/diagnostics/-/diagnostics-2.0.3.tgz",
      "integrity": "sha512-hrlQOIi7hAfzsMqlGSFyVucrx38O+j6wiGOf//H2ecvIEqYN4ADBSS2iLMh5UFyDunCNniUIPk/q3riFv45xRA==",
      "dependencies": {
        "colorspace": "1.1.x",
        "enabled": "2.0.x",
        "kuler": "^2.0.0"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.23.1.tgz",
      "integrity": "sha512-6VhYk1diRqrhBAqpJEdjASR/+WVRtfjpqKuNw11cLiaWpAT/Uu+nokB+UJnevzy/P9C/ty6AOe0dwueMrGh/iQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.23.1.tgz",
      "integrity": "sha512-uz6/tEy2IFm9RYOyvKl88zdzZfwEfKZmnX9Cj1BHjeSGNuGLuMD1kR8y5bteYmwqKm1tj8m4cb/aKEorr6fHWQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.23.1.tgz",
      "integrity": "sha512-xw50ipykXcLstLeWH7WRdQuysJqejuAGPd30vd1i5zSyKK3WE+ijzHmLKxdiCMtH1pHz78rOg0BKSYOSB/2Khw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.23.1.tgz",
      "integrity": "sha512-nlN9B69St9BwUoB+jkyU090bru8L0NA3yFvAd7k8dNsVH8bi9a8cUAUSEcEEgTp2z3dbEDGJGfP6VUnkQnlReg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.23.1.tgz",
      "integrity": "sha512-YsS2e3Wtgnw7Wq53XXBLcV6JhRsEq8hkfg91ESVadIrzr9wO6jJDMZnCQbHm1Guc5t/CdDiFSSfWP58FNuvT3Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.23.1.tgz",
      "integrity": "sha512-aClqdgTDVPSEGgoCS8QDG37Gu8yc9lTHNAQlsztQ6ENetKEO//b8y31MMu2ZaPbn4kVsIABzVLXYLhCGekGDqw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.23.1.tgz",
      "integrity": "sha512-h1k6yS8/pN/NHlMl5+v4XPfikhJulk4G+tKGFIOwURBSFzE8bixw1ebjluLOjfwtLqY0kewfjLSrO6tN2MgIhA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.23.1.tgz",
      "integrity": "sha512-lK1eJeyk1ZX8UklqFd/3A60UuZ/6UVfGT2LuGo3Wp4/z7eRTRYY+0xOu2kpClP+vMTi9wKOfXi2vjUpO1Ro76g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.23.1.tgz",
      "integrity": "sha512-CXXkzgn+dXAPs3WBwE+Kvnrf4WECwBdfjfeYHpMeVxWE0EceB6vhWGShs6wi0IYEqMSIzdOF1XjQ/Mkm5d7ZdQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.23.1.tgz",
      "integrity": "sha512-/93bf2yxencYDnItMYV/v116zff6UyTjo4EtEQjUBeGiVpMmffDNUyD9UN2zV+V3LRV3/on4xdZ26NKzn6754g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.23.1.tgz",
      "integrity": "sha512-VTN4EuOHwXEkXzX5nTvVY4s7E/Krz7COC8xkftbbKRYAl96vPiUssGkeMELQMOnLOJ8k3BY1+ZY52tttZnHcXQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.23.1.tgz",
      "integrity": "sha512-Vx09LzEoBa5zDnieH8LSMRToj7ir/Jeq0Gu6qJ/1GcBq9GkfoEAoXvLiW1U9J1qE/Y/Oyaq33w5p2ZWrNNHNEw==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.23.1.tgz",
      "integrity": "sha512-nrFzzMQ7W4WRLNUOU5dlWAqa6yVeI0P78WKGUo7lg2HShq/yx+UYkeNSE0SSfSure0SqgnsxPvmAUu/vu0E+3Q==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.23.1.tgz",
      "integrity": "sha512-dKN8fgVqd0vUIjxuJI6P/9SSSe/mB9rvA98CSH2sJnlZ/OCZWO1DJvxj8jvKTfYUdGfcq2dDxoKaC6bHuTlgcw==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.23.1.tgz",
      "integrity": "sha512-5AV4Pzp80fhHL83JM6LoA6pTQVWgB1HovMBsLQ9OZWLDqVY8MVobBXNSmAJi//Csh6tcY7e7Lny2Hg1tElMjIA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.23.1.tgz",
      "integrity": "sha512-9ygs73tuFCe6f6m/Tb+9LtYxWR4c9yg7zjt2cYkjDbDpV/xVn+68cQxMXCjUpYwEkze2RcU/rMnfIXNRFmSoDw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.23.1.tgz",
      "integrity": "sha512-EV6+ovTsEXCPAp58g2dD68LxoP/wK5pRvgy0J/HxPGB009omFPv3Yet0HiaqvrIrgPTBuC6wCH1LTOY91EO5hQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.23.1.tgz",
      "integrity": "sha512-aevEkCNu7KlPRpYLjwmdcuNz6bDFiE7Z8XC4CPqExjTvrHugh28QzUXVOZtiYghciKUacNktqxdpymplil1beA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.23.1.tgz",
      "integrity": "sha512-3x37szhLexNA4bXhLrCC/LImN/YtWis6WXr1VESlfVtVeoFJBRINPJ3f0a/6LV8zpikqoUg4hyXw0sFBt5Cr+Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.23.1.tgz",
      "integrity": "sha512-aY2gMmKmPhxfU+0EdnN+XNtGbjfQgwZj43k8G3fyrDM/UdZww6xrWxmDkuz2eCZchqVeABjV5BpildOrUbBTqA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.23.1.tgz",
      "integrity": "sha512-RBRT2gqEl0IKQABT4XTj78tpk9v7ehp+mazn2HbUeZl1YMdaGAQqhapjGTCe7uw7y0frDi4gS0uHzhvpFuI1sA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.23.1.tgz",
      "integrity": "sha512-4O+gPR5rEBe2FpKOVyiJ7wNDPA8nGzDuJ6gN4okSA1gEOYZ67N8JPk58tkWtdtPeLz7lBnY6I5L3jdsr3S+A6A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.23.1.tgz",
      "integrity": "sha512-BcaL0Vn6QwCwre3Y717nVHZbAa4UBEigzFm6VdsVdT/MbZ38xoj1X9HPkZhbmaBGUD1W8vxAfffbDe8bA6AKnQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.23.1.tgz",
      "integrity": "sha512-BHpFFeslkWrXWyUPnbKm+xYYVYruCinGcftSBaa8zoF9hZO4BcSCFUvHVTtzpIY6YzUnYtuEhZ+C9iEXjxnasg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@eslint-community/eslint-utils": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.4.1.tgz",
      "integrity": "sha512-s3O3waFUrMV8P/XaF/+ZTp1X9XBZW1a4B97ZnjQF2KYWaFD2A8KyFBsrsfSjEmjn3RGWAIuvlneuZm3CUK3jbA==",
      "dev": true,
      "dependencies": {
        "eslint-visitor-keys": "^3.4.3"
      },
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      },
      "peerDependencies": {
        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
      }
    },
    "node_modules/@eslint-community/eslint-utils/node_modules/eslint-visitor-keys": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
      "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
      "dev": true,
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint-community/regexpp": {
      "version": "4.12.1",
      "resolved": "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.12.1.tgz",
      "integrity": "sha512-CCZCDJuduB9OUkFkY2IgppNZMi2lBQgD2qzwXkEia16cge2pijY/aXi96CJMquDMn3nJdlPV1A5KrJEXwfLNzQ==",
      "dev": true,
      "engines": {
        "node": "^12.0.0 || ^14.0.0 || >=16.0.0"
      }
    },
    "node_modules/@eslint/config-array": {
      "version": "0.19.1",
      "resolved": "https://registry.npmjs.org/@eslint/config-array/-/config-array-0.19.1.tgz",
      "integrity": "sha512-fo6Mtm5mWyKjA/Chy1BYTdn5mGJoDNjC7C64ug20ADsRDGrA85bN3uK3MaKbeRkRuuIEAR5N33Jr1pbm411/PA==",
      "dev": true,
      "dependencies": {
        "@eslint/object-schema": "^2.1.5",
        "debug": "^4.3.1",
        "minimatch": "^3.1.2"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/config-array/node_modules/debug": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.0.tgz",
      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
      "dev": true,
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/@eslint/config-array/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true
    },
    "node_modules/@eslint/core": {
      "version": "0.10.0",
      "resolved": "https://registry.npmjs.org/@eslint/core/-/core-0.10.0.tgz",
      "integrity": "sha512-gFHJ+xBOo4G3WRlR1e/3G8A6/KZAH6zcE/hkLRCZTi/B9avAG365QhFA8uOGzTMqgTghpn7/fSnscW++dpMSAw==",
      "dev": true,
      "dependencies": {
        "@types/json-schema": "^7.0.15"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/eslintrc": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-3.2.0.tgz",
      "integrity": "sha512-grOjVNN8P3hjJn/eIETF1wwd12DdnwFDoyceUJLYYdkpbwq3nLi+4fqrTAONx7XDALqlL220wC/RHSC/QTI/0w==",
      "dev": true,
      "dependencies": {
        "ajv": "^6.12.4",
        "debug": "^4.3.2",
        "espree": "^10.0.1",
        "globals": "^14.0.0",
        "ignore": "^5.2.0",
        "import-fresh": "^3.2.1",
        "js-yaml": "^4.1.0",
        "minimatch": "^3.1.2",
        "strip-json-comments": "^3.1.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint/eslintrc/node_modules/ajv": {
      "version": "6.12.6",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.12.6.tgz",
      "integrity": "sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==",
      "dev": true,
      "dependencies": {
        "fast-deep-equal": "^3.1.1",
        "fast-json-stable-stringify": "^2.0.0",
        "json-schema-traverse": "^0.4.1",
        "uri-js": "^4.2.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/@eslint/eslintrc/node_modules/argparse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
      "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==",
      "dev": true
    },
    "node_modules/@eslint/eslintrc/node_modules/debug": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.0.tgz",
      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
      "dev": true,
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/@eslint/eslintrc/node_modules/globals": {
      "version": "14.0.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-14.0.0.tgz",
      "integrity": "sha512-oahGvuMGQlPw/ivIYBjVSrWAfWLBeku5tpPE2fOPLi+WHffIWbuh2tCjhyQhTBPMf5E9jDEH4FOmTYgYwbKwtQ==",
      "dev": true,
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@eslint/eslintrc/node_modules/js-yaml": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.1.0.tgz",
      "integrity": "sha512-wpxZs9NoxZaJESJGIZTyDEaYpl0FKSA+FB9aJiyemKhMwkxQg63h4T1KJgUGHpTqPDNRcmmYLugrRjJlBtWvRA==",
      "dev": true,
      "dependencies": {
        "argparse": "^2.0.1"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/@eslint/eslintrc/node_modules/json-schema-traverse": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
      "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==",
      "dev": true
    },
    "node_modules/@eslint/eslintrc/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true
    },
    "node_modules/@eslint/js": {
      "version": "9.18.0",
      "resolved": "https://registry.npmjs.org/@eslint/js/-/js-9.18.0.tgz",
      "integrity": "sha512-fK6L7rxcq6/z+AaQMtiFTkvbHkBLNlwyRxHpKawP0x3u9+NC6MQTnFW+AdpwC6gfHTW0051cokQgtTN2FqlxQA==",
      "dev": true,
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/object-schema": {
      "version": "2.1.5",
      "resolved": "https://registry.npmjs.org/@eslint/object-schema/-/object-schema-2.1.5.tgz",
      "integrity": "sha512-o0bhxnL89h5Bae5T318nFoFzGy+YE5i/gGkoPAgkmTVdRKTiv3p8JHevPiPaMwoloKfEiiaHlawCqaZMqRm+XQ==",
      "dev": true,
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/plugin-kit": {
      "version": "0.2.5",
      "resolved": "https://registry.npmjs.org/@eslint/plugin-kit/-/plugin-kit-0.2.5.tgz",
      "integrity": "sha512-lB05FkqEdUg2AA0xEbUz0SnkXT1LcCTa438W4IWTUh4hdOnVbQyOJ81OrDXsJk/LSiJHubgGEFoR5EHq1NsH1A==",
      "dev": true,
      "dependencies": {
        "@eslint/core": "^0.10.0",
        "levn": "^0.4.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@fastify/busboy": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/@fastify/busboy/-/busboy-3.1.1.tgz",
      "integrity": "sha512-5DGmA8FTdB2XbDeEwc/5ZXBl6UbBAyBOOLlPuBnZ/N1SwdH9Ii+cOX3tBROlDgcTXxjOYnLMVoKk9+FXAw0CJw=="
    },
    "node_modules/@firebase/app-check-interop-types": {
      "version": "0.3.2",
      "resolved": "https://registry.npmjs.org/@firebase/app-check-interop-types/-/app-check-interop-types-0.3.2.tgz",
      "integrity": "sha512-LMs47Vinv2HBMZi49C09dJxp0QT5LwDzFaVGf/+ITHe3BlIhUiLNttkATSXplc89A2lAaeTqjgqVkiRfUGyQiQ=="
    },
    "node_modules/@firebase/app-types": {
      "version": "0.9.2",
      "resolved": "https://registry.npmjs.org/@firebase/app-types/-/app-types-0.9.2.tgz",
      "integrity": "sha512-oMEZ1TDlBz479lmABwWsWjzHwheQKiAgnuKxE0pz0IXCVx7/rtlkx1fQ6GfgK24WCrxDKMplZrT50Kh04iMbXQ=="
    },
    "node_modules/@firebase/auth-interop-types": {
      "version": "0.2.3",
      "resolved": "https://registry.npmjs.org/@firebase/auth-interop-types/-/auth-interop-types-0.2.3.tgz",
      "integrity": "sha512-Fc9wuJGgxoxQeavybiuwgyi+0rssr76b+nHpj+eGhXFYAdudMWyfBHvFL/I5fEHniUM/UQdFzi9VXJK2iZF7FQ=="
    },
    "node_modules/@firebase/component": {
      "version": "0.6.9",
      "resolved": "https://registry.npmjs.org/@firebase/component/-/component-0.6.9.tgz",
      "integrity": "sha512-gm8EUEJE/fEac86AvHn8Z/QW8BvR56TBw3hMW0O838J/1mThYQXAIQBgUv75EqlCZfdawpWLrKt1uXvp9ciK3Q==",
      "dependencies": {
        "@firebase/util": "1.10.0",
        "tslib": "^2.1.0"
      }
    },
    "node_modules/@firebase/database": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/@firebase/database/-/database-1.0.8.tgz",
      "integrity": "sha512-dzXALZeBI1U5TXt6619cv0+tgEhJiwlUtQ55WNZY7vGAjv7Q1QioV969iYwt1AQQ0ovHnEW0YW9TiBfefLvErg==",
      "dependencies": {
        "@firebase/app-check-interop-types": "0.3.2",
        "@firebase/auth-interop-types": "0.2.3",
        "@firebase/component": "0.6.9",
        "@firebase/logger": "0.4.2",
        "@firebase/util": "1.10.0",
        "faye-websocket": "0.11.4",
        "tslib": "^2.1.0"
      }
    },
    "node_modules/@firebase/database-compat": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/@firebase/database-compat/-/database-compat-1.0.8.tgz",
      "integrity": "sha512-OpeWZoPE3sGIRPBKYnW9wLad25RaWbGyk7fFQe4xnJQKRzlynWeFBSRRAoLE2Old01WXwskUiucNqUUVlFsceg==",
      "dependencies": {
        "@firebase/component": "0.6.9",
        "@firebase/database": "1.0.8",
        "@firebase/database-types": "1.0.5",
        "@firebase/logger": "0.4.2",
        "@firebase/util": "1.10.0",
        "tslib": "^2.1.0"
      }
    },
    "node_modules/@firebase/database-types": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/@firebase/database-types/-/database-types-1.0.5.tgz",
      "integrity": "sha512-fTlqCNwFYyq/C6W7AJ5OCuq5CeZuBEsEwptnVxlNPkWCo5cTTyukzAHRSO/jaQcItz33FfYrrFk1SJofcu2AaQ==",
      "dependencies": {
        "@firebase/app-types": "0.9.2",
        "@firebase/util": "1.10.0"
      }
    },
    "node_modules/@firebase/logger": {
      "version": "0.4.2",
      "resolved": "https://registry.npmjs.org/@firebase/logger/-/logger-0.4.2.tgz",
      "integrity": "sha512-Q1VuA5M1Gjqrwom6I6NUU4lQXdo9IAQieXlujeHZWvRt1b7qQ0KwBaNAjgxG27jgF9/mUwsNmO8ptBCGVYhB0A==",
      "dependencies": {
        "tslib": "^2.1.0"
      }
    },
    "node_modules/@firebase/util": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@firebase/util/-/util-1.10.0.tgz",
      "integrity": "sha512-xKtx4A668icQqoANRxyDLBLz51TAbDP9KRfpbKGxiCAW346d0BeJe5vN6/hKxxmWwnZ0mautyv39JxviwwQMOQ==",
      "dependencies": {
        "tslib": "^2.1.0"
      }
    },
    "node_modules/@genkit-ai/ai": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/@genkit-ai/ai/-/ai-1.0.4.tgz",
      "integrity": "sha512-omByB//cj5476YU+wdoVuhNI0En85kITjSxVwqVBz94hcP5hYhQfcfhNlN6BzhgNJER7XACyYKWehmw4KwxoLQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@genkit-ai/core": "1.0.4",
        "@opentelemetry/api": "^1.9.0",
        "@types/node": "^20.11.19",
        "colorette": "^2.0.20",
        "dotprompt": "^1.0.0",
        "json5": "^2.2.3",
        "node-fetch": "^3.3.2",
        "partial-json": "^0.1.7",
        "uuid": "^10.0.0"
      }
    },
    "node_modules/@genkit-ai/ai/node_modules/@types/node": {
      "version": "20.17.17",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-20.17.17.tgz",
      "integrity": "sha512-/WndGO4kIfMicEQLTi/mDANUu/iVUhT7KboZPdEqqHQ4aTS+3qT3U5gIqWDFV+XouorjfgGqvKILJeHhuQgFYg==",
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.19.2"
      }
    },
    "node_modules/@genkit-ai/ai/node_modules/node-fetch": {
      "version": "3.3.2",
      "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-3.3.2.tgz",
      "integrity": "sha512-dRB78srN/l6gqWulah9SrxeYnxeddIG30+GOqK/9OlLVyLg3HPnr6SqOWTWOXKRwC2eGYCkZ59NNuSgvSrpgOA==",
      "license": "MIT",
      "dependencies": {
        "data-uri-to-buffer": "^4.0.0",
        "fetch-blob": "^3.1.4",
        "formdata-polyfill": "^4.0.10"
      },
      "engines": {
        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/node-fetch"
      }
    },
    "node_modules/@genkit-ai/ai/node_modules/undici-types": {
      "version": "6.19.8",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.19.8.tgz",
      "integrity": "sha512-ve2KP6f/JnbPBFyobGHuerC9g1FYGn/F8n1LWTwNxCEzd6IfqTwUQcNXgEtmmQ6DlRrC1hrSrBnCZPokRrDHjw==",
      "license": "MIT"
    },
    "node_modules/@genkit-ai/core": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/@genkit-ai/core/-/core-1.0.4.tgz",
      "integrity": "sha512-O4ASgeXLkjc8qyhgUhY9TV//V0W6tvhv7YV0LEdeQ6Vum7CvdBNB1w8moUQADeyMPE00VuqURcGKpejVshY3OQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/api": "^1.9.0",
        "@opentelemetry/context-async-hooks": "^1.25.0",
        "@opentelemetry/core": "^1.25.0",
        "@opentelemetry/sdk-metrics": "^1.25.0",
        "@opentelemetry/sdk-node": "^0.52.0",
        "@opentelemetry/sdk-trace-base": "^1.25.0",
        "@types/json-schema": "^7.0.15",
        "ajv": "^8.12.0",
        "ajv-formats": "^3.0.1",
        "async-mutex": "^0.5.0",
        "body-parser": "^1.20.3",
        "cors": "^2.8.5",
        "dotprompt": "^1.0.0",
        "express": "^4.21.0",
        "get-port": "^5.1.0",
        "json-schema": "^0.4.0",
        "zod": "^3.23.8",
        "zod-to-json-schema": "^3.22.4"
      }
    },
    "node_modules/@genkit-ai/firebase": {
      "version": "0.9.12",
      "resolved": "https://registry.npmjs.org/@genkit-ai/firebase/-/firebase-0.9.12.tgz",
      "integrity": "sha512-PbEAPO3GTENaJR5RUqrq88YIVxgkVi2pc82kOCrkJDpw/+PcyRIZcgvbQYSAzB932yVU0sy33zzdUfg9t2thMA==",
      "dependencies": {
        "@genkit-ai/google-cloud": "0.9.12",
        "express": "^4.21.0",
        "google-auth-library": "^9.6.3"
      },
      "peerDependencies": {
        "@google-cloud/firestore": "^7.6.0",
        "firebase-admin": ">=12.2",
        "firebase-functions": ">=4.8",
        "genkit": "0.9.12"
      }
    },
    "node_modules/@genkit-ai/firebase/node_modules/@genkit-ai/google-cloud": {
      "version": "0.9.12",
      "resolved": "https://registry.npmjs.org/@genkit-ai/google-cloud/-/google-cloud-0.9.12.tgz",
      "integrity": "sha512-hYDvdQmGdI/JC6hUa6hMs6+Kc04wmi+/54zJIB+EOiNLd6fJ193B+q/pHqI4UxvofJPsf9C6VTK5Q54+yyQm7w==",
      "license": "Apache-2.0",
      "dependencies": {
        "@google-cloud/logging-winston": "^6.0.0",
        "@google-cloud/opentelemetry-cloud-monitoring-exporter": "^0.19.0",
        "@google-cloud/opentelemetry-cloud-trace-exporter": "^2.4.1",
        "@google-cloud/opentelemetry-resource-util": "^2.4.0",
        "@opentelemetry/api": "^1.9.0",
        "@opentelemetry/auto-instrumentations-node": "^0.49.1",
        "@opentelemetry/core": "^1.25.0",
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/instrumentation-pino": "^0.41.0",
        "@opentelemetry/instrumentation-winston": "^0.39.0",
        "@opentelemetry/resources": "^1.25.0",
        "@opentelemetry/sdk-metrics": "^1.25.0",
        "@opentelemetry/sdk-node": "^0.52.0",
        "@opentelemetry/sdk-trace-base": "^1.25.0",
        "google-auth-library": "^9.6.3",
        "node-fetch": "^3.3.2",
        "winston": "^3.12.0"
      },
      "peerDependencies": {
        "genkit": "0.9.12"
      }
    },
    "node_modules/@genkit-ai/firebase/node_modules/node-fetch": {
      "version": "3.3.2",
      "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-3.3.2.tgz",
      "integrity": "sha512-dRB78srN/l6gqWulah9SrxeYnxeddIG30+GOqK/9OlLVyLg3HPnr6SqOWTWOXKRwC2eGYCkZ59NNuSgvSrpgOA==",
      "license": "MIT",
      "dependencies": {
        "data-uri-to-buffer": "^4.0.0",
        "fetch-blob": "^3.1.4",
        "formdata-polyfill": "^4.0.10"
      },
      "engines": {
        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/node-fetch"
      }
    },
    "node_modules/@genkit-ai/googleai": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/@genkit-ai/googleai/-/googleai-1.0.4.tgz",
      "integrity": "sha512-sTMj5lO5t9lBV0l0bC/3Ijr02XhRY1ztttOgJFJHMtlWw+ML9gdrphPMLcY1VdAVKAaxX+MeHND5tj4oWvp6xQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@google/generative-ai": "^0.21.0",
        "google-auth-library": "^9.6.3",
        "node-fetch": "^3.3.2"
      },
      "peerDependencies": {
        "genkit": "^1.0.4"
      }
    },
    "node_modules/@genkit-ai/googleai/node_modules/node-fetch": {
      "version": "3.3.2",
      "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-3.3.2.tgz",
      "integrity": "sha512-dRB78srN/l6gqWulah9SrxeYnxeddIG30+GOqK/9OlLVyLg3HPnr6SqOWTWOXKRwC2eGYCkZ59NNuSgvSrpgOA==",
      "license": "MIT",
      "dependencies": {
        "data-uri-to-buffer": "^4.0.0",
        "fetch-blob": "^3.1.4",
        "formdata-polyfill": "^4.0.10"
      },
      "engines": {
        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/node-fetch"
      }
    },
    "node_modules/@genkit-ai/telemetry-server": {
      "version": "0.9.12",
      "resolved": "https://registry.npmjs.org/@genkit-ai/telemetry-server/-/telemetry-server-0.9.12.tgz",
      "integrity": "sha512-8w1O9LOUtMCGc8bx+Vcd5D68L8ctM6H544Vxnfvy8gx4JHV5dj7vQiI9YDgm65pgP15pytQzt1TcRtOtYoimFw==",
      "dev": true,
      "dependencies": {
        "@asteasolutions/zod-to-openapi": "^7.0.0",
        "@genkit-ai/tools-common": "0.9.12",
        "@google-cloud/firestore": "^7.6.0",
        "@opentelemetry/api": "^1.9.0",
        "@opentelemetry/context-async-hooks": "^1.25.0",
        "@opentelemetry/core": "^1.25.0",
        "@opentelemetry/sdk-metrics": "^1.25.0",
        "@opentelemetry/sdk-node": "^0.52.0",
        "@opentelemetry/sdk-trace-base": "^1.25.0",
        "async-mutex": "^0.5.0",
        "express": "^4.21.0",
        "zod": "^3.22.4"
      }
    },
    "node_modules/@genkit-ai/tools-common": {
      "version": "0.9.12",
      "resolved": "https://registry.npmjs.org/@genkit-ai/tools-common/-/tools-common-0.9.12.tgz",
      "integrity": "sha512-A9ToM/CY6vxcBSw4o47Q7qrpMaRsk4P6ZuzoDMlCzCVI+RZN5ulTL4LXMrq6nQ/KxY1GT94bSoulROXBMzW/Gw==",
      "dev": true,
      "dependencies": {
        "@asteasolutions/zod-to-openapi": "^7.0.0",
        "@trpc/server": "10.45.0",
        "adm-zip": "^0.5.12",
        "axios": "^1.7.7",
        "body-parser": "^1.20.2",
        "chokidar": "^3.5.3",
        "colorette": "^2.0.20",
        "commander": "^11.1.0",
        "configstore": "^5.0.1",
        "express": "^4.21.0",
        "get-port": "5.1.1",
        "glob": "^10.3.12",
        "inquirer": "^8.2.0",
        "js-yaml": "^4.1.0",
        "json-2-csv": "^5.5.1",
        "json-schema": "^0.4.0",
        "terminate": "^2.6.1",
        "tsx": "^4.19.2",
        "uuid": "^9.0.1",
        "winston": "^3.11.0",
        "yaml": "^2.4.1",
        "zod": "^3.22.4",
        "zod-to-json-schema": "^3.22.4"
      }
    },
    "node_modules/@genkit-ai/tools-common/node_modules/argparse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
      "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==",
      "dev": true
    },
    "node_modules/@genkit-ai/tools-common/node_modules/brace-expansion": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-2.0.1.tgz",
      "integrity": "sha512-XnAIvQ8eM+kC6aULx6wuQiwVsnzsi9d3WxzV3FpWTGA19F621kwdbsAcFKXgKUHZWsy+mY6iL1sHTxWEFCytDA==",
      "dev": true,
      "dependencies": {
        "balanced-match": "^1.0.0"
      }
    },
    "node_modules/@genkit-ai/tools-common/node_modules/glob": {
      "version": "10.4.5",
      "resolved": "https://registry.npmjs.org/glob/-/glob-10.4.5.tgz",
      "integrity": "sha512-7Bv8RF0k6xjo7d4A/PxYLbUCfb6c+Vpd2/mB2yRDlew7Jb5hEXiCD9ibfO7wpk8i4sevK6DFny9h7EYbM3/sHg==",
      "dev": true,
      "dependencies": {
        "foreground-child": "^3.1.0",
        "jackspeak": "^3.1.2",
        "minimatch": "^9.0.4",
        "minipass": "^7.1.2",
        "package-json-from-dist": "^1.0.0",
        "path-scurry": "^1.11.1"
      },
      "bin": {
        "glob": "dist/esm/bin.mjs"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@genkit-ai/tools-common/node_modules/js-yaml": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.1.0.tgz",
      "integrity": "sha512-wpxZs9NoxZaJESJGIZTyDEaYpl0FKSA+FB9aJiyemKhMwkxQg63h4T1KJgUGHpTqPDNRcmmYLugrRjJlBtWvRA==",
      "dev": true,
      "dependencies": {
        "argparse": "^2.0.1"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/@genkit-ai/tools-common/node_modules/minimatch": {
      "version": "9.0.5",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-9.0.5.tgz",
      "integrity": "sha512-G6T0ZX48xgozx7587koeX9Ys2NYy6Gmv//P89sEte9V9whIapMNF4idKxnW2QtCcLiTWlb/wfCabAtAFWhhBow==",
      "dev": true,
      "dependencies": {
        "brace-expansion": "^2.0.1"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@genkit-ai/tools-common/node_modules/uuid": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-9.0.1.tgz",
      "integrity": "sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==",
      "dev": true,
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/@genkit-ai/vertexai": {
      "version": "0.9.12",
      "resolved": "https://registry.npmjs.org/@genkit-ai/vertexai/-/vertexai-0.9.12.tgz",
      "integrity": "sha512-lA6lwh5jgYgFr7RsFCXs+iASUZI2CmrGQEJCR+/qKJTNG0OyI4O7CdoT5SZSc1fK7oXeWH0/4x6mIwcngjy2Gw==",
      "dependencies": {
        "@anthropic-ai/sdk": "^0.24.3",
        "@anthropic-ai/vertex-sdk": "^0.4.0",
        "@google-cloud/aiplatform": "^3.23.0",
        "@google-cloud/vertexai": "^1.9.0",
        "@mistralai/mistralai-gcp": "^1.3.5",
        "google-auth-library": "^9.14.2",
        "googleapis": "^140.0.1",
        "node-fetch": "^3.3.2",
        "openai": "^4.52.7"
      },
      "optionalDependencies": {
        "@google-cloud/bigquery": "^7.8.0",
        "firebase-admin": ">=12.2"
      },
      "peerDependencies": {
        "genkit": "0.9.12"
      }
    },
    "node_modules/@genkit-ai/vertexai/node_modules/node-fetch": {
      "version": "3.3.2",
      "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-3.3.2.tgz",
      "integrity": "sha512-dRB78srN/l6gqWulah9SrxeYnxeddIG30+GOqK/9OlLVyLg3HPnr6SqOWTWOXKRwC2eGYCkZ59NNuSgvSrpgOA==",
      "dependencies": {
        "data-uri-to-buffer": "^4.0.0",
        "fetch-blob": "^3.1.4",
        "formdata-polyfill": "^4.0.10"
      },
      "engines": {
        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/node-fetch"
      }
    },
    "node_modules/@google-cloud/aiplatform": {
      "version": "3.34.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/aiplatform/-/aiplatform-3.34.0.tgz",
      "integrity": "sha512-Ii1CXJ59g5hcVYNZOx08XBV5nq0JIOSo2I9uC/WYkdXWekc3XSV9emRz8pKOQSULzrTOTnD80N4re49S07xfyQ==",
      "dependencies": {
        "google-gax": "^4.0.3",
        "protobuf.js": "^1.1.2"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@google-cloud/bigquery": {
      "version": "7.9.1",
      "resolved": "https://registry.npmjs.org/@google-cloud/bigquery/-/bigquery-7.9.1.tgz",
      "integrity": "sha512-ZkcRMpBoFLxIh6TiQBywA22yT3c2j0f07AHWEMjtYqMQzZQbFrpxuJU2COp3tyjZ91ZIGHe4gY7/dGZL88cltg==",
      "optional": true,
      "dependencies": {
        "@google-cloud/common": "^5.0.0",
        "@google-cloud/paginator": "^5.0.2",
        "@google-cloud/precise-date": "^4.0.0",
        "@google-cloud/promisify": "^4.0.0",
        "arrify": "^2.0.1",
        "big.js": "^6.0.0",
        "duplexify": "^4.0.0",
        "extend": "^3.0.2",
        "is": "^3.3.0",
        "stream-events": "^1.0.5",
        "uuid": "^9.0.0"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@google-cloud/bigquery/node_modules/uuid": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-9.0.1.tgz",
      "integrity": "sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "optional": true,
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/@google-cloud/common": {
      "version": "5.0.2",
      "resolved": "https://registry.npmjs.org/@google-cloud/common/-/common-5.0.2.tgz",
      "integrity": "sha512-V7bmBKYQyu0eVG2BFejuUjlBt+zrya6vtsKdY+JxMM/dNntPF41vZ9+LhOshEUH01zOHEqBSvI7Dad7ZS6aUeA==",
      "dependencies": {
        "@google-cloud/projectify": "^4.0.0",
        "@google-cloud/promisify": "^4.0.0",
        "arrify": "^2.0.1",
        "duplexify": "^4.1.1",
        "extend": "^3.0.2",
        "google-auth-library": "^9.0.0",
        "html-entities": "^2.5.2",
        "retry-request": "^7.0.0",
        "teeny-request": "^9.0.0"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@google-cloud/firestore": {
      "version": "7.11.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/firestore/-/firestore-7.11.0.tgz",
      "integrity": "sha512-88uZ+jLsp1aVMj7gh3EKYH1aulTAMFAp8sH/v5a9w8q8iqSG27RiWLoxSAFr/XocZ9hGiWH1kEnBw+zl3xAgNA==",
      "dependencies": {
        "@opentelemetry/api": "^1.3.0",
        "fast-deep-equal": "^3.1.1",
        "functional-red-black-tree": "^1.0.1",
        "google-gax": "^4.3.3",
        "protobufjs": "^7.2.6"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@google-cloud/logging": {
      "version": "11.2.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/logging/-/logging-11.2.0.tgz",
      "integrity": "sha512-Ma94jvuoMpbgNniwtelOt8w82hxK62FuOXZonEv0Hyk3B+/YVuLG/SWNyY9yMso/RXnPEc1fP2qo9kDrjf/b2w==",
      "license": "Apache-2.0",
      "dependencies": {
        "@google-cloud/common": "^5.0.0",
        "@google-cloud/paginator": "^5.0.0",
        "@google-cloud/projectify": "^4.0.0",
        "@google-cloud/promisify": "^4.0.0",
        "@opentelemetry/api": "^1.7.0",
        "arrify": "^2.0.1",
        "dot-prop": "^6.0.0",
        "eventid": "^2.0.0",
        "extend": "^3.0.2",
        "gcp-metadata": "^6.0.0",
        "google-auth-library": "^9.0.0",
        "google-gax": "^4.0.3",
        "on-finished": "^2.3.0",
        "pumpify": "^2.0.1",
        "stream-events": "^1.0.5",
        "uuid": "^9.0.0"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@google-cloud/logging-winston": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/logging-winston/-/logging-winston-6.0.0.tgz",
      "integrity": "sha512-/lVp7CyT3nFOr+AjQlZnJhTIOf+kcNGB4JTziL0fkX6Ov/2qNKtRGS/NqE6cD+VSPiv5jLOty3LgkRsXMpYxQQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@google-cloud/logging": "^11.0.0",
        "google-auth-library": "^9.0.0",
        "lodash.mapvalues": "^4.6.0",
        "winston-transport": "^4.3.0"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "peerDependencies": {
        "winston": ">=3.2.1"
      }
    },
    "node_modules/@google-cloud/logging/node_modules/dot-prop": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/dot-prop/-/dot-prop-6.0.1.tgz",
      "integrity": "sha512-tE7ztYzXHIeyvc7N+hR3oi7FIbf/NIjVP9hmAt3yMXzrQ072/fpjGLx2GxNxGxUl5V73MEqYzioOMoVhGMJ5cA==",
      "license": "MIT",
      "dependencies": {
        "is-obj": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@google-cloud/logging/node_modules/uuid": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-9.0.1.tgz",
      "integrity": "sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "license": "MIT",
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/@google-cloud/opentelemetry-cloud-monitoring-exporter": {
      "version": "0.19.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/opentelemetry-cloud-monitoring-exporter/-/opentelemetry-cloud-monitoring-exporter-0.19.0.tgz",
      "integrity": "sha512-5SOPXwC6RET4ZvXxw5D97dp8fWpqWEunHrzrUUGXhG4UAeedQe1KvYV8CK+fnaAbN2l2ha6QDYspT6z40TVY0g==",
      "license": "Apache-2.0",
      "dependencies": {
        "@google-cloud/opentelemetry-resource-util": "^2.3.0",
        "@google-cloud/precise-date": "^4.0.0",
        "google-auth-library": "^9.0.0",
        "googleapis": "^137.0.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0",
        "@opentelemetry/core": "^1.0.0",
        "@opentelemetry/resources": "^1.0.0",
        "@opentelemetry/sdk-metrics": "^1.0.0"
      }
    },
    "node_modules/@google-cloud/opentelemetry-cloud-monitoring-exporter/node_modules/googleapis": {
      "version": "137.1.0",
      "resolved": "https://registry.npmjs.org/googleapis/-/googleapis-137.1.0.tgz",
      "integrity": "sha512-2L7SzN0FLHyQtFmyIxrcXhgust77067pkkduqkbIpDuj9JzVnByxsRrcRfUMFQam3rQkWW2B0f1i40IwKDWIVQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "google-auth-library": "^9.0.0",
        "googleapis-common": "^7.0.0"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@google-cloud/opentelemetry-cloud-trace-exporter": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/@google-cloud/opentelemetry-cloud-trace-exporter/-/opentelemetry-cloud-trace-exporter-2.4.1.tgz",
      "integrity": "sha512-Dq2IyAyA9PCjbjLOn86i2byjkYPC59b5ic8k/L4q5bBWH0Jro8lzMs8C0G5pJfqh2druj8HF+oAIAlSdWQ+Z9Q==",
      "license": "Apache-2.0",
      "dependencies": {
        "@google-cloud/opentelemetry-resource-util": "^2.4.0",
        "@grpc/grpc-js": "^1.1.8",
        "@grpc/proto-loader": "^0.7.0",
        "google-auth-library": "^9.0.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0",
        "@opentelemetry/core": "^1.0.0",
        "@opentelemetry/resources": "^1.0.0",
        "@opentelemetry/sdk-trace-base": "^1.0.0"
      }
    },
    "node_modules/@google-cloud/opentelemetry-resource-util": {
      "version": "2.4.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/opentelemetry-resource-util/-/opentelemetry-resource-util-2.4.0.tgz",
      "integrity": "sha512-/7ujlMoKtDtrbQlJihCjQnm31n2s2RTlvJqcSbt2jV3OkCzPAdo3u31Q13HNugqtIRUSk7bUoLx6AzhURkhW4w==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "^1.22.0",
        "gcp-metadata": "^6.0.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/resources": "^1.0.0"
      }
    },
    "node_modules/@google-cloud/paginator": {
      "version": "5.0.2",
      "resolved": "https://registry.npmjs.org/@google-cloud/paginator/-/paginator-5.0.2.tgz",
      "integrity": "sha512-DJS3s0OVH4zFDB1PzjxAsHqJT6sKVbRwwML0ZBP9PbU7Yebtu/7SWMRzvO2J3nUi9pRNITCfu4LJeooM2w4pjg==",
      "dependencies": {
        "arrify": "^2.0.0",
        "extend": "^3.0.2"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@google-cloud/precise-date": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/precise-date/-/precise-date-4.0.0.tgz",
      "integrity": "sha512-1TUx3KdaU3cN7nfCdNf+UVqA/PSX29Cjcox3fZZBtINlRrXVTmUkQnCKv2MbBUbCopbK4olAT1IHl76uZyCiVA==",
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@google-cloud/projectify": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/projectify/-/projectify-4.0.0.tgz",
      "integrity": "sha512-MmaX6HeSvyPbWGwFq7mXdo0uQZLGBYCwziiLIGq5JVX+/bdI3SAq6bP98trV5eTWfLuvsMcIC1YJOF2vfteLFA==",
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@google-cloud/promisify": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/promisify/-/promisify-4.0.0.tgz",
      "integrity": "sha512-Orxzlfb9c67A15cq2JQEyVc7wEsmFBmHjZWZYQMUyJ1qivXyMwdyNOs9odi79hze+2zqdTtu1E19IM/FtqZ10g==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@google-cloud/storage": {
      "version": "7.15.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/storage/-/storage-7.15.0.tgz",
      "integrity": "sha512-/j/+8DFuEOo33fbdX0V5wjooOoFahEaMEdImHBmM2tH9MPHJYNtmXOf2sGUmZmiufSukmBEvdlzYgDkkgeBiVQ==",
      "optional": true,
      "dependencies": {
        "@google-cloud/paginator": "^5.0.0",
        "@google-cloud/projectify": "^4.0.0",
        "@google-cloud/promisify": "^4.0.0",
        "abort-controller": "^3.0.0",
        "async-retry": "^1.3.3",
        "duplexify": "^4.1.3",
        "fast-xml-parser": "^4.4.1",
        "gaxios": "^6.0.2",
        "google-auth-library": "^9.6.3",
        "html-entities": "^2.5.2",
        "mime": "^3.0.0",
        "p-limit": "^3.0.1",
        "retry-request": "^7.0.0",
        "teeny-request": "^9.0.0",
        "uuid": "^8.0.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@google-cloud/storage/node_modules/uuid": {
      "version": "8.3.2",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-8.3.2.tgz",
      "integrity": "sha512-+NYs2QeMWy+GWFOEm9xnn6HCDp0l7QBD7ml8zLUmJ+93Q5NF0NocErnwkTkXVFNiX3/fpC6afS8Dhb/gz7R7eg==",
      "optional": true,
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/@google-cloud/vertexai": {
      "version": "1.9.2",
      "resolved": "https://registry.npmjs.org/@google-cloud/vertexai/-/vertexai-1.9.2.tgz",
      "integrity": "sha512-pJSUG3r5QIvCFNfkz7/y7kEqvEJaVAk0jZbZoKbcPCRUnXaUeAq7p8I0oklqetGyxbUcZ2FOGpt+Y+4uIltVPg==",
      "dependencies": {
        "google-auth-library": "^9.1.0"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/@google/generative-ai": {
      "version": "0.21.0",
      "resolved": "https://registry.npmjs.org/@google/generative-ai/-/generative-ai-0.21.0.tgz",
      "integrity": "sha512-7XhUbtnlkSEZK15kN3t+tzIMxsbKm/dSkKBFalj+20NvPKe1kBY7mR2P7vuijEn+f06z5+A8bVGKO0v39cr6Wg==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/@grpc/grpc-js": {
      "version": "1.12.5",
      "resolved": "https://registry.npmjs.org/@grpc/grpc-js/-/grpc-js-1.12.5.tgz",
      "integrity": "sha512-d3iiHxdpg5+ZcJ6jnDSOT8Z0O0VMVGy34jAnYLUX8yd36b1qn8f1TwOA/Lc7TsOh03IkPJ38eGI5qD2EjNkoEA==",
      "dependencies": {
        "@grpc/proto-loader": "^0.7.13",
        "@js-sdsl/ordered-map": "^4.4.2"
      },
      "engines": {
        "node": ">=12.10.0"
      }
    },
    "node_modules/@grpc/proto-loader": {
      "version": "0.7.13",
      "resolved": "https://registry.npmjs.org/@grpc/proto-loader/-/proto-loader-0.7.13.tgz",
      "integrity": "sha512-AiXO/bfe9bmxBjxxtYxFAXGZvMaN5s8kO+jBHAJCON8rJoB5YS/D6X7ZNc6XQkuHNmyl4CYaMI1fJ/Gn27RGGw==",
      "dependencies": {
        "lodash.camelcase": "^4.3.0",
        "long": "^5.0.0",
        "protobufjs": "^7.2.5",
        "yargs": "^17.7.2"
      },
      "bin": {
        "proto-loader-gen-types": "build/bin/proto-loader-gen-types.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/@humanfs/core": {
      "version": "0.19.1",
      "resolved": "https://registry.npmjs.org/@humanfs/core/-/core-0.19.1.tgz",
      "integrity": "sha512-5DyQ4+1JEUzejeK1JGICcideyfUbGixgS9jNgex5nqkW+cY7WZhxBigmieN5Qnw9ZosSNVC9KQKyb+GUaGyKUA==",
      "dev": true,
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/node": {
      "version": "0.16.6",
      "resolved": "https://registry.npmjs.org/@humanfs/node/-/node-0.16.6.tgz",
      "integrity": "sha512-YuI2ZHQL78Q5HbhDiBA1X4LmYdXCKCMQIfw0pw7piHJwyREFebJUvrQN4cMssyES6x+vfUbx1CIpaQUKYdQZOw==",
      "dev": true,
      "dependencies": {
        "@humanfs/core": "^0.19.1",
        "@humanwhocodes/retry": "^0.3.0"
      },
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/node/node_modules/@humanwhocodes/retry": {
      "version": "0.3.1",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/retry/-/retry-0.3.1.tgz",
      "integrity": "sha512-JBxkERygn7Bv/GbN5Rv8Ul6LVknS+5Bp6RgDC/O8gEBU/yeH5Ui5C/OlWrTb6qct7LjjfT6Re2NxB0ln0yYybA==",
      "dev": true,
      "engines": {
        "node": ">=18.18"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@humanwhocodes/module-importer": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz",
      "integrity": "sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==",
      "dev": true,
      "engines": {
        "node": ">=12.22"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@humanwhocodes/retry": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/retry/-/retry-0.4.1.tgz",
      "integrity": "sha512-c7hNEllBlenFTHBky65mhq8WD2kbN9Q6gk0bTk8lSBvc554jpXSkST1iePudpt7+A/AQvuHs9EMqjHDXMY1lrA==",
      "dev": true,
      "engines": {
        "node": ">=18.18"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@isaacs/cliui": {
      "version": "8.0.2",
      "resolved": "https://registry.npmjs.org/@isaacs/cliui/-/cliui-8.0.2.tgz",
      "integrity": "sha512-O8jcjabXaleOG9DQ0+ARXWZBTfnP4WNAqzuiJK7ll44AmxGKv/J2M4TPjxjY3znBCfvBXFzucm1twdyFybFqEA==",
      "dev": true,
      "dependencies": {
        "string-width": "^5.1.2",
        "string-width-cjs": "npm:string-width@^4.2.0",
        "strip-ansi": "^7.0.1",
        "strip-ansi-cjs": "npm:strip-ansi@^6.0.1",
        "wrap-ansi": "^8.1.0",
        "wrap-ansi-cjs": "npm:wrap-ansi@^7.0.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@isaacs/cliui/node_modules/ansi-regex": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-6.1.0.tgz",
      "integrity": "sha512-7HSX4QQb4CspciLpVFwyRe79O3xsIZDDLER21kERQ71oaPodF8jL725AgJMFAYbooIqolJoRLuM81SpeUkpkvA==",
      "dev": true,
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-regex?sponsor=1"
      }
    },
    "node_modules/@isaacs/cliui/node_modules/ansi-styles": {
      "version": "6.2.1",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-6.2.1.tgz",
      "integrity": "sha512-bN798gFfQX+viw3R7yrGWRqnrN2oRkEkUjjl4JNn4E8GxxbjtG3FbrEIIY3l8/hrwUwIeCZvi4QuOTP4MErVug==",
      "dev": true,
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/@isaacs/cliui/node_modules/emoji-regex": {
      "version": "9.2.2",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-9.2.2.tgz",
      "integrity": "sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==",
      "dev": true
    },
    "node_modules/@isaacs/cliui/node_modules/string-width": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-5.1.2.tgz",
      "integrity": "sha512-HnLOCR3vjcY8beoNLtcjZ5/nxn2afmME6lhrDrebokqMap+XbeW8n9TXpPDOqdGK5qcI3oT0GKTW6wC7EMiVqA==",
      "dev": true,
      "dependencies": {
        "eastasianwidth": "^0.2.0",
        "emoji-regex": "^9.2.2",
        "strip-ansi": "^7.0.1"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@isaacs/cliui/node_modules/strip-ansi": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-7.1.0.tgz",
      "integrity": "sha512-iq6eVVI64nQQTRYq2KtEg2d2uU7LElhTJwsH4YzIHZshxlgZms/wIc4VoDQTlG/IvVIrBKG06CrZnp0qv7hkcQ==",
      "dev": true,
      "dependencies": {
        "ansi-regex": "^6.0.1"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/strip-ansi?sponsor=1"
      }
    },
    "node_modules/@isaacs/cliui/node_modules/wrap-ansi": {
      "version": "8.1.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-8.1.0.tgz",
      "integrity": "sha512-si7QWI6zUMq56bESFvagtmzMdGOtoxfR+Sez11Mobfc7tm+VkUckk9bW2UeffTGVUbOksxmSw0AA2gs8g71NCQ==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^6.1.0",
        "string-width": "^5.0.1",
        "strip-ansi": "^7.0.1"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/@istanbuljs/load-nyc-config": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@istanbuljs/load-nyc-config/-/load-nyc-config-1.1.0.tgz",
      "integrity": "sha512-VjeHSlIzpv/NyD3N0YuHfXOPDIixcA1q2ZV98wsMqcYlPmv2n3Yb2lYP9XMElnaFVXg5A7YLTeLu6V84uQDjmQ==",
      "dev": true,
      "license": "ISC",
      "peer": true,
      "dependencies": {
        "camelcase": "^5.3.1",
        "find-up": "^4.1.0",
        "get-package-type": "^0.1.0",
        "js-yaml": "^3.13.1",
        "resolve-from": "^5.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/@istanbuljs/schema": {
      "version": "0.1.3",
      "resolved": "https://registry.npmjs.org/@istanbuljs/schema/-/schema-0.1.3.tgz",
      "integrity": "sha512-ZXRY4jNvVgSVQ8DL3LTcakaAtXwTVUxE81hslsyD2AtoXW/wVob10HkOJ1X/pAlcI7D+2YoZKg5do8G/w6RYgA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/@jest/console": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/@jest/console/-/console-29.7.0.tgz",
      "integrity": "sha512-5Ni4CU7XHQi32IJ398EEP4RrB8eV09sXP2ROqD4bksHrnTree52PsxvX8tpL8LvTZ3pFzXyPbNQReSN41CAhOg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/types": "^29.6.3",
        "@types/node": "*",
        "chalk": "^4.0.0",
        "jest-message-util": "^29.7.0",
        "jest-util": "^29.7.0",
        "slash": "^3.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jest/core": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/@jest/core/-/core-29.7.0.tgz",
      "integrity": "sha512-n7aeXWKMnGtDA48y8TLWJPJmLmmZ642Ceo78cYWEpiD7FzDgmNDV/GCVRorPABdXLJZ/9wzzgZAlHjXjxDHGsg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/console": "^29.7.0",
        "@jest/reporters": "^29.7.0",
        "@jest/test-result": "^29.7.0",
        "@jest/transform": "^29.7.0",
        "@jest/types": "^29.6.3",
        "@types/node": "*",
        "ansi-escapes": "^4.2.1",
        "chalk": "^4.0.0",
        "ci-info": "^3.2.0",
        "exit": "^0.1.2",
        "graceful-fs": "^4.2.9",
        "jest-changed-files": "^29.7.0",
        "jest-config": "^29.7.0",
        "jest-haste-map": "^29.7.0",
        "jest-message-util": "^29.7.0",
        "jest-regex-util": "^29.6.3",
        "jest-resolve": "^29.7.0",
        "jest-resolve-dependencies": "^29.7.0",
        "jest-runner": "^29.7.0",
        "jest-runtime": "^29.7.0",
        "jest-snapshot": "^29.7.0",
        "jest-util": "^29.7.0",
        "jest-validate": "^29.7.0",
        "jest-watcher": "^29.7.0",
        "micromatch": "^4.0.4",
        "pretty-format": "^29.7.0",
        "slash": "^3.0.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      },
      "peerDependencies": {
        "node-notifier": "^8.0.1 || ^9.0.0 || ^10.0.0"
      },
      "peerDependenciesMeta": {
        "node-notifier": {
          "optional": true
        }
      }
    },
    "node_modules/@jest/environment": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/@jest/environment/-/environment-29.7.0.tgz",
      "integrity": "sha512-aQIfHDq33ExsN4jP1NWGXhxgQ/wixs60gDiKO+XVMd8Mn0NWPWgc34ZQDTb2jKaUWQ7MuwoitXAsN2XVXNMpAw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/fake-timers": "^29.7.0",
        "@jest/types": "^29.6.3",
        "@types/node": "*",
        "jest-mock": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jest/expect": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/@jest/expect/-/expect-29.7.0.tgz",
      "integrity": "sha512-8uMeAMycttpva3P1lBHB8VciS9V0XAr3GymPpipdyQXbBcuhkLQOSe8E/p92RyAdToS6ZD1tFkX+CkhoECE0dQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "expect": "^29.7.0",
        "jest-snapshot": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jest/expect-utils": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/@jest/expect-utils/-/expect-utils-29.7.0.tgz",
      "integrity": "sha512-GlsNBWiFQFCVi9QVSx7f5AgMeLxe9YCCs5PuP2O2LdjDAA8Jh9eX7lA1Jq/xdXw3Wb3hyvlFNfZIfcRetSzYcA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "jest-get-type": "^29.6.3"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jest/fake-timers": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/@jest/fake-timers/-/fake-timers-29.7.0.tgz",
      "integrity": "sha512-q4DH1Ha4TTFPdxLsqDXK1d3+ioSL7yL5oCMJZgDYm6i+6CygW5E5xVr/D1HdsGxjt1ZWSfUAs9OxSB/BNelWrQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/types": "^29.6.3",
        "@sinonjs/fake-timers": "^10.0.2",
        "@types/node": "*",
        "jest-message-util": "^29.7.0",
        "jest-mock": "^29.7.0",
        "jest-util": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jest/globals": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/@jest/globals/-/globals-29.7.0.tgz",
      "integrity": "sha512-mpiz3dutLbkW2MNFubUGUEVLkTGiqW6yLVTA+JbP6fI6J5iL9Y0Nlg8k95pcF8ctKwCS7WVxteBs29hhfAotzQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/environment": "^29.7.0",
        "@jest/expect": "^29.7.0",
        "@jest/types": "^29.6.3",
        "jest-mock": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jest/reporters": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/@jest/reporters/-/reporters-29.7.0.tgz",
      "integrity": "sha512-DApq0KJbJOEzAFYjHADNNxAE3KbhxQB1y5Kplb5Waqw6zVbuWatSnMjE5gs8FUgEPmNsnZA3NCWl9NG0ia04Pg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@bcoe/v8-coverage": "^0.2.3",
        "@jest/console": "^29.7.0",
        "@jest/test-result": "^29.7.0",
        "@jest/transform": "^29.7.0",
        "@jest/types": "^29.6.3",
        "@jridgewell/trace-mapping": "^0.3.18",
        "@types/node": "*",
        "chalk": "^4.0.0",
        "collect-v8-coverage": "^1.0.0",
        "exit": "^0.1.2",
        "glob": "^7.1.3",
        "graceful-fs": "^4.2.9",
        "istanbul-lib-coverage": "^3.0.0",
        "istanbul-lib-instrument": "^6.0.0",
        "istanbul-lib-report": "^3.0.0",
        "istanbul-lib-source-maps": "^4.0.0",
        "istanbul-reports": "^3.1.3",
        "jest-message-util": "^29.7.0",
        "jest-util": "^29.7.0",
        "jest-worker": "^29.7.0",
        "slash": "^3.0.0",
        "string-length": "^4.0.1",
        "strip-ansi": "^6.0.0",
        "v8-to-istanbul": "^9.0.1"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      },
      "peerDependencies": {
        "node-notifier": "^8.0.1 || ^9.0.0 || ^10.0.0"
      },
      "peerDependenciesMeta": {
        "node-notifier": {
          "optional": true
        }
      }
    },
    "node_modules/@jest/schemas": {
      "version": "29.6.3",
      "resolved": "https://registry.npmjs.org/@jest/schemas/-/schemas-29.6.3.tgz",
      "integrity": "sha512-mo5j5X+jIZmJQveBKeS/clAueipV7KgiX1vMgCxam1RNYiqE1w62n0/tJJnHtjW8ZHcQco5gY85jA3mi0L+nSA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@sinclair/typebox": "^0.27.8"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jest/source-map": {
      "version": "29.6.3",
      "resolved": "https://registry.npmjs.org/@jest/source-map/-/source-map-29.6.3.tgz",
      "integrity": "sha512-MHjT95QuipcPrpLM+8JMSzFx6eHp5Bm+4XeFDJlwsvVBjmKNiIAvasGK2fxz2WbGRlnvqehFbh07MMa7n3YJnw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jridgewell/trace-mapping": "^0.3.18",
        "callsites": "^3.0.0",
        "graceful-fs": "^4.2.9"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jest/test-result": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/@jest/test-result/-/test-result-29.7.0.tgz",
      "integrity": "sha512-Fdx+tv6x1zlkJPcWXmMDAG2HBnaR9XPSd5aDWQVsfrZmLVT3lU1cwyxLgRmXR9yrq4NBoEm9BMsfgFzTQAbJYA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/console": "^29.7.0",
        "@jest/types": "^29.6.3",
        "@types/istanbul-lib-coverage": "^2.0.0",
        "collect-v8-coverage": "^1.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jest/test-sequencer": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/@jest/test-sequencer/-/test-sequencer-29.7.0.tgz",
      "integrity": "sha512-GQwJ5WZVrKnOJuiYiAF52UNUJXgTZx1NHjFSEB0qEMmSZKAkdMoIzw/Cj6x6NF4AvV23AUqDpFzQkN/eYCYTxw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/test-result": "^29.7.0",
        "graceful-fs": "^4.2.9",
        "jest-haste-map": "^29.7.0",
        "slash": "^3.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jest/transform": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/@jest/transform/-/transform-29.7.0.tgz",
      "integrity": "sha512-ok/BTPFzFKVMwO5eOHRrvnBVHdRy9IrsrW1GpMaQ9MCnilNLXQKmAX8s1YXDFaai9xJpac2ySzV0YeRRECr2Vw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/core": "^7.11.6",
        "@jest/types": "^29.6.3",
        "@jridgewell/trace-mapping": "^0.3.18",
        "babel-plugin-istanbul": "^6.1.1",
        "chalk": "^4.0.0",
        "convert-source-map": "^2.0.0",
        "fast-json-stable-stringify": "^2.1.0",
        "graceful-fs": "^4.2.9",
        "jest-haste-map": "^29.7.0",
        "jest-regex-util": "^29.6.3",
        "jest-util": "^29.7.0",
        "micromatch": "^4.0.4",
        "pirates": "^4.0.4",
        "slash": "^3.0.0",
        "write-file-atomic": "^4.0.2"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jest/types": {
      "version": "29.6.3",
      "resolved": "https://registry.npmjs.org/@jest/types/-/types-29.6.3.tgz",
      "integrity": "sha512-u3UPsIilWKOM3F9CXtrG8LEJmNxwoCQC/XVj4IKYXvvpx7QIi/Kg1LI5uDmDpKlac62NUtX7eLjRh+jVZcLOzw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/schemas": "^29.6.3",
        "@types/istanbul-lib-coverage": "^2.0.0",
        "@types/istanbul-reports": "^3.0.0",
        "@types/node": "*",
        "@types/yargs": "^17.0.8",
        "chalk": "^4.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.8",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.8.tgz",
      "integrity": "sha512-imAbBGkb+ebQyxKgzv5Hu2nmROxoDOXHh80evxdoXNOrvAnVx7zimzc1Oo5h9RlfV4vPXaE2iM5pOFbvOCClWA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jridgewell/set-array": "^1.2.1",
        "@jridgewell/sourcemap-codec": "^1.4.10",
        "@jridgewell/trace-mapping": "^0.3.24"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/set-array": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@jridgewell/set-array/-/set-array-1.2.1.tgz",
      "integrity": "sha512-R8gLRTZeyp03ymzP/6Lil/28tGeGEzhx1q2k703KGWRAI1VdvPIXdG70VJc2pAMw3NA6JKL5hhFu1sJX0Mnn/A==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.0",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.0.tgz",
      "integrity": "sha512-gv3ZRaISU3fjPAgNsriBRqGWQL6quFx04YMPW/zD8XMLsU32mhCCbfbO6KZFLjvYpCZ8zyDEgqsgf+PwPaM7GQ==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.25",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.25.tgz",
      "integrity": "sha512-vNk6aEwybGtawWmy/PzwnGDOjCkLWSD2wqvjGGAgOAwCGWySYXfYoxt00IJkTF+8Lb57DwOb3Aa0o9CApepiYQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@js-sdsl/ordered-map": {
      "version": "4.4.2",
      "resolved": "https://registry.npmjs.org/@js-sdsl/ordered-map/-/ordered-map-4.4.2.tgz",
      "integrity": "sha512-iUKgm52T8HOE/makSxjqoWhe95ZJA1/G1sYsGev2JDKUSS14KAgg1LHb+Ba+IPow0xflbnSkOsZcO08C7w1gYw==",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/js-sdsl"
      }
    },
    "node_modules/@mistralai/mistralai-gcp": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/@mistralai/mistralai-gcp/-/mistralai-gcp-1.4.0.tgz",
      "integrity": "sha512-QYBbR/T1U4qZ88m6l5RpOlhly2mXWsXi0owicSX6zt6pBaMORxRs6ZRLmaYX5BNjGqxQUl+LtsSwpMtXW2uU2A==",
      "dependencies": {
        "google-auth-library": "^9.11.0"
      },
      "peerDependencies": {
        "zod": ">= 3"
      }
    },
    "node_modules/@opentelemetry/api": {
      "version": "1.9.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/api/-/api-1.9.0.tgz",
      "integrity": "sha512-3giAOQvZiH5F9bMlMiv8+GSPMeqg0dbaeo58/0SlA9sxSqZhnUtxzX9/2FzyhS9sWQf5S0GJE0AKBrFqjpeYcg==",
      "engines": {
        "node": ">=8.0.0"
      }
    },
    "node_modules/@opentelemetry/api-logs": {
      "version": "0.52.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/api-logs/-/api-logs-0.52.1.tgz",
      "integrity": "sha512-qnSqB2DQ9TPP96dl8cDubDvrUyWc0/sK81xHTK8eSUspzDM3bsewX903qclQFvVhgStjRWdC5bLb3kQqMkfV5A==",
      "dependencies": {
        "@opentelemetry/api": "^1.0.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/auto-instrumentations-node": {
      "version": "0.49.2",
      "resolved": "https://registry.npmjs.org/@opentelemetry/auto-instrumentations-node/-/auto-instrumentations-node-0.49.2.tgz",
      "integrity": "sha512-xtETEPmAby/3MMmedv8Z/873sdLTWg+Vq98rtm4wbwvAiXBB/ao8qRyzRlvR2MR6puEr+vIB/CXeyJnzNA3cyw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/instrumentation-amqplib": "^0.41.0",
        "@opentelemetry/instrumentation-aws-lambda": "^0.43.0",
        "@opentelemetry/instrumentation-aws-sdk": "^0.43.1",
        "@opentelemetry/instrumentation-bunyan": "^0.40.0",
        "@opentelemetry/instrumentation-cassandra-driver": "^0.40.0",
        "@opentelemetry/instrumentation-connect": "^0.38.0",
        "@opentelemetry/instrumentation-cucumber": "^0.8.0",
        "@opentelemetry/instrumentation-dataloader": "^0.11.0",
        "@opentelemetry/instrumentation-dns": "^0.38.0",
        "@opentelemetry/instrumentation-express": "^0.41.1",
        "@opentelemetry/instrumentation-fastify": "^0.38.0",
        "@opentelemetry/instrumentation-fs": "^0.14.0",
        "@opentelemetry/instrumentation-generic-pool": "^0.38.1",
        "@opentelemetry/instrumentation-graphql": "^0.42.0",
        "@opentelemetry/instrumentation-grpc": "^0.52.0",
        "@opentelemetry/instrumentation-hapi": "^0.40.0",
        "@opentelemetry/instrumentation-http": "^0.52.0",
        "@opentelemetry/instrumentation-ioredis": "^0.42.0",
        "@opentelemetry/instrumentation-kafkajs": "^0.2.0",
        "@opentelemetry/instrumentation-knex": "^0.39.0",
        "@opentelemetry/instrumentation-koa": "^0.42.0",
        "@opentelemetry/instrumentation-lru-memoizer": "^0.39.0",
        "@opentelemetry/instrumentation-memcached": "^0.38.0",
        "@opentelemetry/instrumentation-mongodb": "^0.46.0",
        "@opentelemetry/instrumentation-mongoose": "^0.41.0",
        "@opentelemetry/instrumentation-mysql": "^0.40.0",
        "@opentelemetry/instrumentation-mysql2": "^0.40.0",
        "@opentelemetry/instrumentation-nestjs-core": "^0.39.0",
        "@opentelemetry/instrumentation-net": "^0.38.0",
        "@opentelemetry/instrumentation-pg": "^0.43.0",
        "@opentelemetry/instrumentation-pino": "^0.41.0",
        "@opentelemetry/instrumentation-redis": "^0.41.0",
        "@opentelemetry/instrumentation-redis-4": "^0.41.1",
        "@opentelemetry/instrumentation-restify": "^0.40.0",
        "@opentelemetry/instrumentation-router": "^0.39.0",
        "@opentelemetry/instrumentation-socket.io": "^0.41.0",
        "@opentelemetry/instrumentation-tedious": "^0.13.0",
        "@opentelemetry/instrumentation-undici": "^0.5.0",
        "@opentelemetry/instrumentation-winston": "^0.39.0",
        "@opentelemetry/resource-detector-alibaba-cloud": "^0.29.0",
        "@opentelemetry/resource-detector-aws": "^1.6.0",
        "@opentelemetry/resource-detector-azure": "^0.2.10",
        "@opentelemetry/resource-detector-container": "^0.4.0",
        "@opentelemetry/resource-detector-gcp": "^0.29.10",
        "@opentelemetry/resources": "^1.24.0",
        "@opentelemetry/sdk-node": "^0.52.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.4.1"
      }
    },
    "node_modules/@opentelemetry/context-async-hooks": {
      "version": "1.30.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/context-async-hooks/-/context-async-hooks-1.30.1.tgz",
      "integrity": "sha512-s5vvxXPVdjqS3kTLKMeBMvop9hbWkwzBpu+mUO2M7sZtlkyDJGwFe33wRKnbaYDo8ExRVBIIdwIGrqpxHuKttA==",
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/core": {
      "version": "1.30.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.30.1.tgz",
      "integrity": "sha512-OOCM2C/QIURhJMuKaekP3TRBxBKxG/TWWA0TL2J6nXUtDnuCtccy49LUJF8xPFXMX+0LMcxFpCo8M9cGY1W6rQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.28.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-grpc": {
      "version": "0.52.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/exporter-trace-otlp-grpc/-/exporter-trace-otlp-grpc-0.52.1.tgz",
      "integrity": "sha512-pVkSH20crBwMTqB3nIN4jpQKUEoB0Z94drIHpYyEqs7UBr+I0cpYyOR3bqjA/UasQUMROb3GX8ZX4/9cVRqGBQ==",
      "dependencies": {
        "@grpc/grpc-js": "^1.7.1",
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/otlp-grpc-exporter-base": "0.52.1",
        "@opentelemetry/otlp-transformer": "0.52.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/sdk-trace-base": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-grpc/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-grpc/node_modules/@opentelemetry/resources": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resources/-/resources-1.25.1.tgz",
      "integrity": "sha512-pkZT+iFYIZsVn6+GzM0kSX+u3MSLCY9md+lIJOoKl/P+gJFfxJte/60Usdp8Ce4rOs8GduUpSPNe1ddGyDT1sQ==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-grpc/node_modules/@opentelemetry/sdk-trace-base": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-trace-base/-/sdk-trace-base-1.25.1.tgz",
      "integrity": "sha512-C8k4hnEbc5FamuZQ92nTOp8X/diCY56XUTnMiv9UTuJitCzaNNHAVsdm5+HLCdI8SLQsLWIrG38tddMxLVoftw==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-grpc/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-http": {
      "version": "0.52.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/exporter-trace-otlp-http/-/exporter-trace-otlp-http-0.52.1.tgz",
      "integrity": "sha512-05HcNizx0BxcFKKnS5rwOV+2GevLTVIRA0tRgWYyw4yCgR53Ic/xk83toYKts7kbzcI+dswInUg/4s8oyA+tqg==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/otlp-exporter-base": "0.52.1",
        "@opentelemetry/otlp-transformer": "0.52.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/sdk-trace-base": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-http/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-http/node_modules/@opentelemetry/resources": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resources/-/resources-1.25.1.tgz",
      "integrity": "sha512-pkZT+iFYIZsVn6+GzM0kSX+u3MSLCY9md+lIJOoKl/P+gJFfxJte/60Usdp8Ce4rOs8GduUpSPNe1ddGyDT1sQ==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-http/node_modules/@opentelemetry/sdk-trace-base": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-trace-base/-/sdk-trace-base-1.25.1.tgz",
      "integrity": "sha512-C8k4hnEbc5FamuZQ92nTOp8X/diCY56XUTnMiv9UTuJitCzaNNHAVsdm5+HLCdI8SLQsLWIrG38tddMxLVoftw==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-http/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-proto": {
      "version": "0.52.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/exporter-trace-otlp-proto/-/exporter-trace-otlp-proto-0.52.1.tgz",
      "integrity": "sha512-pt6uX0noTQReHXNeEslQv7x311/F1gJzMnp1HD2qgypLRPbXDeMzzeTngRTUaUbP6hqWNtPxuLr4DEoZG+TcEQ==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/otlp-exporter-base": "0.52.1",
        "@opentelemetry/otlp-transformer": "0.52.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/sdk-trace-base": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-proto/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-proto/node_modules/@opentelemetry/resources": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resources/-/resources-1.25.1.tgz",
      "integrity": "sha512-pkZT+iFYIZsVn6+GzM0kSX+u3MSLCY9md+lIJOoKl/P+gJFfxJte/60Usdp8Ce4rOs8GduUpSPNe1ddGyDT1sQ==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-proto/node_modules/@opentelemetry/sdk-trace-base": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-trace-base/-/sdk-trace-base-1.25.1.tgz",
      "integrity": "sha512-C8k4hnEbc5FamuZQ92nTOp8X/diCY56XUTnMiv9UTuJitCzaNNHAVsdm5+HLCdI8SLQsLWIrG38tddMxLVoftw==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-trace-otlp-proto/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/exporter-zipkin": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/exporter-zipkin/-/exporter-zipkin-1.25.1.tgz",
      "integrity": "sha512-RmOwSvkimg7ETwJbUOPTMhJm9A9bG1U8s7Zo3ajDh4zM7eYcycQ0dM7FbLD6NXWbI2yj7UY4q8BKinKYBQksyw==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/sdk-trace-base": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/exporter-zipkin/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-zipkin/node_modules/@opentelemetry/resources": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resources/-/resources-1.25.1.tgz",
      "integrity": "sha512-pkZT+iFYIZsVn6+GzM0kSX+u3MSLCY9md+lIJOoKl/P+gJFfxJte/60Usdp8Ce4rOs8GduUpSPNe1ddGyDT1sQ==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-zipkin/node_modules/@opentelemetry/sdk-trace-base": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-trace-base/-/sdk-trace-base-1.25.1.tgz",
      "integrity": "sha512-C8k4hnEbc5FamuZQ92nTOp8X/diCY56XUTnMiv9UTuJitCzaNNHAVsdm5+HLCdI8SLQsLWIrG38tddMxLVoftw==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/exporter-zipkin/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/instrumentation": {
      "version": "0.52.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation/-/instrumentation-0.52.1.tgz",
      "integrity": "sha512-uXJbYU/5/MBHjMp1FqrILLRuiJCs3Ofk0MeRDk8g1S1gD47U8X3JnSwcMO1rtRo1x1a7zKaQHaoYu49p/4eSKw==",
      "dependencies": {
        "@opentelemetry/api-logs": "0.52.1",
        "@types/shimmer": "^1.0.2",
        "import-in-the-middle": "^1.8.1",
        "require-in-the-middle": "^7.1.1",
        "semver": "^7.5.2",
        "shimmer": "^1.2.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-amqplib": {
      "version": "0.41.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-amqplib/-/instrumentation-amqplib-0.41.0.tgz",
      "integrity": "sha512-00Oi6N20BxJVcqETjgNzCmVKN+I5bJH/61IlHiIWd00snj1FdgiIKlpE4hYVacTB2sjIBB3nTbHskttdZEE2eg==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.8.0",
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-aws-lambda": {
      "version": "0.43.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-aws-lambda/-/instrumentation-aws-lambda-0.43.0.tgz",
      "integrity": "sha512-pSxcWlsE/pCWQRIw92sV2C+LmKXelYkjkA7C5s39iPUi4pZ2lA1nIiw+1R/y2pDEhUHcaKkNyljQr3cx9ZpVlQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/propagator-aws-xray": "^1.3.1",
        "@opentelemetry/resources": "^1.8.0",
        "@opentelemetry/semantic-conventions": "^1.22.0",
        "@types/aws-lambda": "8.10.122"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-aws-sdk": {
      "version": "0.43.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-aws-sdk/-/instrumentation-aws-sdk-0.43.1.tgz",
      "integrity": "sha512-qLT2cCniJ5W+6PFzKbksnoIQuq9pS83nmgaExfUwXVvlwi0ILc50dea0tWBHZMkdIDa/zZdcuFrJ7+fUcSnRow==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.8.0",
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/propagation-utils": "^0.30.10",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-bunyan": {
      "version": "0.40.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-bunyan/-/instrumentation-bunyan-0.40.0.tgz",
      "integrity": "sha512-aZ4cXaGWwj79ZXSYrgFVsrDlE4mmf2wfvP9bViwRc0j75A6eN6GaHYHqufFGMTCqASQn5pIjjP+Bx+PWTGiofw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/api-logs": "^0.52.0",
        "@opentelemetry/instrumentation": "^0.52.0",
        "@types/bunyan": "1.8.9"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-cassandra-driver": {
      "version": "0.40.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-cassandra-driver/-/instrumentation-cassandra-driver-0.40.0.tgz",
      "integrity": "sha512-JxbM39JU7HxE9MTKKwi6y5Z3mokjZB2BjwfqYi4B3Y29YO3I42Z7eopG6qq06yWZc+nQli386UDQe0d9xKmw0A==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-connect": {
      "version": "0.38.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-connect/-/instrumentation-connect-0.38.0.tgz",
      "integrity": "sha512-2/nRnx3pjYEmdPIaBwtgtSviTKHWnDZN3R+TkRUnhIVrvBKVcq+I5B2rtd6mr6Fe9cHlZ9Ojcuh7pkNh/xdWWg==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.8.0",
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0",
        "@types/connect": "3.4.36"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-connect/node_modules/@types/connect": {
      "version": "3.4.36",
      "resolved": "https://registry.npmjs.org/@types/connect/-/connect-3.4.36.tgz",
      "integrity": "sha512-P63Zd/JUGq+PdrM1lv0Wv5SBYeA2+CORvbrXbngriYY0jzLUWfQMQQxOhjONEz/wlHOAxOdY7CY65rgQdTjq2w==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@opentelemetry/instrumentation-cucumber": {
      "version": "0.8.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-cucumber/-/instrumentation-cucumber-0.8.0.tgz",
      "integrity": "sha512-ieTm4RBIlZt2brPwtX5aEZYtYnkyqhAVXJI9RIohiBVMe5DxiwCwt+2Exep/nDVqGPX8zRBZUl4AEw423OxJig==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-dataloader": {
      "version": "0.11.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-dataloader/-/instrumentation-dataloader-0.11.0.tgz",
      "integrity": "sha512-27urJmwkH4KDaMJtEv1uy2S7Apk4XbN4AgWMdfMJbi7DnOduJmeuA+DpJCwXB72tEWXo89z5T3hUVJIDiSNmNw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-dns": {
      "version": "0.38.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-dns/-/instrumentation-dns-0.38.0.tgz",
      "integrity": "sha512-Um07I0TQXDWa+ZbEAKDFUxFH40dLtejtExDOMLNJ1CL8VmOmA71qx93Qi/QG4tGkiI1XWqr7gF/oiMCJ4m8buQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "semver": "^7.5.4"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-dns/node_modules/semver": {
      "version": "7.7.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.1.tgz",
      "integrity": "sha512-hlq8tAfn0m/61p4BVRcPzIGr6LKiMwo4VM6dGi6pt4qcRkmNzTcWq6eCEjEh+qXjkMDvPlOFFSGwQjoEa6gyMA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/@opentelemetry/instrumentation-express": {
      "version": "0.41.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-express/-/instrumentation-express-0.41.1.tgz",
      "integrity": "sha512-uRx0V3LPGzjn2bxAnV8eUsDT82vT7NTwI0ezEuPMBOTOsnPpGhWdhcdNdhH80sM4TrWrOfXm9HGEdfWE3TRIww==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.8.0",
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-fastify": {
      "version": "0.38.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-fastify/-/instrumentation-fastify-0.38.0.tgz",
      "integrity": "sha512-HBVLpTSYpkQZ87/Df3N0gAw7VzYZV3n28THIBrJWfuqw3Or7UqdhnjeuMIPQ04BKk3aZc0cWn2naSQObbh5vXw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.8.0",
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-fs": {
      "version": "0.14.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-fs/-/instrumentation-fs-0.14.0.tgz",
      "integrity": "sha512-pVc8P5AgliC1DphyyBUgsxXlm2XaPH4BpYvt7rAZDMIqUpRk8gs19SioABtKqqxvFzg5jPtgJfJsdxq0Y+maLw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.8.0",
        "@opentelemetry/instrumentation": "^0.52.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-generic-pool": {
      "version": "0.38.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-generic-pool/-/instrumentation-generic-pool-0.38.1.tgz",
      "integrity": "sha512-WvssuKCuavu/hlq661u82UWkc248cyI/sT+c2dEIj6yCk0BUkErY1D+9XOO+PmHdJNE+76i2NdcvQX5rJrOe/w==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-graphql": {
      "version": "0.42.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-graphql/-/instrumentation-graphql-0.42.0.tgz",
      "integrity": "sha512-N8SOwoKL9KQSX7z3gOaw5UaTeVQcfDO1c21csVHnmnmGUoqsXbArK2B8VuwPWcv6/BC/i3io+xTo7QGRZ/z28Q==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-grpc": {
      "version": "0.52.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-grpc/-/instrumentation-grpc-0.52.1.tgz",
      "integrity": "sha512-EdSDiDSAO+XRXk/ZN128qQpBo1I51+Uay/LUPcPQhSRGf7fBPIEUBeOLQiItguGsug5MGOYjql2w/1wCQF3fdQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "0.52.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-grpc/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/instrumentation-hapi": {
      "version": "0.40.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-hapi/-/instrumentation-hapi-0.40.0.tgz",
      "integrity": "sha512-8U/w7Ifumtd2bSN1OLaSwAAFhb9FyqWUki3lMMB0ds+1+HdSxYBe9aspEJEgvxAqOkrQnVniAPTEGf1pGM7SOw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.8.0",
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-http": {
      "version": "0.52.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-http/-/instrumentation-http-0.52.1.tgz",
      "integrity": "sha512-dG/aevWhaP+7OLv4BQQSEKMJv8GyeOp3Wxl31NHqE8xo9/fYMfEljiZphUHIfyg4gnZ9swMyWjfOQs5GUQe54Q==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/instrumentation": "0.52.1",
        "@opentelemetry/semantic-conventions": "1.25.1",
        "semver": "^7.5.2"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-http/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-http/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/instrumentation-http/node_modules/semver": {
      "version": "7.7.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.1.tgz",
      "integrity": "sha512-hlq8tAfn0m/61p4BVRcPzIGr6LKiMwo4VM6dGi6pt4qcRkmNzTcWq6eCEjEh+qXjkMDvPlOFFSGwQjoEa6gyMA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/@opentelemetry/instrumentation-ioredis": {
      "version": "0.42.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-ioredis/-/instrumentation-ioredis-0.42.0.tgz",
      "integrity": "sha512-P11H168EKvBB9TUSasNDOGJCSkpT44XgoM6d3gRIWAa9ghLpYhl0uRkS8//MqPzcJVHr3h3RmfXIpiYLjyIZTw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/redis-common": "^0.36.2",
        "@opentelemetry/semantic-conventions": "^1.23.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-kafkajs": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-kafkajs/-/instrumentation-kafkajs-0.2.0.tgz",
      "integrity": "sha512-uKKmhEFd0zR280tJovuiBG7cfnNZT4kvVTvqtHPxQP7nOmRbJstCYHFH13YzjVcKjkmoArmxiSulmZmF7SLIlg==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.24.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-knex": {
      "version": "0.39.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-knex/-/instrumentation-knex-0.39.0.tgz",
      "integrity": "sha512-lRwTqIKQecPWDkH1KEcAUcFhCaNssbKSpxf4sxRTAROCwrCEnYkjOuqJHV+q1/CApjMTaKu0Er4LBv/6bDpoxA==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-koa": {
      "version": "0.42.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-koa/-/instrumentation-koa-0.42.0.tgz",
      "integrity": "sha512-H1BEmnMhho8o8HuNRq5zEI4+SIHDIglNB7BPKohZyWG4fWNuR7yM4GTlR01Syq21vODAS7z5omblScJD/eZdKw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.8.0",
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-lru-memoizer": {
      "version": "0.39.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-lru-memoizer/-/instrumentation-lru-memoizer-0.39.0.tgz",
      "integrity": "sha512-eU1Wx1RRTR/2wYXFzH9gcpB8EPmhYlNDIUHzUXjyUE0CAXEJhBLkYNlzdaVCoQDw2neDqS+Woshiia6+emWK9A==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-memcached": {
      "version": "0.38.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-memcached/-/instrumentation-memcached-0.38.0.tgz",
      "integrity": "sha512-tPmyqQEZNyrvg6G+iItdlguQEcGzfE+bJkpQifmBXmWBnoS5oU3UxqtyYuXGL2zI9qQM5yMBHH4nRXWALzy7WA==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.23.0",
        "@types/memcached": "^2.2.6"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-mongodb": {
      "version": "0.46.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-mongodb/-/instrumentation-mongodb-0.46.0.tgz",
      "integrity": "sha512-VF/MicZ5UOBiXrqBslzwxhN7TVqzu1/LN/QDpkskqM0Zm0aZ4CVRbUygL8d7lrjLn15x5kGIe8VsSphMfPJzlA==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/sdk-metrics": "^1.9.1",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-mongoose": {
      "version": "0.41.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-mongoose/-/instrumentation-mongoose-0.41.0.tgz",
      "integrity": "sha512-ivJg4QnnabFxxoI7K8D+in7hfikjte38sYzJB9v1641xJk9Esa7jM3hmbPB7lxwcgWJLVEDvfPwobt1if0tXxA==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.8.0",
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-mysql": {
      "version": "0.40.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-mysql/-/instrumentation-mysql-0.40.0.tgz",
      "integrity": "sha512-d7ja8yizsOCNMYIJt5PH/fKZXjb/mS48zLROO4BzZTtDfhNCl2UM/9VIomP2qkGIFVouSJrGr/T00EzY7bPtKA==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0",
        "@types/mysql": "2.15.22"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-mysql2": {
      "version": "0.40.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-mysql2/-/instrumentation-mysql2-0.40.0.tgz",
      "integrity": "sha512-0xfS1xcqUmY7WE1uWjlmI67Xg3QsSUlNT+AcXHeA4BDUPwZtWqF4ezIwLgpVZfHOnkAEheqGfNSWd1PIu3Wnfg==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0",
        "@opentelemetry/sql-common": "^0.40.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-nestjs-core": {
      "version": "0.39.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-nestjs-core/-/instrumentation-nestjs-core-0.39.0.tgz",
      "integrity": "sha512-mewVhEXdikyvIZoMIUry8eb8l3HUjuQjSjVbmLVTt4NQi35tkpnHQrG9bTRBrl3403LoWZ2njMPJyg4l6HfKvA==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.23.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-net": {
      "version": "0.38.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-net/-/instrumentation-net-0.38.0.tgz",
      "integrity": "sha512-stjow1PijcmUquSmRD/fSihm/H61DbjPlJuJhWUe7P22LFPjFhsrSeiB5vGj3vn+QGceNAs+kioUTzMGPbNxtg==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.23.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-pg": {
      "version": "0.43.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-pg/-/instrumentation-pg-0.43.0.tgz",
      "integrity": "sha512-og23KLyoxdnAeFs1UWqzSonuCkePUzCX30keSYigIzJe/6WSYA8rnEI5lobcxPEzg+GcU06J7jzokuEHbjVJNw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0",
        "@opentelemetry/sql-common": "^0.40.1",
        "@types/pg": "8.6.1",
        "@types/pg-pool": "2.0.4"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-pino": {
      "version": "0.41.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-pino/-/instrumentation-pino-0.41.0.tgz",
      "integrity": "sha512-Kpv0fJRk/8iMzMk5Ue5BsUJfHkBJ2wQoIi/qduU1a1Wjx9GLj6J2G17PHjPK5mnZjPNzkFOXFADZMfgDioliQw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/api-logs": "^0.52.0",
        "@opentelemetry/core": "^1.25.0",
        "@opentelemetry/instrumentation": "^0.52.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-redis": {
      "version": "0.41.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-redis/-/instrumentation-redis-0.41.0.tgz",
      "integrity": "sha512-RJ1pwI3btykp67ts+5qZbaFSAAzacucwBet5/5EsKYtWBpHbWwV/qbGN/kIBzXg5WEZBhXLrR/RUq0EpEUpL3A==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/redis-common": "^0.36.2",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-redis-4": {
      "version": "0.41.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-redis-4/-/instrumentation-redis-4-0.41.1.tgz",
      "integrity": "sha512-UqJAbxraBk7s7pQTlFi5ND4sAUs4r/Ai7gsAVZTQDbHl2kSsOp7gpHcpIuN5dpcI2xnuhM2tkH4SmEhbrv2S6Q==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/redis-common": "^0.36.2",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-restify": {
      "version": "0.40.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-restify/-/instrumentation-restify-0.40.0.tgz",
      "integrity": "sha512-sm/rH/GysY/KOEvZqYBZSLYFeXlBkHCgqPDgWc07tz+bHCN6mPs9P3otGOSTe7o3KAIM8Nc6ncCO59vL+jb2cA==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.8.0",
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-router": {
      "version": "0.39.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-router/-/instrumentation-router-0.39.0.tgz",
      "integrity": "sha512-LaXnVmD69WPC4hNeLzKexCCS19hRLrUw3xicneAMkzJSzNJvPyk7G6I7lz7VjQh1cooObPBt9gNyd3hhTCUrag==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-socket.io": {
      "version": "0.41.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-socket.io/-/instrumentation-socket.io-0.41.0.tgz",
      "integrity": "sha512-7fzDe9/FpO6NFizC/wnzXXX7bF9oRchsD//wFqy5g5hVEgXZCQ70IhxjrKdBvgjyIejR9T9zTvfQ6PfVKfkCAw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-tedious": {
      "version": "0.13.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-tedious/-/instrumentation-tedious-0.13.0.tgz",
      "integrity": "sha512-Pob0+0R62AqXH50pjazTeGBy/1+SK4CYpFUBV5t7xpbpeuQezkkgVGvLca84QqjBqQizcXedjpUJLgHQDixPQg==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/instrumentation": "^0.52.0",
        "@opentelemetry/semantic-conventions": "^1.22.0",
        "@types/tedious": "^4.0.14"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-undici": {
      "version": "0.5.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-undici/-/instrumentation-undici-0.5.0.tgz",
      "integrity": "sha512-aNTeSrFAVcM9qco5DfZ9DNXu6hpMRe8Kt8nCDHfMWDB3pwgGVUE76jTdohc+H/7eLRqh4L7jqs5NSQoHw7S6ww==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.8.0",
        "@opentelemetry/instrumentation": "^0.52.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.7.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation-winston": {
      "version": "0.39.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/instrumentation-winston/-/instrumentation-winston-0.39.0.tgz",
      "integrity": "sha512-v/1xziLJ9CyB3YDjBSBzbB70Qd0JwWTo36EqWK5m3AR0CzsyMQQmf3ZIZM6sgx7hXMcRQ0pnEYhg6nhrUQPm9A==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/api-logs": "^0.52.0",
        "@opentelemetry/instrumentation": "^0.52.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.3.0"
      }
    },
    "node_modules/@opentelemetry/instrumentation/node_modules/semver": {
      "version": "7.6.3",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.6.3.tgz",
      "integrity": "sha512-oVekP1cKtI+CTDvHWYFUcMtsK/00wmAEfyqKfNdARm8u1wNVhSgaX7A8d4UuIlUI5e84iEwOhs7ZPYRmzU9U6A==",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/@opentelemetry/otlp-exporter-base": {
      "version": "0.52.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/otlp-exporter-base/-/otlp-exporter-base-0.52.1.tgz",
      "integrity": "sha512-z175NXOtX5ihdlshtYBe5RpGeBoTXVCKPPLiQlD6FHvpM4Ch+p2B0yWKYSrBfLH24H9zjJiBdTrtD+hLlfnXEQ==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/otlp-transformer": "0.52.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/otlp-grpc-exporter-base": {
      "version": "0.52.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/otlp-grpc-exporter-base/-/otlp-grpc-exporter-base-0.52.1.tgz",
      "integrity": "sha512-zo/YrSDmKMjG+vPeA9aBBrsQM9Q/f2zo6N04WMB3yNldJRsgpRBeLLwvAt/Ba7dpehDLOEFBd1i2JCoaFtpCoQ==",
      "dependencies": {
        "@grpc/grpc-js": "^1.7.1",
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/otlp-exporter-base": "0.52.1",
        "@opentelemetry/otlp-transformer": "0.52.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/otlp-grpc-exporter-base/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/otlp-grpc-exporter-base/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/otlp-transformer": {
      "version": "0.52.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/otlp-transformer/-/otlp-transformer-0.52.1.tgz",
      "integrity": "sha512-I88uCZSZZtVa0XniRqQWKbjAUm73I8tpEy/uJYPPYw5d7BRdVk0RfTBQw8kSUl01oVWEuqxLDa802222MYyWHg==",
      "dependencies": {
        "@opentelemetry/api-logs": "0.52.1",
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/sdk-logs": "0.52.1",
        "@opentelemetry/sdk-metrics": "1.25.1",
        "@opentelemetry/sdk-trace-base": "1.25.1",
        "protobufjs": "^7.3.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.3.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/otlp-transformer/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/otlp-transformer/node_modules/@opentelemetry/resources": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resources/-/resources-1.25.1.tgz",
      "integrity": "sha512-pkZT+iFYIZsVn6+GzM0kSX+u3MSLCY9md+lIJOoKl/P+gJFfxJte/60Usdp8Ce4rOs8GduUpSPNe1ddGyDT1sQ==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/otlp-transformer/node_modules/@opentelemetry/sdk-metrics": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-metrics/-/sdk-metrics-1.25.1.tgz",
      "integrity": "sha512-9Mb7q5ioFL4E4dDrc4wC/A3NTHDat44v4I3p2pLPSxRvqUbDIQyMVr9uK+EU69+HWhlET1VaSrRzwdckWqY15Q==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/resources": "1.25.1",
        "lodash.merge": "^4.6.2"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.3.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/otlp-transformer/node_modules/@opentelemetry/sdk-trace-base": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-trace-base/-/sdk-trace-base-1.25.1.tgz",
      "integrity": "sha512-C8k4hnEbc5FamuZQ92nTOp8X/diCY56XUTnMiv9UTuJitCzaNNHAVsdm5+HLCdI8SLQsLWIrG38tddMxLVoftw==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/otlp-transformer/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/propagation-utils": {
      "version": "0.30.15",
      "resolved": "https://registry.npmjs.org/@opentelemetry/propagation-utils/-/propagation-utils-0.30.15.tgz",
      "integrity": "sha512-nQ30K+eXTkd9Kt8yep9FPrqogS712GvdkV6R1T+xZMSZnFrRCyZuWxMtP3+s3hrK2HWw3ti4lsIfBzsHWYiyrA==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/propagator-aws-xray": {
      "version": "1.26.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/propagator-aws-xray/-/propagator-aws-xray-1.26.1.tgz",
      "integrity": "sha512-rMffLq+rPJrejFPv40MQGXFroAfyg9zfVzO0Jy4wbfEkSJ4uOIeC8T2aAf7Z5igZ7nPZsQJ7xLpbCSq8MnQziQ==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/propagator-b3": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/propagator-b3/-/propagator-b3-1.25.1.tgz",
      "integrity": "sha512-p6HFscpjrv7//kE+7L+3Vn00VEDUJB0n6ZrjkTYHrJ58QZ8B3ajSJhRbCcY6guQ3PDjTbxWklyvIN2ojVbIb1A==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/propagator-b3/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/propagator-b3/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/propagator-jaeger": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/propagator-jaeger/-/propagator-jaeger-1.25.1.tgz",
      "integrity": "sha512-nBprRf0+jlgxks78G/xq72PipVK+4or9Ypntw0gVZYNTCSK8rg5SeaGV19tV920CMqBD/9UIOiFr23Li/Q8tiA==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/propagator-jaeger/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/propagator-jaeger/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/redis-common": {
      "version": "0.36.2",
      "resolved": "https://registry.npmjs.org/@opentelemetry/redis-common/-/redis-common-0.36.2.tgz",
      "integrity": "sha512-faYX1N0gpLhej/6nyp6bgRjzAKXn5GOEMYY7YhciSfCoITAktLUtQ36d24QEWNA1/WA1y6qQunCe0OhHRkVl9g==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/resource-detector-alibaba-cloud": {
      "version": "0.29.7",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resource-detector-alibaba-cloud/-/resource-detector-alibaba-cloud-0.29.7.tgz",
      "integrity": "sha512-PExUl/R+reSQI6Y/eNtgAsk6RHk1ElYSzOa8/FHfdc/nLmx9sqMasBEpLMkETkzDP7t27ORuXe4F9vwkV2uwwg==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.26.0",
        "@opentelemetry/resources": "^1.10.0",
        "@opentelemetry/semantic-conventions": "^1.27.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/resource-detector-aws": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resource-detector-aws/-/resource-detector-aws-1.11.0.tgz",
      "integrity": "sha512-j7qQ75enAJrlSPkPowasScuukZ2ffFG659rhxOpUM4dBe/O8Jpq+dy4pIdFtjWKkM9i7LgisdUt/GW7wGIWoEQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.0.0",
        "@opentelemetry/resources": "^1.10.0",
        "@opentelemetry/semantic-conventions": "^1.27.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/resource-detector-azure": {
      "version": "0.2.12",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resource-detector-azure/-/resource-detector-azure-0.2.12.tgz",
      "integrity": "sha512-iIarQu6MiCjEEp8dOzmBvCSlRITPFTinFB2oNKAjU6xhx8d7eUcjNOKhBGQTvuCriZrxrEvDaEEY9NfrPQ6uYQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.25.1",
        "@opentelemetry/resources": "^1.10.1",
        "@opentelemetry/semantic-conventions": "^1.27.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/resource-detector-container": {
      "version": "0.4.4",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resource-detector-container/-/resource-detector-container-0.4.4.tgz",
      "integrity": "sha512-ZEN2mq7lIjQWJ8NTt1umtr6oT/Kb89856BOmESLSvgSHbIwOFYs7cSfSRH5bfiVw6dXTQAVbZA/wLgCHKrebJA==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.26.0",
        "@opentelemetry/resources": "^1.10.0",
        "@opentelemetry/semantic-conventions": "^1.27.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/resource-detector-gcp": {
      "version": "0.29.13",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resource-detector-gcp/-/resource-detector-gcp-0.29.13.tgz",
      "integrity": "sha512-vdotx+l3Q+89PeyXMgKEGnZ/CwzwMtuMi/ddgD9/5tKZ08DfDGB2Npz9m2oXPHRCjc4Ro6ifMqFlRyzIvgOjhg==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.0.0",
        "@opentelemetry/resources": "^1.10.0",
        "@opentelemetry/semantic-conventions": "^1.27.0",
        "gcp-metadata": "^6.0.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.0.0"
      }
    },
    "node_modules/@opentelemetry/resources": {
      "version": "1.30.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resources/-/resources-1.30.1.tgz",
      "integrity": "sha512-5UxZqiAgLYGFjS4s9qm5mBVo433u+dSPUFWVWXmLAD4wB65oMCoXaJP1KJa9DIYYMeHu3z4BZcStG3LC593cWA==",
      "dependencies": {
        "@opentelemetry/core": "1.30.1",
        "@opentelemetry/semantic-conventions": "1.28.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-logs": {
      "version": "0.52.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-logs/-/sdk-logs-0.52.1.tgz",
      "integrity": "sha512-MBYh+WcPPsN8YpRHRmK1Hsca9pVlyyKd4BxOC4SsgHACnl/bPp4Cri9hWhVm5+2tiQ9Zf4qSc1Jshw9tOLGWQA==",
      "dependencies": {
        "@opentelemetry/api-logs": "0.52.1",
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/resources": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.4.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-logs/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-logs/node_modules/@opentelemetry/resources": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resources/-/resources-1.25.1.tgz",
      "integrity": "sha512-pkZT+iFYIZsVn6+GzM0kSX+u3MSLCY9md+lIJOoKl/P+gJFfxJte/60Usdp8Ce4rOs8GduUpSPNe1ddGyDT1sQ==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-logs/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/sdk-metrics": {
      "version": "1.30.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-metrics/-/sdk-metrics-1.30.1.tgz",
      "integrity": "sha512-q9zcZ0Okl8jRgmy7eNW3Ku1XSgg3sDLa5evHZpCwjspw7E8Is4K/haRPDJrBcX3YSn/Y7gUvFnByNYEKQNbNog==",
      "dependencies": {
        "@opentelemetry/core": "1.30.1",
        "@opentelemetry/resources": "1.30.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.3.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-node": {
      "version": "0.52.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-node/-/sdk-node-0.52.1.tgz",
      "integrity": "sha512-uEG+gtEr6eKd8CVWeKMhH2olcCHM9dEK68pe0qE0be32BcCRsvYURhHaD1Srngh1SQcnQzZ4TP324euxqtBOJA==",
      "dependencies": {
        "@opentelemetry/api-logs": "0.52.1",
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/exporter-trace-otlp-grpc": "0.52.1",
        "@opentelemetry/exporter-trace-otlp-http": "0.52.1",
        "@opentelemetry/exporter-trace-otlp-proto": "0.52.1",
        "@opentelemetry/exporter-zipkin": "1.25.1",
        "@opentelemetry/instrumentation": "0.52.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/sdk-logs": "0.52.1",
        "@opentelemetry/sdk-metrics": "1.25.1",
        "@opentelemetry/sdk-trace-base": "1.25.1",
        "@opentelemetry/sdk-trace-node": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.3.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-node/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-node/node_modules/@opentelemetry/resources": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resources/-/resources-1.25.1.tgz",
      "integrity": "sha512-pkZT+iFYIZsVn6+GzM0kSX+u3MSLCY9md+lIJOoKl/P+gJFfxJte/60Usdp8Ce4rOs8GduUpSPNe1ddGyDT1sQ==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-node/node_modules/@opentelemetry/sdk-metrics": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-metrics/-/sdk-metrics-1.25.1.tgz",
      "integrity": "sha512-9Mb7q5ioFL4E4dDrc4wC/A3NTHDat44v4I3p2pLPSxRvqUbDIQyMVr9uK+EU69+HWhlET1VaSrRzwdckWqY15Q==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/resources": "1.25.1",
        "lodash.merge": "^4.6.2"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.3.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-node/node_modules/@opentelemetry/sdk-trace-base": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-trace-base/-/sdk-trace-base-1.25.1.tgz",
      "integrity": "sha512-C8k4hnEbc5FamuZQ92nTOp8X/diCY56XUTnMiv9UTuJitCzaNNHAVsdm5+HLCdI8SLQsLWIrG38tddMxLVoftw==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-node/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/sdk-trace-base": {
      "version": "1.30.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-trace-base/-/sdk-trace-base-1.30.1.tgz",
      "integrity": "sha512-jVPgBbH1gCy2Lb7X0AVQ8XAfgg0pJ4nvl8/IiQA6nxOsPvS+0zMJaFSs2ltXe0J6C8dqjcnpyqINDJmU30+uOg==",
      "dependencies": {
        "@opentelemetry/core": "1.30.1",
        "@opentelemetry/resources": "1.30.1",
        "@opentelemetry/semantic-conventions": "1.28.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-trace-node": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-trace-node/-/sdk-trace-node-1.25.1.tgz",
      "integrity": "sha512-nMcjFIKxnFqoez4gUmihdBrbpsEnAX/Xj16sGvZm+guceYE0NE00vLhpDVK6f3q8Q4VFI5xG8JjlXKMB/SkTTQ==",
      "dependencies": {
        "@opentelemetry/context-async-hooks": "1.25.1",
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/propagator-b3": "1.25.1",
        "@opentelemetry/propagator-jaeger": "1.25.1",
        "@opentelemetry/sdk-trace-base": "1.25.1",
        "semver": "^7.5.2"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-trace-node/node_modules/@opentelemetry/context-async-hooks": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/context-async-hooks/-/context-async-hooks-1.25.1.tgz",
      "integrity": "sha512-UW/ge9zjvAEmRWVapOP0qyCvPulWU6cQxGxDbWEFfGOj1VBBZAuOqTo3X6yWmDTD3Xe15ysCZChHncr2xFMIfQ==",
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-trace-node/node_modules/@opentelemetry/core": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/core/-/core-1.25.1.tgz",
      "integrity": "sha512-GeT/l6rBYWVQ4XArluLVB6WWQ8flHbdb6r2FCHC3smtdOAbrJBIv35tpV/yp9bmYUJf+xmZpu9DRTIeJVhFbEQ==",
      "dependencies": {
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-trace-node/node_modules/@opentelemetry/resources": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/resources/-/resources-1.25.1.tgz",
      "integrity": "sha512-pkZT+iFYIZsVn6+GzM0kSX+u3MSLCY9md+lIJOoKl/P+gJFfxJte/60Usdp8Ce4rOs8GduUpSPNe1ddGyDT1sQ==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-trace-node/node_modules/@opentelemetry/sdk-trace-base": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sdk-trace-base/-/sdk-trace-base-1.25.1.tgz",
      "integrity": "sha512-C8k4hnEbc5FamuZQ92nTOp8X/diCY56XUTnMiv9UTuJitCzaNNHAVsdm5+HLCdI8SLQsLWIrG38tddMxLVoftw==",
      "dependencies": {
        "@opentelemetry/core": "1.25.1",
        "@opentelemetry/resources": "1.25.1",
        "@opentelemetry/semantic-conventions": "1.25.1"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0 <1.10.0"
      }
    },
    "node_modules/@opentelemetry/sdk-trace-node/node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.25.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.25.1.tgz",
      "integrity": "sha512-ZDjMJJQRlyk8A1KZFCc+bCbsyrn1wTwdNt56F7twdfUfnHUZUq77/WfONCj8p72NZOyP7pNTdUWSTYC3GTbuuQ==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/sdk-trace-node/node_modules/semver": {
      "version": "7.6.3",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.6.3.tgz",
      "integrity": "sha512-oVekP1cKtI+CTDvHWYFUcMtsK/00wmAEfyqKfNdARm8u1wNVhSgaX7A8d4UuIlUI5e84iEwOhs7ZPYRmzU9U6A==",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/@opentelemetry/semantic-conventions": {
      "version": "1.28.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/semantic-conventions/-/semantic-conventions-1.28.0.tgz",
      "integrity": "sha512-lp4qAiMTD4sNWW4DbKLBkfiMZ4jbAboJIGOQr5DvciMRI494OapieI9qiODpOt0XBr1LjIDy1xAGAnVs5supTA==",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@opentelemetry/sql-common": {
      "version": "0.40.1",
      "resolved": "https://registry.npmjs.org/@opentelemetry/sql-common/-/sql-common-0.40.1.tgz",
      "integrity": "sha512-nSDlnHSqzC3pXn/wZEZVLuAuJ1MYMXPBwtv2qAbCa3847SaHItdE7SzUq/Jtb0KZmh1zfAbNi3AAMjztTT4Ugg==",
      "license": "Apache-2.0",
      "dependencies": {
        "@opentelemetry/core": "^1.1.0"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.1.0"
      }
    },
    "node_modules/@pkgjs/parseargs": {
      "version": "0.11.0",
      "resolved": "https://registry.npmjs.org/@pkgjs/parseargs/-/parseargs-0.11.0.tgz",
      "integrity": "sha512-+1VkjdD0QBLPodGrJUeqarH8VAIvQODIbwh9XpP5Syisf7YoQgsJKPNFoqqLQlu+VQ/tVSshMR6loPMn8U+dPg==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@protobufjs/aspromise": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/@protobufjs/aspromise/-/aspromise-1.1.2.tgz",
      "integrity": "sha512-j+gKExEuLmKwvz3OgROXtrJ2UG2x8Ch2YZUxahh+s1F2HZ+wAceUNLkvy6zKCPVRkU++ZWQrdxsUeQXmcg4uoQ=="
    },
    "node_modules/@protobufjs/base64": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/@protobufjs/base64/-/base64-1.1.2.tgz",
      "integrity": "sha512-AZkcAA5vnN/v4PDqKyMR5lx7hZttPDgClv83E//FMNhR2TMcLUhfRUBHCmSl0oi9zMgDDqRUJkSxO3wm85+XLg=="
    },
    "node_modules/@protobufjs/codegen": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/@protobufjs/codegen/-/codegen-2.0.4.tgz",
      "integrity": "sha512-YyFaikqM5sH0ziFZCN3xDC7zeGaB/d0IUb9CATugHWbd1FRFwWwt4ld4OYMPWu5a3Xe01mGAULCdqhMlPl29Jg=="
    },
    "node_modules/@protobufjs/eventemitter": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@protobufjs/eventemitter/-/eventemitter-1.1.0.tgz",
      "integrity": "sha512-j9ednRT81vYJ9OfVuXG6ERSTdEL1xVsNgqpkxMsbIabzSo3goCjDIveeGv5d03om39ML71RdmrGNjG5SReBP/Q=="
    },
    "node_modules/@protobufjs/fetch": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@protobufjs/fetch/-/fetch-1.1.0.tgz",
      "integrity": "sha512-lljVXpqXebpsijW71PZaCYeIcE5on1w5DlQy5WH6GLbFryLUrBD4932W/E2BSpfRJWseIL4v/KPgBFxDOIdKpQ==",
      "dependencies": {
        "@protobufjs/aspromise": "^1.1.1",
        "@protobufjs/inquire": "^1.1.0"
      }
    },
    "node_modules/@protobufjs/float": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/@protobufjs/float/-/float-1.0.2.tgz",
      "integrity": "sha512-Ddb+kVXlXst9d+R9PfTIxh1EdNkgoRe5tOX6t01f1lYWOvJnSPDBlG241QLzcyPdoNTsblLUdujGSE4RzrTZGQ=="
    },
    "node_modules/@protobufjs/inquire": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@protobufjs/inquire/-/inquire-1.1.0.tgz",
      "integrity": "sha512-kdSefcPdruJiFMVSbn801t4vFK7KB/5gd2fYvrxhuJYg8ILrmn9SKSX2tZdV6V+ksulWqS7aXjBcRXl3wHoD9Q=="
    },
    "node_modules/@protobufjs/path": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/@protobufjs/path/-/path-1.1.2.tgz",
      "integrity": "sha512-6JOcJ5Tm08dOHAbdR3GrvP+yUUfkjG5ePsHYczMFLq3ZmMkAD98cDgcT2iA1lJ9NVwFd4tH/iSSoe44YWkltEA=="
    },
    "node_modules/@protobufjs/pool": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@protobufjs/pool/-/pool-1.1.0.tgz",
      "integrity": "sha512-0kELaGSIDBKvcgS4zkjz1PeddatrjYcmMWOlAuAPwAeccUrPHdUqo/J6LiymHHEiJT5NrF1UVwxY14f+fy4WQw=="
    },
    "node_modules/@protobufjs/utf8": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@protobufjs/utf8/-/utf8-1.1.0.tgz",
      "integrity": "sha512-Vvn3zZrhQZkkBE8LSuW3em98c0FwgO4nxzv6OdSxPKJIEKY2bGbHn+mhGIPerzI4twdxaP8/0+06HBpwf345Lw=="
    },
    "node_modules/@sinclair/typebox": {
      "version": "0.27.8",
      "resolved": "https://registry.npmjs.org/@sinclair/typebox/-/typebox-0.27.8.tgz",
      "integrity": "sha512-+Fj43pSMwJs4KRrH/938Uf+uAELIgVBmQzg/q1YG10djyfA3TnrU8N8XzqCh/okZdszqBQTZf96idMfE5lnwTA==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/@sinonjs/commons": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/@sinonjs/commons/-/commons-3.0.1.tgz",
      "integrity": "sha512-K3mCHKQ9sVh8o1C9cxkwxaOmXoAMlDxC1mYyHrjqOWEcBjYr76t96zL2zlj5dUGZ3HSw240X1qgH3Mjf1yJWpQ==",
      "dev": true,
      "license": "BSD-3-Clause",
      "peer": true,
      "dependencies": {
        "type-detect": "4.0.8"
      }
    },
    "node_modules/@sinonjs/fake-timers": {
      "version": "10.3.0",
      "resolved": "https://registry.npmjs.org/@sinonjs/fake-timers/-/fake-timers-10.3.0.tgz",
      "integrity": "sha512-V4BG07kuYSUkTCSBHG8G8TNhM+F19jXFWnQtzj+we8DrkpSBCee9Z3Ms8yiGer/dlmhe35/Xdgyo3/0rQKg7YA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "peer": true,
      "dependencies": {
        "@sinonjs/commons": "^3.0.0"
      }
    },
    "node_modules/@tootallnate/once": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/@tootallnate/once/-/once-2.0.0.tgz",
      "integrity": "sha512-XCuKFP5PS55gnMVu3dty8KPatLqUoy/ZYzDzAGCQ8JNFCkLXzmI7vNHCR+XpbZaMWQK/vQubr7PkYq8g470J/A==",
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@trpc/server": {
      "version": "10.45.0",
      "resolved": "https://registry.npmjs.org/@trpc/server/-/server-10.45.0.tgz",
      "integrity": "sha512-2Fwzv6nqpE0Ie/G7PeS0EVR89zLm+c1Mw7T+RAGtU807j4oaUx0zGkBXTu5u9AI+j+BYNN2GZxJcuDTAecbr1A==",
      "dev": true,
      "funding": [
        "https://trpc.io/sponsor"
      ]
    },
    "node_modules/@types/aws-lambda": {
      "version": "8.10.122",
      "resolved": "https://registry.npmjs.org/@types/aws-lambda/-/aws-lambda-8.10.122.tgz",
      "integrity": "sha512-vBkIh9AY22kVOCEKo5CJlyCgmSWvasC+SWUxL/x/vOwRobMpI/HG1xp/Ae3AqmSiZeLUbOhW0FCD3ZjqqUxmXw==",
      "license": "MIT"
    },
    "node_modules/@types/babel__core": {
      "version": "7.20.5",
      "resolved": "https://registry.npmjs.org/@types/babel__core/-/babel__core-7.20.5.tgz",
      "integrity": "sha512-qoQprZvz5wQFJwMDqeseRXWv3rqMvhgpbXFfVyWhbx9X47POIA6i/+dXefEmZKoAgOaTdaIgNSMqMIU61yRyzA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/parser": "^7.20.7",
        "@babel/types": "^7.20.7",
        "@types/babel__generator": "*",
        "@types/babel__template": "*",
        "@types/babel__traverse": "*"
      }
    },
    "node_modules/@types/babel__generator": {
      "version": "7.6.8",
      "resolved": "https://registry.npmjs.org/@types/babel__generator/-/babel__generator-7.6.8.tgz",
      "integrity": "sha512-ASsj+tpEDsEiFr1arWrlN6V3mdfjRMZt6LtK/Vp/kreFLnr5QH5+DhvD5nINYZXzwJvXeGq+05iUXcAzVrqWtw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/types": "^7.0.0"
      }
    },
    "node_modules/@types/babel__template": {
      "version": "7.4.4",
      "resolved": "https://registry.npmjs.org/@types/babel__template/-/babel__template-7.4.4.tgz",
      "integrity": "sha512-h/NUaSyG5EyxBIp8YRxo4RMe2/qQgvyowRwVMzhYhBCONbW8PUsg4lkFMrhgZhUe5z3L3MiLDuvyJ/CaPa2A8A==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/parser": "^7.1.0",
        "@babel/types": "^7.0.0"
      }
    },
    "node_modules/@types/babel__traverse": {
      "version": "7.20.6",
      "resolved": "https://registry.npmjs.org/@types/babel__traverse/-/babel__traverse-7.20.6.tgz",
      "integrity": "sha512-r1bzfrm0tomOI8g1SzvCaQHo6Lcv6zu0EA+W2kHrt8dyrHQxGzBBL4kdkzIS+jBMV+EYcMAEAqXqYaLJq5rOZg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/types": "^7.20.7"
      }
    },
    "node_modules/@types/body-parser": {
      "version": "1.19.5",
      "resolved": "https://registry.npmjs.org/@types/body-parser/-/body-parser-1.19.5.tgz",
      "integrity": "sha512-fB3Zu92ucau0iQ0JMCFQE7b/dv8Ot07NI3KaZIkIUNXq82k4eBAqUaneXfleGY9JWskeS9y+u0nXMyspcuQrCg==",
      "dependencies": {
        "@types/connect": "*",
        "@types/node": "*"
      }
    },
    "node_modules/@types/bunyan": {
      "version": "1.8.9",
      "resolved": "https://registry.npmjs.org/@types/bunyan/-/bunyan-1.8.9.tgz",
      "integrity": "sha512-ZqS9JGpBxVOvsawzmVt30sP++gSQMTejCkIAQ3VdadOcRE8izTyW66hufvwLeH+YEGP6Js2AW7Gz+RMyvrEbmw==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/caseless": {
      "version": "0.12.5",
      "resolved": "https://registry.npmjs.org/@types/caseless/-/caseless-0.12.5.tgz",
      "integrity": "sha512-hWtVTC2q7hc7xZ/RLbxapMvDMgUnDvKvMOpKal4DrMyfGBUfB1oKaZlIRr6mJL+If3bAP6sV/QneGzF6tJjZDg=="
    },
    "node_modules/@types/connect": {
      "version": "3.4.38",
      "resolved": "https://registry.npmjs.org/@types/connect/-/connect-3.4.38.tgz",
      "integrity": "sha512-K6uROf1LD88uDQqJCktA4yzL1YYAK6NgfsI0v/mTgyPKWsX1CnJ0XPSDhViejru1GcRkLWb8RlzFYJRqGUbaug==",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/cors": {
      "version": "2.8.17",
      "resolved": "https://registry.npmjs.org/@types/cors/-/cors-2.8.17.tgz",
      "integrity": "sha512-8CGDvrBj1zgo2qE+oS3pOCyYNqCPryMWY2bGfwA0dcfopWGgxs+78df0Rs3rc9THP4JkOhLsAa+15VdpAqkcUA==",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/estree": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.6.tgz",
      "integrity": "sha512-AYnb1nQyY49te+VRAVgmzfcgjYS91mY5P0TKUDCLEM+gNnA+3T6rWITXRLYCpahpqSQbN5cE+gHpnPyXjHWxcw==",
      "dev": true
    },
    "node_modules/@types/express": {
      "version": "4.17.21",
      "resolved": "https://registry.npmjs.org/@types/express/-/express-4.17.21.tgz",
      "integrity": "sha512-ejlPM315qwLpaQlQDTjPdsUFSc6ZsP4AN6AlWnogPjQ7CVi7PYF3YVz+CY3jE2pwYf7E/7HlDAN0rV2GxTG0HQ==",
      "dependencies": {
        "@types/body-parser": "*",
        "@types/express-serve-static-core": "^4.17.33",
        "@types/qs": "*",
        "@types/serve-static": "*"
      }
    },
    "node_modules/@types/express-serve-static-core": {
      "version": "4.19.6",
      "resolved": "https://registry.npmjs.org/@types/express-serve-static-core/-/express-serve-static-core-4.19.6.tgz",
      "integrity": "sha512-N4LZ2xG7DatVqhCZzOGb1Yi5lMbXSZcmdLDe9EzSndPV2HpWYWzRbaerl2n27irrm94EPpprqa8KpskPT085+A==",
      "dependencies": {
        "@types/node": "*",
        "@types/qs": "*",
        "@types/range-parser": "*",
        "@types/send": "*"
      }
    },
    "node_modules/@types/firebase": {
      "version": "2.4.32",
      "resolved": "https://registry.npmjs.org/@types/firebase/-/firebase-2.4.32.tgz",
      "integrity": "sha512-WHuDkJq4PjH3HzmogWstX/r+/c0dGFq7F1fZ9LgT/B4zh/0fps0fUxLDNtuSJZ+PLIpm/EALBhcqZr0qtEy85g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/gensync": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/@types/gensync/-/gensync-1.0.4.tgz",
      "integrity": "sha512-C3YYeRQWp2fmq9OryX+FoDy8nXS6scQ7dPptD8LnFDAUNcKWJjXQKDNJD3HVm+kOUsXhTOkpi69vI4EuAr95bA==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/@types/graceful-fs": {
      "version": "4.1.9",
      "resolved": "https://registry.npmjs.org/@types/graceful-fs/-/graceful-fs-4.1.9.tgz",
      "integrity": "sha512-olP3sd1qOEe5dXTSaFvQG+02VdRXcdytWLAZsAq1PecU8uqQAhkrnbli7DagjtXKW/Bl7YJbUsa8MPcuc8LHEQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/handlebars": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/@types/handlebars/-/handlebars-4.1.0.tgz",
      "integrity": "sha512-gq9YweFKNNB1uFK71eRqsd4niVkXrxHugqWFQkeLRJvGjnxsLr16bYtcsG4tOFwmYi0Bax+wCkbf1reUfdl4kA==",
      "deprecated": "This is a stub types definition. handlebars provides its own type definitions, so you do not need this installed.",
      "license": "MIT",
      "dependencies": {
        "handlebars": "*"
      }
    },
    "node_modules/@types/http-errors": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/@types/http-errors/-/http-errors-2.0.4.tgz",
      "integrity": "sha512-D0CFMMtydbJAegzOyHjtiKPLlvnm3iTZyZRSZoLq2mRhDdmLfIWOCYPfQJ4cu2erKghU++QvjcUjp/5h7hESpA=="
    },
    "node_modules/@types/istanbul-lib-coverage": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/@types/istanbul-lib-coverage/-/istanbul-lib-coverage-2.0.6.tgz",
      "integrity": "sha512-2QF/t/auWm0lsy8XtKVPG19v3sSOQlJe/YHZgfjb/KBBHOGSV+J2q/S671rcq9uTBrLAXmZpqJiaQbMT+zNU1w==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/@types/istanbul-lib-report": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/@types/istanbul-lib-report/-/istanbul-lib-report-3.0.3.tgz",
      "integrity": "sha512-NQn7AHQnk/RSLOxrBbGyJM/aVQ+pjj5HCgasFxc0K/KhoATfQ/47AyUl15I2yBUpihjmas+a+VJBOqecrFH+uA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@types/istanbul-lib-coverage": "*"
      }
    },
    "node_modules/@types/istanbul-reports": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@types/istanbul-reports/-/istanbul-reports-3.0.4.tgz",
      "integrity": "sha512-pk2B1NWalF9toCRu6gjBzR69syFjP4Od8WRAX+0mmf9lAjCRicLOWc+ZrxZHx/0XRjotgkF9t6iaMJ+aXcOdZQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@types/istanbul-lib-report": "*"
      }
    },
    "node_modules/@types/json-schema": {
      "version": "7.0.15",
      "resolved": "https://registry.npmjs.org/@types/json-schema/-/json-schema-7.0.15.tgz",
      "integrity": "sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA=="
    },
    "node_modules/@types/jsonwebtoken": {
      "version": "9.0.8",
      "resolved": "https://registry.npmjs.org/@types/jsonwebtoken/-/jsonwebtoken-9.0.8.tgz",
      "integrity": "sha512-7fx54m60nLFUVYlxAB1xpe9CBWX2vSrk50Y6ogRJ1v5xxtba7qXTg5BgYDN5dq+yuQQ9HaVlHJyAAt1/mxryFg==",
      "dependencies": {
        "@types/ms": "*",
        "@types/node": "*"
      }
    },
    "node_modules/@types/lodash": {
      "version": "4.17.14",
      "resolved": "https://registry.npmjs.org/@types/lodash/-/lodash-4.17.14.tgz",
      "integrity": "sha512-jsxagdikDiDBeIRaPYtArcT8my4tN1og7MtMRquFT3XNA6axxyHDRUemqDz/taRDdOUn0GnGHRCuff4q48sW9A==",
      "dev": true
    },
    "node_modules/@types/long": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/@types/long/-/long-4.0.2.tgz",
      "integrity": "sha512-MqTGEo5bj5t157U6fA/BiDynNkn0YknVdh48CMPkTSpFTVmvao5UQmm7uEF6xBEo7qIMAlY/JSleYaE6VOdpaA=="
    },
    "node_modules/@types/memcached": {
      "version": "2.2.10",
      "resolved": "https://registry.npmjs.org/@types/memcached/-/memcached-2.2.10.tgz",
      "integrity": "sha512-AM9smvZN55Gzs2wRrqeMHVP7KE8KWgCJO/XL5yCly2xF6EKa4YlbpK+cLSAH4NG/Ah64HrlegmGqW8kYws7Vxg==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/mime": {
      "version": "1.3.5",
      "resolved": "https://registry.npmjs.org/@types/mime/-/mime-1.3.5.tgz",
      "integrity": "sha512-/pyBZWSLD2n0dcHE3hq8s8ZvcETHtEuF+3E7XVt0Ig2nvsVQXdghHVcEkIWjy9A0wKfTn97a/PSDYohKIlnP/w=="
    },
    "node_modules/@types/ms": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@types/ms/-/ms-2.1.0.tgz",
      "integrity": "sha512-GsCCIZDE/p3i96vtEqx+7dBUGXrc7zeSK3wwPHIaRThS+9OhWIXRqzs4d6k1SVU8g91DrNRWxWUGhp5KXQb2VA=="
    },
    "node_modules/@types/mysql": {
      "version": "2.15.22",
      "resolved": "https://registry.npmjs.org/@types/mysql/-/mysql-2.15.22.tgz",
      "integrity": "sha512-wK1pzsJVVAjYCSZWQoWHziQZbNggXFDUEIGf54g4ZM/ERuP86uGdWeKZWMYlqTPMZfHJJvLPyogXGvCOg87yLQ==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/node": {
      "version": "22.10.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.10.10.tgz",
      "integrity": "sha512-X47y/mPNzxviAGY5TcYPtYL8JsY3kAq2n8fMmKoRCxq/c4v4pyGNCzM2R6+M5/umG4ZfHuT+sgqDYqWc9rJ6ww==",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/@types/node-fetch": {
      "version": "2.6.12",
      "resolved": "https://registry.npmjs.org/@types/node-fetch/-/node-fetch-2.6.12.tgz",
      "integrity": "sha512-8nneRWKCg3rMtF69nLQJnOYUcbafYeFSjqkw3jCRLsqkWFlHaoQrr5mXmofFGOx3DKn7UfmBMyov8ySvLRVldA==",
      "dependencies": {
        "@types/node": "*",
        "form-data": "^4.0.0"
      }
    },
    "node_modules/@types/node-fetch/node_modules/form-data": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-4.0.1.tgz",
      "integrity": "sha512-tzN8e4TX8+kkxGPK8D5u0FNmjPUjw3lwC9lSLxxoB/+GtsJG91CO8bSWy73APlgAZzZbXEYZJuxjkHH2w+Ezhw==",
      "dependencies": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.8",
        "mime-types": "^2.1.12"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/@types/pg": {
      "version": "8.6.1",
      "resolved": "https://registry.npmjs.org/@types/pg/-/pg-8.6.1.tgz",
      "integrity": "sha512-1Kc4oAGzAl7uqUStZCDvaLFqZrW9qWSjXOmBfdgyBP5La7Us6Mg4GBvRlSoaZMhQF/zSj1C8CtKMBkoiT8eL8w==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*",
        "pg-protocol": "*",
        "pg-types": "^2.2.0"
      }
    },
    "node_modules/@types/pg-pool": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/@types/pg-pool/-/pg-pool-2.0.4.tgz",
      "integrity": "sha512-qZAvkv1K3QbmHHFYSNRYPkRjOWRLBYrL4B9c+wG0GSVGBw0NtJwPcgx/DSddeDJvRGMHCEQ4VMEVfuJ/0gZ3XQ==",
      "license": "MIT",
      "dependencies": {
        "@types/pg": "*"
      }
    },
    "node_modules/@types/qs": {
      "version": "6.9.18",
      "resolved": "https://registry.npmjs.org/@types/qs/-/qs-6.9.18.tgz",
      "integrity": "sha512-kK7dgTYDyGqS+e2Q4aK9X3D7q234CIZ1Bv0q/7Z5IwRDoADNU81xXJK/YVyLbLTZCoIwUoDoffFeF+p/eIklAA=="
    },
    "node_modules/@types/range-parser": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/@types/range-parser/-/range-parser-1.2.7.tgz",
      "integrity": "sha512-hKormJbkJqzQGhziax5PItDUTMAM9uE2XXQmM37dyd4hVM+5aVl7oVxMVUiVQn2oCQFN/LKCZdvSM0pFRqbSmQ=="
    },
    "node_modules/@types/request": {
      "version": "2.48.12",
      "resolved": "https://registry.npmjs.org/@types/request/-/request-2.48.12.tgz",
      "integrity": "sha512-G3sY+NpsA9jnwm0ixhAFQSJ3Q9JkpLZpJbI3GMv0mIAT0y3mRabYeINzal5WOChIiaTEGQYlHOKgkaM9EisWHw==",
      "dependencies": {
        "@types/caseless": "*",
        "@types/node": "*",
        "@types/tough-cookie": "*",
        "form-data": "^2.5.0"
      }
    },
    "node_modules/@types/send": {
      "version": "0.17.4",
      "resolved": "https://registry.npmjs.org/@types/send/-/send-0.17.4.tgz",
      "integrity": "sha512-x2EM6TJOybec7c52BX0ZspPodMsQUd5L6PRwOunVyVUhXiBSKf3AezDL8Dgvgt5o0UfKNfuA0eMLr2wLT4AiBA==",
      "dependencies": {
        "@types/mime": "^1",
        "@types/node": "*"
      }
    },
    "node_modules/@types/serve-static": {
      "version": "1.15.7",
      "resolved": "https://registry.npmjs.org/@types/serve-static/-/serve-static-1.15.7.tgz",
      "integrity": "sha512-W8Ym+h8nhuRwaKPaDw34QUkwsGi6Rc4yYqvKFo5rm2FUEhCFbzVWrxXUxuKK8TASjWsysJY0nsmNCGhCOIsrOw==",
      "dependencies": {
        "@types/http-errors": "*",
        "@types/node": "*",
        "@types/send": "*"
      }
    },
    "node_modules/@types/shimmer": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/@types/shimmer/-/shimmer-1.2.0.tgz",
      "integrity": "sha512-UE7oxhQLLd9gub6JKIAhDq06T0F6FnztwMNRvYgjeQSBeMc1ZG/tA47EwfduvkuQS8apbkM/lpLpWsaCeYsXVg=="
    },
    "node_modules/@types/stack-utils": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/@types/stack-utils/-/stack-utils-2.0.3.tgz",
      "integrity": "sha512-9aEbYZ3TbYMznPdcdr3SmIrLXwC/AKZXQeCf9Pgao5CKb8CyHuEX5jzWPTkvregvhRJHcpRO6BFoGW9ycaOkYw==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/@types/tedious": {
      "version": "4.0.14",
      "resolved": "https://registry.npmjs.org/@types/tedious/-/tedious-4.0.14.tgz",
      "integrity": "sha512-KHPsfX/FoVbUGbyYvk1q9MMQHLPeRZhRJZdO45Q4YjvFkv4hMNghCWTvy7rdKessBsmtz4euWCWAB6/tVpI1Iw==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/tough-cookie": {
      "version": "4.0.5",
      "resolved": "https://registry.npmjs.org/@types/tough-cookie/-/tough-cookie-4.0.5.tgz",
      "integrity": "sha512-/Ad8+nIOV7Rl++6f1BdKxFSMgmoqEoYbHRpPcx3JEfv8VRsQe9Z4mCXeJBzxs7mbHY/XOZZuXlRNfhpVPbs6ZA=="
    },
    "node_modules/@types/triple-beam": {
      "version": "1.3.5",
      "resolved": "https://registry.npmjs.org/@types/triple-beam/-/triple-beam-1.3.5.tgz",
      "integrity": "sha512-6WaYesThRMCl19iryMYP7/x2OVgCtbIVflDGFpWnb9irXI3UjYE4AzmYuiUKY1AJstGijoY+MgUszMgRxIYTYw=="
    },
    "node_modules/@types/yargs": {
      "version": "17.0.33",
      "resolved": "https://registry.npmjs.org/@types/yargs/-/yargs-17.0.33.tgz",
      "integrity": "sha512-WpxBCKWPLr4xSsHgz511rFJAM+wS28w2zEO1QDNY5zM/S8ok70NNfztH0xwhqKyaK0OHCbN98LDAZuy1ctxDkA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@types/yargs-parser": "*"
      }
    },
    "node_modules/@types/yargs-parser": {
      "version": "21.0.3",
      "resolved": "https://registry.npmjs.org/@types/yargs-parser/-/yargs-parser-21.0.3.tgz",
      "integrity": "sha512-I4q9QU9MQv4oEOz4tAHJtNz1cwuLxn2F3xcc2iV5WdqLPpUnj30aUuxt1mAxYTG+oe8CZMV/+6rU4S4gRDzqtQ==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/@types/yauzl": {
      "version": "2.10.3",
      "resolved": "https://registry.npmjs.org/@types/yauzl/-/yauzl-2.10.3.tgz",
      "integrity": "sha512-oJoftv0LSuaDZE3Le4DbKX+KS9G36NzOeSap90UIK0yMA/NhKJhqlSGtNDORNRaIbQfzjXDrQa0ytJ6mNRGz/Q==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/abort-controller": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/abort-controller/-/abort-controller-3.0.0.tgz",
      "integrity": "sha512-h8lQ8tacZYnR3vNQTgibj+tODHI5/+l06Au2Pcriv/Gmet0eaj4TwWH41sO9wnHDiQsEj19q0drzdWdeAHtweg==",
      "dependencies": {
        "event-target-shim": "^5.0.0"
      },
      "engines": {
        "node": ">=6.5"
      }
    },
    "node_modules/accepts": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.8.tgz",
      "integrity": "sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==",
      "dependencies": {
        "mime-types": "~2.1.34",
        "negotiator": "0.6.3"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/acorn": {
      "version": "8.14.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.14.0.tgz",
      "integrity": "sha512-cl669nCJTZBsL97OF4kUQm5g5hC2uihk0NxY3WENAC0TYdILVkAyHymAntgxGkl7K+t0cXIrH5siy5S4XkFycA==",
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/acorn-import-attributes": {
      "version": "1.9.5",
      "resolved": "https://registry.npmjs.org/acorn-import-attributes/-/acorn-import-attributes-1.9.5.tgz",
      "integrity": "sha512-n02Vykv5uA3eHGM/Z2dQrcD56kL8TyDb2p1+0P83PClMnC/nc+anbQRhIOWnSq4Ke/KvDPrY3C9hDtC/A3eHnQ==",
      "peerDependencies": {
        "acorn": "^8"
      }
    },
    "node_modules/acorn-jsx": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/acorn-jsx/-/acorn-jsx-5.3.2.tgz",
      "integrity": "sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==",
      "dev": true,
      "peerDependencies": {
        "acorn": "^6.0.0 || ^7.0.0 || ^8.0.0"
      }
    },
    "node_modules/adm-zip": {
      "version": "0.5.16",
      "resolved": "https://registry.npmjs.org/adm-zip/-/adm-zip-0.5.16.tgz",
      "integrity": "sha512-TGw5yVi4saajsSEgz25grObGHEUaDrniwvA2qwSC060KfqGPdglhvPMA2lPIoxs3PQIItj2iag35fONcQqgUaQ==",
      "dev": true,
      "engines": {
        "node": ">=12.0"
      }
    },
    "node_modules/agent-base": {
      "version": "7.1.3",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-7.1.3.tgz",
      "integrity": "sha512-jRR5wdylq8CkOe6hei19GGZnxM6rBGwFl3Bg0YItGDimvjGtAvdZk4Pu6Cl4u4Igsws4a1fd1Vq3ezrhn4KmFw==",
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/agentkeepalive": {
      "version": "4.6.0",
      "resolved": "https://registry.npmjs.org/agentkeepalive/-/agentkeepalive-4.6.0.tgz",
      "integrity": "sha512-kja8j7PjmncONqaTsB8fQ+wE2mSU2DJ9D4XKoJ5PFWIdRMa6SLSN1ff4mOr4jCbfRSsxR4keIiySJU0N9T5hIQ==",
      "dependencies": {
        "humanize-ms": "^1.2.1"
      },
      "engines": {
        "node": ">= 8.0.0"
      }
    },
    "node_modules/ajv": {
      "version": "8.17.1",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-8.17.1.tgz",
      "integrity": "sha512-B/gBuNg5SiMTrPkC+A2+cW0RszwxYmn6VYxB/inlBStS5nx6xHIt/ehKRhIMhqusl7a8LjQoZnjCs5vhwxOQ1g==",
      "license": "MIT",
      "dependencies": {
        "fast-deep-equal": "^3.1.3",
        "fast-uri": "^3.0.1",
        "json-schema-traverse": "^1.0.0",
        "require-from-string": "^2.0.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/ajv-formats": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/ajv-formats/-/ajv-formats-3.0.1.tgz",
      "integrity": "sha512-8iUql50EUR+uUcdRQ3HDqa6EVyo3docL8g5WJ3FNcWmu62IbkGUue/pEyLBW8VGKKucTPgqeks4fIU1DA4yowQ==",
      "license": "MIT",
      "dependencies": {
        "ajv": "^8.0.0"
      },
      "peerDependencies": {
        "ajv": "^8.0.0"
      },
      "peerDependenciesMeta": {
        "ajv": {
          "optional": true
        }
      }
    },
    "node_modules/ansi-escapes": {
      "version": "4.3.2",
      "resolved": "https://registry.npmjs.org/ansi-escapes/-/ansi-escapes-4.3.2.tgz",
      "integrity": "sha512-gKXj5ALrKWQLsYG9jlTRmR/xKluxHV+Z9QEwNIgCfM1/uwPMCuzVVnh5mwTd+OuBZcwSIMbqssNWRm1lE51QaQ==",
      "dev": true,
      "dependencies": {
        "type-fest": "^0.21.3"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/anymatch": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/anymatch/-/anymatch-3.1.3.tgz",
      "integrity": "sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==",
      "dev": true,
      "dependencies": {
        "normalize-path": "^3.0.0",
        "picomatch": "^2.0.4"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/argparse": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-1.0.10.tgz",
      "integrity": "sha512-o5Roy6tNG4SL/FOkCAN6RzjiakZS25RLYFrcMttJqbdd8BWrnA+fGz57iN5Pb06pvBGvl5gQ0B48dJlslXvoTg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "sprintf-js": "~1.0.2"
      }
    },
    "node_modules/array-flatten": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/array-flatten/-/array-flatten-1.1.1.tgz",
      "integrity": "sha512-PCVAQswWemu6UdxsDFFX/+gVeYqKAod3D3UVm91jHwynguOwAvYPhx8nNlM++NqRcK6CxxpUafjmhIdKiHibqg=="
    },
    "node_modules/arrify": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/arrify/-/arrify-2.0.1.tgz",
      "integrity": "sha512-3duEwti880xqi4eAMN8AyR4a0ByT90zoYdLlevfrvU43vb0YZwZVfxOgxWrLXXXpyugL0hNZc9G6BiB5B3nUug==",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/async": {
      "version": "3.2.6",
      "resolved": "https://registry.npmjs.org/async/-/async-3.2.6.tgz",
      "integrity": "sha512-htCUDlxyyCLMgaM3xXg0C0LW2xqfuQ6p05pCEIsXuyQ+a1koYKTuBMzRNwmybfLgvJDMd0r1LTn4+E0Ti6C2AA=="
    },
    "node_modules/async-mutex": {
      "version": "0.5.0",
      "resolved": "https://registry.npmjs.org/async-mutex/-/async-mutex-0.5.0.tgz",
      "integrity": "sha512-1A94B18jkJ3DYq284ohPxoXbfTA5HsQ7/Mf4DEhcyLx3Bz27Rh59iScbB6EPiP+B+joue6YCxcMXSbFC1tZKwA==",
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/async-retry": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/async-retry/-/async-retry-1.3.3.tgz",
      "integrity": "sha512-wfr/jstw9xNi/0teMHrRW7dsz3Lt5ARhYNZ2ewpadnhaIp5mbALhOAP+EAdsC7t4Z6wqsDVv9+W6gm1Dk9mEyw==",
      "optional": true,
      "dependencies": {
        "retry": "0.13.1"
      }
    },
    "node_modules/asynckit": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
      "integrity": "sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q=="
    },
    "node_modules/axios": {
      "version": "1.7.9",
      "resolved": "https://registry.npmjs.org/axios/-/axios-1.7.9.tgz",
      "integrity": "sha512-LhLcE7Hbiryz8oMDdDptSrWowmB4Bl6RCt6sIJKpRB4XtVf0iEgewX3au/pJqm+Py1kCASkb/FFKjxQaLtxJvw==",
      "dev": true,
      "dependencies": {
        "follow-redirects": "^1.15.6",
        "form-data": "^4.0.0",
        "proxy-from-env": "^1.1.0"
      }
    },
    "node_modules/axios/node_modules/form-data": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-4.0.1.tgz",
      "integrity": "sha512-tzN8e4TX8+kkxGPK8D5u0FNmjPUjw3lwC9lSLxxoB/+GtsJG91CO8bSWy73APlgAZzZbXEYZJuxjkHH2w+Ezhw==",
      "dev": true,
      "dependencies": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.8",
        "mime-types": "^2.1.12"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/babel-jest": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/babel-jest/-/babel-jest-29.7.0.tgz",
      "integrity": "sha512-BrvGY3xZSwEcCzKvKsCi2GgHqDqsYkOP4/by5xCgIwGXQxIEh+8ew3gmrE1y7XRR6LHZIj6yLYnUi/mm2KXKBg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/transform": "^29.7.0",
        "@types/babel__core": "^7.1.14",
        "babel-plugin-istanbul": "^6.1.1",
        "babel-preset-jest": "^29.6.3",
        "chalk": "^4.0.0",
        "graceful-fs": "^4.2.9",
        "slash": "^3.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.8.0"
      }
    },
    "node_modules/babel-plugin-istanbul": {
      "version": "6.1.1",
      "resolved": "https://registry.npmjs.org/babel-plugin-istanbul/-/babel-plugin-istanbul-6.1.1.tgz",
      "integrity": "sha512-Y1IQok9821cC9onCx5otgFfRm7Lm+I+wwxOx738M/WLPZ9Q42m4IG5W0FNX8WLL2gYMZo3JkuXIH2DOpWM+qwA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "peer": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.0.0",
        "@istanbuljs/load-nyc-config": "^1.0.0",
        "@istanbuljs/schema": "^0.1.2",
        "istanbul-lib-instrument": "^5.0.4",
        "test-exclude": "^6.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/babel-plugin-istanbul/node_modules/istanbul-lib-instrument": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/istanbul-lib-instrument/-/istanbul-lib-instrument-5.2.1.tgz",
      "integrity": "sha512-pzqtp31nLv/XFOzXGuvhCb8qhjmTVo5vjVk19XE4CRlSWz0KoeJ3bw9XsA7nOp9YBf4qHjwBxkDzKcME/J29Yg==",
      "dev": true,
      "license": "BSD-3-Clause",
      "peer": true,
      "dependencies": {
        "@babel/core": "^7.12.3",
        "@babel/parser": "^7.14.7",
        "@istanbuljs/schema": "^0.1.2",
        "istanbul-lib-coverage": "^3.2.0",
        "semver": "^6.3.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/babel-plugin-jest-hoist": {
      "version": "29.6.3",
      "resolved": "https://registry.npmjs.org/babel-plugin-jest-hoist/-/babel-plugin-jest-hoist-29.6.3.tgz",
      "integrity": "sha512-ESAc/RJvGTFEzRwOTT4+lNDk/GNHMkKbNzsvT0qKRfDyyYTskxB5rnU2njIDYVxXCBHHEI1c0YwHob3WaYujOg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/template": "^7.3.3",
        "@babel/types": "^7.3.3",
        "@types/babel__core": "^7.1.14",
        "@types/babel__traverse": "^7.0.6"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/babel-preset-current-node-syntax": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/babel-preset-current-node-syntax/-/babel-preset-current-node-syntax-1.1.0.tgz",
      "integrity": "sha512-ldYss8SbBlWva1bs28q78Ju5Zq1F+8BrqBZZ0VFhLBvhh6lCpC2o3gDJi/5DRLs9FgYZCnmPYIVFU4lRXCkyUw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/plugin-syntax-async-generators": "^7.8.4",
        "@babel/plugin-syntax-bigint": "^7.8.3",
        "@babel/plugin-syntax-class-properties": "^7.12.13",
        "@babel/plugin-syntax-class-static-block": "^7.14.5",
        "@babel/plugin-syntax-import-attributes": "^7.24.7",
        "@babel/plugin-syntax-import-meta": "^7.10.4",
        "@babel/plugin-syntax-json-strings": "^7.8.3",
        "@babel/plugin-syntax-logical-assignment-operators": "^7.10.4",
        "@babel/plugin-syntax-nullish-coalescing-operator": "^7.8.3",
        "@babel/plugin-syntax-numeric-separator": "^7.10.4",
        "@babel/plugin-syntax-object-rest-spread": "^7.8.3",
        "@babel/plugin-syntax-optional-catch-binding": "^7.8.3",
        "@babel/plugin-syntax-optional-chaining": "^7.8.3",
        "@babel/plugin-syntax-private-property-in-object": "^7.14.5",
        "@babel/plugin-syntax-top-level-await": "^7.14.5"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/babel-preset-jest": {
      "version": "29.6.3",
      "resolved": "https://registry.npmjs.org/babel-preset-jest/-/babel-preset-jest-29.6.3.tgz",
      "integrity": "sha512-0B3bhxR6snWXJZtR/RliHTDPRgn1sNHOR0yVtq/IiQFyuOVjFS+wuio/R4gSNkyYmKmJB4wGZv2NZanmKmTnNA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "babel-plugin-jest-hoist": "^29.6.3",
        "babel-preset-current-node-syntax": "^1.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
      "dev": true
    },
    "node_modules/base64-js": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz",
      "integrity": "sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ]
    },
    "node_modules/big.js": {
      "version": "6.2.2",
      "resolved": "https://registry.npmjs.org/big.js/-/big.js-6.2.2.tgz",
      "integrity": "sha512-y/ie+Faknx7sZA5MfGA2xKlu0GDv8RWrXGsmlteyJQ2lvoKv9GBK/fpRMc2qlSoBAgNxrixICFCBefIq8WCQpQ==",
      "optional": true,
      "engines": {
        "node": "*"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/bigjs"
      }
    },
    "node_modules/bignumber.js": {
      "version": "9.1.2",
      "resolved": "https://registry.npmjs.org/bignumber.js/-/bignumber.js-9.1.2.tgz",
      "integrity": "sha512-2/mKyZH9K85bzOEfhXDBFZTGd1CTs+5IHpeFQo9luiBG7hghdC851Pj2WAhb6E3R6b9tZj/XKhbg4fum+Kepug==",
      "engines": {
        "node": "*"
      }
    },
    "node_modules/binary-extensions": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/binary-extensions/-/binary-extensions-2.3.0.tgz",
      "integrity": "sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==",
      "dev": true,
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/bl": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/bl/-/bl-4.1.0.tgz",
      "integrity": "sha512-1W07cM9gS6DcLperZfFSj+bWLtaPGSOHWhPiGzXmvVJbRLdG82sH/Kn8EtW1VqWVA54AKf2h5k5BbnIbwF3h6w==",
      "dev": true,
      "dependencies": {
        "buffer": "^5.5.0",
        "inherits": "^2.0.4",
        "readable-stream": "^3.4.0"
      }
    },
    "node_modules/body-parser": {
      "version": "1.20.3",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-1.20.3.tgz",
      "integrity": "sha512-7rAxByjUMqQ3/bHJy7D6OGXvx/MMc4IqBn/X0fcM1QUcAItpZrBEYhWGem+tzXH90c+G01ypMcYJBO9Y30203g==",
      "dependencies": {
        "bytes": "3.1.2",
        "content-type": "~1.0.5",
        "debug": "2.6.9",
        "depd": "2.0.0",
        "destroy": "1.2.0",
        "http-errors": "2.0.0",
        "iconv-lite": "0.4.24",
        "on-finished": "2.4.1",
        "qs": "6.13.0",
        "raw-body": "2.5.2",
        "type-is": "~1.6.18",
        "unpipe": "1.0.0"
      },
      "engines": {
        "node": ">= 0.8",
        "npm": "1.2.8000 || >= 1.4.16"
      }
    },
    "node_modules/brace-expansion": {
      "version": "1.1.11",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.11.tgz",
      "integrity": "sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==",
      "dev": true,
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dev": true,
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/browserslist": {
      "version": "4.24.4",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.24.4.tgz",
      "integrity": "sha512-KDi1Ny1gSePi1vm0q4oxSF8b4DR44GF4BbmS2YdhPLOEqd8pDviZOGH/GsmRwoWJ2+5Lr085X7naowMwKHDG1A==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "caniuse-lite": "^1.0.30001688",
        "electron-to-chromium": "^1.5.73",
        "node-releases": "^2.0.19",
        "update-browserslist-db": "^1.1.1"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/bser": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/bser/-/bser-2.1.1.tgz",
      "integrity": "sha512-gQxTNE/GAfIIrmHLUE3oJyp5FO6HRBfhjnw4/wMmA63ZGDJnWBmgY/lyQBpnDUkGmAhbSe39tx2d/iTOAfglwQ==",
      "dev": true,
      "license": "Apache-2.0",
      "peer": true,
      "dependencies": {
        "node-int64": "^0.4.0"
      }
    },
    "node_modules/buffer": {
      "version": "5.7.1",
      "resolved": "https://registry.npmjs.org/buffer/-/buffer-5.7.1.tgz",
      "integrity": "sha512-EHcyIPBQ4BSGlvjB16k5KgAJ27CIsHY/2JBmCRReo48y9rQ3MaUzWX3KVlBa4U7MyX02HdVj0K7C3WaB3ju7FQ==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "dependencies": {
        "base64-js": "^1.3.1",
        "ieee754": "^1.1.13"
      }
    },
    "node_modules/buffer-crc32": {
      "version": "0.2.13",
      "resolved": "https://registry.npmjs.org/buffer-crc32/-/buffer-crc32-0.2.13.tgz",
      "integrity": "sha512-VO9Ht/+p3SN7SKWqcrgEzjGbRSJYTx+Q1pTQC0wrWqHx0vpJraQ6GtHx8tvcg1rlK1byhU5gccxgOgj7B0TDkQ==",
      "dev": true,
      "engines": {
        "node": "*"
      }
    },
    "node_modules/buffer-equal-constant-time": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/buffer-equal-constant-time/-/buffer-equal-constant-time-1.0.1.tgz",
      "integrity": "sha512-zRpUiDwd/xk6ADqPMATG8vc9VPrkck7T07OIx0gnjmJAnHnTVXNQG3vfvWNuiZIkwu9KrKdA1iJKfsfTVxE6NA=="
    },
    "node_modules/buffer-from": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/buffer-from/-/buffer-from-1.1.2.tgz",
      "integrity": "sha512-E+XQCRwSbaaiChtv6k6Dwgc+bx+Bs6vuKJHHl5kox/BaKbhiXzqQOwK4cO22yElGp2OCmjwVhT3HmxgyPGnJfQ==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/bytes": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
      "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.1.tgz",
      "integrity": "sha512-BhYE+WDaywFg2TBWYNXAE+8B1ATnThNBqXHP5nQu0jWJdVvY2hvkpyB3qOmtmDePiS5/BDQ8wASEWGMWRG148g==",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.3.tgz",
      "integrity": "sha512-YTd+6wGlNlPxSuri7Y6X8tY2dmm12UMH66RpKMhiX6rsk5wXXnYgbUcOt8kiS31/AjfoTOvCsE+w8nZQLQnzHA==",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/callsites": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz",
      "integrity": "sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/camelcase": {
      "version": "5.3.1",
      "resolved": "https://registry.npmjs.org/camelcase/-/camelcase-5.3.1.tgz",
      "integrity": "sha512-L28STB170nwWS63UjtlEOE3dldQApaJXZkOI1uMFfzf3rRuPegHaHesyee+YxQ+W6SvRDQV6UrdOdRiR153wJg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001699",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001699.tgz",
      "integrity": "sha512-b+uH5BakXZ9Do9iK+CkDmctUSEqZl+SP056vc5usa0PL+ev5OHw003rZXcnjNDv3L8P5j6rwT6C0BPKSikW08w==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0",
      "peer": true
    },
    "node_modules/chalk": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
      "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^4.1.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/char-regex": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/char-regex/-/char-regex-1.0.2.tgz",
      "integrity": "sha512-kWWXztvZ5SBQV+eRgKFeh8q5sLuZY2+8WUIzlxWVTg+oGwY14qylx1KbKzHd8P6ZYkAg0xyIDU9JMHhyJMZ1jw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/chardet": {
      "version": "0.7.0",
      "resolved": "https://registry.npmjs.org/chardet/-/chardet-0.7.0.tgz",
      "integrity": "sha512-mT8iDcrh03qDGRRmoA2hmBJnxpllMR+0/0qlzjqZES6NdiWDcZkCNAk4rPFZ9Q85r27unkiNNg8ZOiwZXBHwcA==",
      "dev": true
    },
    "node_modules/chokidar": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz",
      "integrity": "sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==",
      "dev": true,
      "dependencies": {
        "anymatch": "~3.1.2",
        "braces": "~3.0.2",
        "glob-parent": "~5.1.2",
        "is-binary-path": "~2.1.0",
        "is-glob": "~4.0.1",
        "normalize-path": "~3.0.0",
        "readdirp": "~3.6.0"
      },
      "engines": {
        "node": ">= 8.10.0"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/ci-info": {
      "version": "3.9.0",
      "resolved": "https://registry.npmjs.org/ci-info/-/ci-info-3.9.0.tgz",
      "integrity": "sha512-NIxF55hv4nSqQswkAeiOi1r83xy8JldOFDTWiug55KBu9Jnblncd2U6ViHmYgHf01TPZS77NJBhBMKdWj9HQMQ==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/sibiraj-s"
        }
      ],
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/cjs-module-lexer": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/cjs-module-lexer/-/cjs-module-lexer-1.4.1.tgz",
      "integrity": "sha512-cuSVIHi9/9E/+821Qjdvngor+xpnlwnuwIyZOaLmHBVdXL+gP+I6QQB9VkO7RI77YIcTV+S1W9AreJ5eN63JBA=="
    },
    "node_modules/cli-cursor": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/cli-cursor/-/cli-cursor-3.1.0.tgz",
      "integrity": "sha512-I/zHAwsKf9FqGoXM4WWRACob9+SNukZTd94DWF57E4toouRulbCxcUh6RKUEOQlYTHJnzkPMySvPNaaSLNfLZw==",
      "dev": true,
      "dependencies": {
        "restore-cursor": "^3.1.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/cli-spinners": {
      "version": "2.9.2",
      "resolved": "https://registry.npmjs.org/cli-spinners/-/cli-spinners-2.9.2.tgz",
      "integrity": "sha512-ywqV+5MmyL4E7ybXgKys4DugZbX0FC6LnwrhjuykIjnK9k8OQacQ7axGKnjDXWNhns0xot3bZI5h55H8yo9cJg==",
      "dev": true,
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/cli-width": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/cli-width/-/cli-width-3.0.0.tgz",
      "integrity": "sha512-FxqpkPPwu1HjuN93Omfm4h8uIanXofW0RxVEW3k5RKx+mJJYSthzNhp32Kzxxy3YAEZ/Dc/EWN1vZRY0+kOhbw==",
      "dev": true,
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/cliui": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-8.0.1.tgz",
      "integrity": "sha512-BSeNnyus75C4//NQ9gQt1/csTXyo/8Sb+afLAkzAptFuMsod9HFokGNudZpi/oQV73hnVK+sR+5PVRMd+Dr7YQ==",
      "dependencies": {
        "string-width": "^4.2.0",
        "strip-ansi": "^6.0.1",
        "wrap-ansi": "^7.0.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/clone": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/clone/-/clone-1.0.4.tgz",
      "integrity": "sha512-JQHZ2QMW6l3aH/j6xCqQThY/9OH4D/9ls34cgkUBiEeocRTU04tHfKPBsUK1PqZCUQM7GiA0IIXJSuXHI64Kbg==",
      "dev": true,
      "engines": {
        "node": ">=0.8"
      }
    },
    "node_modules/co": {
      "version": "4.6.0",
      "resolved": "https://registry.npmjs.org/co/-/co-4.6.0.tgz",
      "integrity": "sha512-QVb0dM5HvG+uaxitm8wONl7jltx8dqhfU33DcqtOZcLSVIKSDDLDi7+0LbAKiyI8hD9u42m2YxXSkMGWThaecQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "iojs": ">= 1.0.0",
        "node": ">= 0.12.0"
      }
    },
    "node_modules/collect-v8-coverage": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/collect-v8-coverage/-/collect-v8-coverage-1.0.2.tgz",
      "integrity": "sha512-lHl4d5/ONEbLlJvaJNtsF/Lz+WvB07u2ycqTYbdrq7UypDXailES4valYb2eWiJFxZlVmpGekfqoxQhzyFdT4Q==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/color": {
      "version": "3.2.1",
      "resolved": "https://registry.npmjs.org/color/-/color-3.2.1.tgz",
      "integrity": "sha512-aBl7dZI9ENN6fUGC7mWpMTPNHmWUSNan9tuWN6ahh5ZLNk9baLJOnSMlrQkHcrfFgz2/RigjUVAjdx36VcemKA==",
      "dependencies": {
        "color-convert": "^1.9.3",
        "color-string": "^1.6.0"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA=="
    },
    "node_modules/color-string": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/color-string/-/color-string-1.9.1.tgz",
      "integrity": "sha512-shrVawQFojnZv6xM40anx4CkoDP+fZsw/ZerEMsW/pyzsRbElpsL/DBVW7q3ExxwusdNXI3lXpuhEZkzs8p5Eg==",
      "dependencies": {
        "color-name": "^1.0.0",
        "simple-swizzle": "^0.2.2"
      }
    },
    "node_modules/color/node_modules/color-convert": {
      "version": "1.9.3",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-1.9.3.tgz",
      "integrity": "sha512-QfAUtd+vFdAtFQcC8CCyYt1fYWxSqAiK2cSD6zDB8N3cpsEBAvRxp9zOGg6G/SHHJYAT88/az/IuDGALsNVbGg==",
      "dependencies": {
        "color-name": "1.1.3"
      }
    },
    "node_modules/color/node_modules/color-name": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.3.tgz",
      "integrity": "sha512-72fSenhMw2HZMTVHeCA9KCmpEIbzWiQsjN+BHcBbS9vr1mtt+vJjPdksIBNUmKAW8TFUDPJK5SUU3QhE9NEXDw=="
    },
    "node_modules/colorette": {
      "version": "2.0.20",
      "resolved": "https://registry.npmjs.org/colorette/-/colorette-2.0.20.tgz",
      "integrity": "sha512-IfEDxwoWIjkeXL1eXcDiow4UbKjhLdq6/EuSVR9GMN7KVH3r9gQ83e73hsz1Nd1T3ijd5xv1wcWRYO+D6kCI2w=="
    },
    "node_modules/colorspace": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/colorspace/-/colorspace-1.1.4.tgz",
      "integrity": "sha512-BgvKJiuVu1igBUF2kEjRCZXol6wiiGbY5ipL/oVPwm0BL9sIpMIzM8IK7vwuxIIzOXMV3Ey5w+vxhm0rR/TN8w==",
      "dependencies": {
        "color": "^3.1.3",
        "text-hex": "1.0.x"
      }
    },
    "node_modules/combined-stream": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
      "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
      "dependencies": {
        "delayed-stream": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/commander": {
      "version": "11.1.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-11.1.0.tgz",
      "integrity": "sha512-yPVavfyCcRhmorC7rWlkHn15b4wDVgVmBA7kV4QVBsF7kv/9TKJAbAXVTxvTnwP8HHKjRCJDClKbciiYS7p0DQ==",
      "dev": true,
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "dev": true
    },
    "node_modules/configstore": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/configstore/-/configstore-5.0.1.tgz",
      "integrity": "sha512-aMKprgk5YhBNyH25hj8wGt2+D52Sw1DRRIzqBwLp2Ya9mFmY8KPvvtvmna8SxVR9JMZ4kzMD68N22vlaRpkeFA==",
      "dev": true,
      "dependencies": {
        "dot-prop": "^5.2.0",
        "graceful-fs": "^4.1.2",
        "make-dir": "^3.0.0",
        "unique-string": "^2.0.0",
        "write-file-atomic": "^3.0.0",
        "xdg-basedir": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/configstore/node_modules/make-dir": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/make-dir/-/make-dir-3.1.0.tgz",
      "integrity": "sha512-g3FeP20LNwhALb/6Cz6Dd4F2ngze0jz7tbzrD2wAV+o9FeNHe4rL+yK2md0J/fiSf1sa1ADhXqi5+oVwOM/eGw==",
      "dev": true,
      "dependencies": {
        "semver": "^6.0.0"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/configstore/node_modules/write-file-atomic": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/write-file-atomic/-/write-file-atomic-3.0.3.tgz",
      "integrity": "sha512-AvHcyZ5JnSfq3ioSyjrBkH9yW4m7Ayk8/9My/DD9onKeu/94fwrMocemO2QAJFAlnnDN+ZDS+ZjAR5ua1/PV/Q==",
      "dev": true,
      "dependencies": {
        "imurmurhash": "^0.1.4",
        "is-typedarray": "^1.0.0",
        "signal-exit": "^3.0.2",
        "typedarray-to-buffer": "^3.1.5"
      }
    },
    "node_modules/content-disposition": {
      "version": "0.5.4",
      "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-0.5.4.tgz",
      "integrity": "sha512-FveZTNuGw04cxlAiWbzi6zTAL/lhehaWbTtgluJh4/E95DqMwTmha3KZN1aAWA8cFIhHzMZUvLevkw5Rqk+tSQ==",
      "dependencies": {
        "safe-buffer": "5.2.1"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/content-type": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.5.tgz",
      "integrity": "sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/cookie": {
      "version": "0.7.1",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.1.tgz",
      "integrity": "sha512-6DnInpx7SJ2AK3+CTUE/ZM0vWTUboZCegxhC2xiIydHR9jNuTAASBrfEpHhiGOZw/nX51bHt6YQl8jsGo4y/0w==",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie-signature": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.0.6.tgz",
      "integrity": "sha512-QADzlaHc8icV8I7vbaJXJwod9HWYp8uCqf1xa4OfNu1T7JVxQIrUgOWtHdNDtPiywmFbiS12VjotIXLrKM3orQ=="
    },
    "node_modules/cors": {
      "version": "2.8.5",
      "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.5.tgz",
      "integrity": "sha512-KIHbLJqu73RGr/hnbrO9uBeixNGuvSQjul/jdFvS/KFSIH1hWVd1ng7zOHx+YrEfInLG7q4n6GHQ9cDtxv/P6g==",
      "dependencies": {
        "object-assign": "^4",
        "vary": "^1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/create-jest": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/create-jest/-/create-jest-29.7.0.tgz",
      "integrity": "sha512-Adz2bdH0Vq3F53KEMJOoftQFutWCukm6J24wbPWRO4k1kMY7gS7ds/uoJkNuV8wDCtWWnuwGcJwpWcih+zEW1Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/types": "^29.6.3",
        "chalk": "^4.0.0",
        "exit": "^0.1.2",
        "graceful-fs": "^4.2.9",
        "jest-config": "^29.7.0",
        "jest-util": "^29.7.0",
        "prompts": "^2.0.1"
      },
      "bin": {
        "create-jest": "bin/create-jest.js"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "dev": true,
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/crypto-random-string": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/crypto-random-string/-/crypto-random-string-2.0.0.tgz",
      "integrity": "sha512-v1plID3y9r/lPhviJ1wrXpLeyUIGAZ2SHNYTEapm7/8A9nLPoyvVp3RK/EPFqn5kEznyWgYZNsRtYYIWbuG8KA==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/data-uri-to-buffer": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/data-uri-to-buffer/-/data-uri-to-buffer-4.0.1.tgz",
      "integrity": "sha512-0R9ikRb668HB7QDxT1vkpuUBtqc53YyAwMwGeUFKRojY/NWKvdZ+9UYtRfGmhqNbRkTSVpMbmyhXipFFv2cb/A==",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/dedent": {
      "version": "1.5.3",
      "resolved": "https://registry.npmjs.org/dedent/-/dedent-1.5.3.tgz",
      "integrity": "sha512-NHQtfOOW68WD8lgypbLA5oT+Bt0xXJhiYvoR6SmmNXZfpzOGXwdKWmcwG8N7PwVVWV3eF/68nmD9BaJSsTBhyQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "peerDependencies": {
        "babel-plugin-macros": "^3.1.0"
      },
      "peerDependenciesMeta": {
        "babel-plugin-macros": {
          "optional": true
        }
      }
    },
    "node_modules/deeks": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/deeks/-/deeks-3.1.0.tgz",
      "integrity": "sha512-e7oWH1LzIdv/prMQ7pmlDlaVoL64glqzvNgkgQNgyec9ORPHrT2jaOqMtRyqJuwWjtfb6v+2rk9pmaHj+F137A==",
      "dev": true,
      "engines": {
        "node": ">= 16"
      }
    },
    "node_modules/deep-is": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.4.tgz",
      "integrity": "sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==",
      "dev": true
    },
    "node_modules/deepmerge": {
      "version": "4.3.1",
      "resolved": "https://registry.npmjs.org/deepmerge/-/deepmerge-4.3.1.tgz",
      "integrity": "sha512-3sUqbMEc77XqpdNO7FRyRog+eW3ph+GYCbj+rK+uYyRMuwsVy0rMiVtPn+QJlKFvWP/1PYpapqYn0Me2knFn+A==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/defaults": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/defaults/-/defaults-1.0.4.tgz",
      "integrity": "sha512-eFuaLoy/Rxalv2kr+lqMlUnrDWV+3j4pljOIJgLIhI058IQfWJ7vXhyEIHu+HtC738klGALYxOKDO0bQP3tg8A==",
      "dev": true,
      "dependencies": {
        "clone": "^1.0.2"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/delayed-stream": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
      "integrity": "sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/depd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
      "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/destroy": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/destroy/-/destroy-1.2.0.tgz",
      "integrity": "sha512-2sJGJTaXIIaR1w4iJSNoN0hnMY7Gpc/n8D4qSCJw8QqFWXf7cuAgnEHxBpweaVcPevC2l3KpjYCx3NypQQgaJg==",
      "engines": {
        "node": ">= 0.8",
        "npm": "1.2.8000 || >= 1.4.16"
      }
    },
    "node_modules/detect-newline": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/detect-newline/-/detect-newline-3.1.0.tgz",
      "integrity": "sha512-TLz+x/vEXm/Y7P7wn1EJFNLxYpUD4TgMosxY6fAVJUnJMbupHBOncxyWUG9OpTaH9EBD7uFI5LfEgmMOc54DsA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/diff-sequences": {
      "version": "29.6.3",
      "resolved": "https://registry.npmjs.org/diff-sequences/-/diff-sequences-29.6.3.tgz",
      "integrity": "sha512-EjePK1srD3P08o2j4f0ExnylqRs5B9tJjcp9t1krH2qRi8CCdsYfwe9JgSLurFBWwq4uOlipzfk5fHNvwFKr8Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/doc-path": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/doc-path/-/doc-path-4.1.1.tgz",
      "integrity": "sha512-h1ErTglQAVv2gCnOpD3sFS6uolDbOKHDU1BZq+Kl3npPqroU3dYL42lUgMfd5UimlwtRgp7C9dLGwqQ5D2HYgQ==",
      "dev": true,
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/dot-prop": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/dot-prop/-/dot-prop-5.3.0.tgz",
      "integrity": "sha512-QM8q3zDe58hqUqjraQOmzZ1LIH9SWQJTlEKCH4kJ2oQvLZk7RbQXvtDM2XEq3fwkV9CCvvH4LA0AV+ogFsBM2Q==",
      "dev": true,
      "dependencies": {
        "is-obj": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/dotprompt": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dotprompt/-/dotprompt-1.0.1.tgz",
      "integrity": "sha512-mruM6m+pWe4t41InRDRchNLSl3x+q7iIBukVuUfb7vvN7aEOwP+BuONACAdaEeAqlMDtWHcTsuqqBdAAjGwamg==",
      "license": "ISC",
      "dependencies": {
        "@types/handlebars": "^4.1.0",
        "handlebars": "^4.7.8",
        "yaml": "^2.5.0"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/duplexer": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/duplexer/-/duplexer-0.1.2.tgz",
      "integrity": "sha512-jtD6YG370ZCIi/9GTaJKQxWTZD045+4R4hTk/x1UyoqadyJ9x9CgSi1RlVDQF8U2sxLLSnFkCaMihqljHIWgMg==",
      "dev": true
    },
    "node_modules/duplexify": {
      "version": "4.1.3",
      "resolved": "https://registry.npmjs.org/duplexify/-/duplexify-4.1.3.tgz",
      "integrity": "sha512-M3BmBhwJRZsSx38lZyhE53Csddgzl5R7xGJNk7CVddZD6CcmwMCH8J+7AprIrQKH7TonKxaCjcv27Qmf+sQ+oA==",
      "dependencies": {
        "end-of-stream": "^1.4.1",
        "inherits": "^2.0.3",
        "readable-stream": "^3.1.1",
        "stream-shift": "^1.0.2"
      }
    },
    "node_modules/eastasianwidth": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/eastasianwidth/-/eastasianwidth-0.2.0.tgz",
      "integrity": "sha512-I88TYZWc9XiYHRQ4/3c5rjjfgkjhLyW2luGIheGERbNQ6OY7yTybanSpDXZa8y7VUP9YmDcYa+eyq4ca7iLqWA==",
      "dev": true
    },
    "node_modules/ecdsa-sig-formatter": {
      "version": "1.0.11",
      "resolved": "https://registry.npmjs.org/ecdsa-sig-formatter/-/ecdsa-sig-formatter-1.0.11.tgz",
      "integrity": "sha512-nagl3RYrbNv6kQkeJIpt6NJZy8twLB/2vtz6yN9Z4vRKHN4/QZJIEbqohALSgwKdnksuY3k5Addp5lg8sVoVcQ==",
      "dependencies": {
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow=="
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.97",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.97.tgz",
      "integrity": "sha512-HKLtaH02augM7ZOdYRuO19rWDeY+QSJ1VxnXFa/XDFLf07HvM90pALIJFgrO+UVaajI3+aJMMpojoUTLZyQ7JQ==",
      "dev": true,
      "license": "ISC",
      "peer": true
    },
    "node_modules/emittery": {
      "version": "0.13.1",
      "resolved": "https://registry.npmjs.org/emittery/-/emittery-0.13.1.tgz",
      "integrity": "sha512-DeWwawk6r5yR9jFgnDKYt4sLS0LmHJJi3ZOnb5/JdbYwj3nW+FxQnHIjhBKz8YLC7oRNPVM9NQ47I3CVx34eqQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sindresorhus/emittery?sponsor=1"
      }
    },
    "node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A=="
    },
    "node_modules/enabled": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/enabled/-/enabled-2.0.0.tgz",
      "integrity": "sha512-AKrN98kuwOzMIdAizXGI86UFBoo26CL21UM763y1h/GMSJ4/OHU9k2YlsmBpyScFo/wbLzWQJBMCW4+IO3/+OQ=="
    },
    "node_modules/encodeurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
      "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/end-of-stream": {
      "version": "1.4.4",
      "resolved": "https://registry.npmjs.org/end-of-stream/-/end-of-stream-1.4.4.tgz",
      "integrity": "sha512-+uw1inIHVPQoaVuHzRyXd21icM+cnt4CzD5rW+NC1wjOUSTOs+Te7FOv7AhN7vS9x/oIyhLP5PR1H+phQAHu5Q==",
      "dependencies": {
        "once": "^1.4.0"
      }
    },
    "node_modules/error-ex": {
      "version": "1.3.2",
      "resolved": "https://registry.npmjs.org/error-ex/-/error-ex-1.3.2.tgz",
      "integrity": "sha512-7dFHNmqeFSEt2ZBsCriorKnn3Z2pj+fd9kmI6QoWw4//DL+icEBfc0U7qJCisqrTsKTjw4fNFy2pW9OqStD84g==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "is-arrayish": "^0.2.1"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
      "integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/esbuild": {
      "version": "0.23.1",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.23.1.tgz",
      "integrity": "sha512-VVNz/9Sa0bs5SELtn3f7qhJCDPCF5oMEl5cO9/SSinpE9hbPVvxbd572HH5AKiP7WD8INO53GgfDDhRjkylHEg==",
      "dev": true,
      "hasInstallScript": true,
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.23.1",
        "@esbuild/android-arm": "0.23.1",
        "@esbuild/android-arm64": "0.23.1",
        "@esbuild/android-x64": "0.23.1",
        "@esbuild/darwin-arm64": "0.23.1",
        "@esbuild/darwin-x64": "0.23.1",
        "@esbuild/freebsd-arm64": "0.23.1",
        "@esbuild/freebsd-x64": "0.23.1",
        "@esbuild/linux-arm": "0.23.1",
        "@esbuild/linux-arm64": "0.23.1",
        "@esbuild/linux-ia32": "0.23.1",
        "@esbuild/linux-loong64": "0.23.1",
        "@esbuild/linux-mips64el": "0.23.1",
        "@esbuild/linux-ppc64": "0.23.1",
        "@esbuild/linux-riscv64": "0.23.1",
        "@esbuild/linux-s390x": "0.23.1",
        "@esbuild/linux-x64": "0.23.1",
        "@esbuild/netbsd-x64": "0.23.1",
        "@esbuild/openbsd-arm64": "0.23.1",
        "@esbuild/openbsd-x64": "0.23.1",
        "@esbuild/sunos-x64": "0.23.1",
        "@esbuild/win32-arm64": "0.23.1",
        "@esbuild/win32-ia32": "0.23.1",
        "@esbuild/win32-x64": "0.23.1"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow=="
    },
    "node_modules/escape-string-regexp": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-2.0.0.tgz",
      "integrity": "sha512-UpzcLCXolUWcNu5HtVMHYdXJjArjsF9C0aNnquZYY4uW/Vu0miy5YoWvbV345HauVvcAUnpRuhMMcqTcGOY2+w==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/eslint": {
      "version": "9.18.0",
      "resolved": "https://registry.npmjs.org/eslint/-/eslint-9.18.0.tgz",
      "integrity": "sha512-+waTfRWQlSbpt3KWE+CjrPPYnbq9kfZIYUqapc0uBXyjTp8aYXZDsUH16m39Ryq3NjAVP4tjuF7KaukeqoCoaA==",
      "dev": true,
      "dependencies": {
        "@eslint-community/eslint-utils": "^4.2.0",
        "@eslint-community/regexpp": "^4.12.1",
        "@eslint/config-array": "^0.19.0",
        "@eslint/core": "^0.10.0",
        "@eslint/eslintrc": "^3.2.0",
        "@eslint/js": "9.18.0",
        "@eslint/plugin-kit": "^0.2.5",
        "@humanfs/node": "^0.16.6",
        "@humanwhocodes/module-importer": "^1.0.1",
        "@humanwhocodes/retry": "^0.4.1",
        "@types/estree": "^1.0.6",
        "@types/json-schema": "^7.0.15",
        "ajv": "^6.12.4",
        "chalk": "^4.0.0",
        "cross-spawn": "^7.0.6",
        "debug": "^4.3.2",
        "escape-string-regexp": "^4.0.0",
        "eslint-scope": "^8.2.0",
        "eslint-visitor-keys": "^4.2.0",
        "espree": "^10.3.0",
        "esquery": "^1.5.0",
        "esutils": "^2.0.2",
        "fast-deep-equal": "^3.1.3",
        "file-entry-cache": "^8.0.0",
        "find-up": "^5.0.0",
        "glob-parent": "^6.0.2",
        "ignore": "^5.2.0",
        "imurmurhash": "^0.1.4",
        "is-glob": "^4.0.0",
        "json-stable-stringify-without-jsonify": "^1.0.1",
        "lodash.merge": "^4.6.2",
        "minimatch": "^3.1.2",
        "natural-compare": "^1.4.0",
        "optionator": "^0.9.3"
      },
      "bin": {
        "eslint": "bin/eslint.js"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      },
      "peerDependencies": {
        "jiti": "*"
      },
      "peerDependenciesMeta": {
        "jiti": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-scope": {
      "version": "8.2.0",
      "resolved": "https://registry.npmjs.org/eslint-scope/-/eslint-scope-8.2.0.tgz",
      "integrity": "sha512-PHlWUfG6lvPc3yvP5A4PNyBL1W8fkDUccmI21JUu/+GKZBoH/W5u6usENXUrWFRsyoW5ACUjFGgAFQp5gUlb/A==",
      "dev": true,
      "dependencies": {
        "esrecurse": "^4.3.0",
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/eslint-visitor-keys": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-4.2.0.tgz",
      "integrity": "sha512-UyLnSehNt62FFhSwjZlHmeokpRK59rcz29j+F1/aDgbkbRTk7wIc9XzdoasMUbRNKDM0qQt/+BJ4BrpFeABemw==",
      "dev": true,
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/eslint/node_modules/ajv": {
      "version": "6.12.6",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.12.6.tgz",
      "integrity": "sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==",
      "dev": true,
      "dependencies": {
        "fast-deep-equal": "^3.1.1",
        "fast-json-stable-stringify": "^2.0.0",
        "json-schema-traverse": "^0.4.1",
        "uri-js": "^4.2.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/eslint/node_modules/debug": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.0.tgz",
      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
      "dev": true,
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/eslint/node_modules/escape-string-regexp": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz",
      "integrity": "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==",
      "dev": true,
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint/node_modules/find-up": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-5.0.0.tgz",
      "integrity": "sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==",
      "dev": true,
      "dependencies": {
        "locate-path": "^6.0.0",
        "path-exists": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint/node_modules/glob-parent": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz",
      "integrity": "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==",
      "dev": true,
      "dependencies": {
        "is-glob": "^4.0.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/eslint/node_modules/json-schema-traverse": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
      "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==",
      "dev": true
    },
    "node_modules/eslint/node_modules/locate-path": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-6.0.0.tgz",
      "integrity": "sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==",
      "dev": true,
      "dependencies": {
        "p-locate": "^5.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true
    },
    "node_modules/eslint/node_modules/p-locate": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-5.0.0.tgz",
      "integrity": "sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==",
      "dev": true,
      "dependencies": {
        "p-limit": "^3.0.2"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/espree": {
      "version": "10.3.0",
      "resolved": "https://registry.npmjs.org/espree/-/espree-10.3.0.tgz",
      "integrity": "sha512-0QYC8b24HWY8zjRnDTL6RiHfDbAWn63qb4LMj1Z4b076A4une81+z03Kg7l7mn/48PUTqoLptSXez8oknU8Clg==",
      "dev": true,
      "dependencies": {
        "acorn": "^8.14.0",
        "acorn-jsx": "^5.3.2",
        "eslint-visitor-keys": "^4.2.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/esprima": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/esprima/-/esprima-4.0.1.tgz",
      "integrity": "sha512-eGuFFw7Upda+g4p+QHvnW0RyTX/SVeJBDM/gCtMARO0cLuT2HcEKnTPvhjV6aGeqrCB/sbNop0Kszm0jsaWU4A==",
      "dev": true,
      "license": "BSD-2-Clause",
      "peer": true,
      "bin": {
        "esparse": "bin/esparse.js",
        "esvalidate": "bin/esvalidate.js"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/esquery": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/esquery/-/esquery-1.6.0.tgz",
      "integrity": "sha512-ca9pw9fomFcKPvFLXhBKUK90ZvGibiGOvRJNbjljY7s7uq/5YO4BOzcYtJqExdx99rF6aAcnRxHmcUHcz6sQsg==",
      "dev": true,
      "dependencies": {
        "estraverse": "^5.1.0"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/esrecurse": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/esrecurse/-/esrecurse-4.3.0.tgz",
      "integrity": "sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==",
      "dev": true,
      "dependencies": {
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/estraverse": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/estraverse/-/estraverse-5.3.0.tgz",
      "integrity": "sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==",
      "dev": true,
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/esutils": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
      "integrity": "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/event-stream": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/event-stream/-/event-stream-3.3.4.tgz",
      "integrity": "sha512-QHpkERcGsR0T7Qm3HNJSyXKEEj8AHNxkY3PK8TS2KJvQ7NiSHe3DDpwVKKtoYprL/AreyzFBeIkBIWChAqn60g==",
      "dev": true,
      "dependencies": {
        "duplexer": "~0.1.1",
        "from": "~0",
        "map-stream": "~0.1.0",
        "pause-stream": "0.0.11",
        "split": "0.3",
        "stream-combiner": "~0.0.4",
        "through": "~2.3.1"
      }
    },
    "node_modules/event-target-shim": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/event-target-shim/-/event-target-shim-5.0.1.tgz",
      "integrity": "sha512-i/2XbnSz/uxRCU6+NdVJgKWDTM427+MqYbkQzD321DuCQJUqOuJKIA0IM2+W2xtYHdKOmZ4dR6fExsd4SXL+WQ==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/eventid": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/eventid/-/eventid-2.0.1.tgz",
      "integrity": "sha512-sPNTqiMokAvV048P2c9+foqVJzk49o6d4e0D/sq5jog3pw+4kBgyR0gaM1FM7Mx6Kzd9dztesh9oYz1LWWOpzw==",
      "license": "Apache-2.0",
      "dependencies": {
        "uuid": "^8.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/eventid/node_modules/uuid": {
      "version": "8.3.2",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-8.3.2.tgz",
      "integrity": "sha512-+NYs2QeMWy+GWFOEm9xnn6HCDp0l7QBD7ml8zLUmJ+93Q5NF0NocErnwkTkXVFNiX3/fpC6afS8Dhb/gz7R7eg==",
      "license": "MIT",
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/execa": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/execa/-/execa-5.1.1.tgz",
      "integrity": "sha512-8uSpZZocAZRBAPIEINJj3Lo9HyGitllczc27Eh5YYojjMFMn8yHMDMaUHE2Jqfq05D/wucwI4JGURyXt1vchyg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "cross-spawn": "^7.0.3",
        "get-stream": "^6.0.0",
        "human-signals": "^2.1.0",
        "is-stream": "^2.0.0",
        "merge-stream": "^2.0.0",
        "npm-run-path": "^4.0.1",
        "onetime": "^5.1.2",
        "signal-exit": "^3.0.3",
        "strip-final-newline": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sindresorhus/execa?sponsor=1"
      }
    },
    "node_modules/exit": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/exit/-/exit-0.1.2.tgz",
      "integrity": "sha512-Zk/eNKV2zbjpKzrsQ+n1G6poVbErQxJ0LBOJXaKZ1EViLzH+hrLu9cdXI4zw9dBQJslwBEpbQ2P1oS7nDxs6jQ==",
      "dev": true,
      "peer": true,
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/expect": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/expect/-/expect-29.7.0.tgz",
      "integrity": "sha512-2Zks0hf1VLFYI1kbh0I5jP3KHHyCHpkfyHBzsSXRFgl/Bg9mWYfMW8oD+PdMPlEwy5HNsR9JutYy6pMeOh61nw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/expect-utils": "^29.7.0",
        "jest-get-type": "^29.6.3",
        "jest-matcher-utils": "^29.7.0",
        "jest-message-util": "^29.7.0",
        "jest-util": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/express": {
      "version": "4.21.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.21.2.tgz",
      "integrity": "sha512-28HqgMZAmih1Czt9ny7qr6ek2qddF4FclbMzwhCREB6OFfH+rXAnuNCwo1/wFvrtbgsQDb4kSbX9de9lFbrXnA==",
      "dependencies": {
        "accepts": "~1.3.8",
        "array-flatten": "1.1.1",
        "body-parser": "1.20.3",
        "content-disposition": "0.5.4",
        "content-type": "~1.0.4",
        "cookie": "0.7.1",
        "cookie-signature": "1.0.6",
        "debug": "2.6.9",
        "depd": "2.0.0",
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "etag": "~1.8.1",
        "finalhandler": "1.3.1",
        "fresh": "0.5.2",
        "http-errors": "2.0.0",
        "merge-descriptors": "1.0.3",
        "methods": "~1.1.2",
        "on-finished": "2.4.1",
        "parseurl": "~1.3.3",
        "path-to-regexp": "0.1.12",
        "proxy-addr": "~2.0.7",
        "qs": "6.13.0",
        "range-parser": "~1.2.1",
        "safe-buffer": "5.2.1",
        "send": "0.19.0",
        "serve-static": "1.16.2",
        "setprototypeof": "1.2.0",
        "statuses": "2.0.1",
        "type-is": "~1.6.18",
        "utils-merge": "1.0.1",
        "vary": "~1.1.2"
      },
      "engines": {
        "node": ">= 0.10.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/extend": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/extend/-/extend-3.0.2.tgz",
      "integrity": "sha512-fjquC59cD7CyW6urNXK0FBufkZcoiGG80wTuPujX590cB5Ttln20E2UB4S/WARVqhXffZl2LNgS+gQdPIIim/g=="
    },
    "node_modules/external-editor": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/external-editor/-/external-editor-3.1.0.tgz",
      "integrity": "sha512-hMQ4CX1p1izmuLYyZqLMO/qGNw10wSv9QDCPfzXfyFrOaCSSoRfqE1Kf1s5an66J5JZC62NewG+mK49jOCtQew==",
      "dev": true,
      "dependencies": {
        "chardet": "^0.7.0",
        "iconv-lite": "^0.4.24",
        "tmp": "^0.0.33"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/extract-zip": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/extract-zip/-/extract-zip-2.0.1.tgz",
      "integrity": "sha512-GDhU9ntwuKyGXdZBUgTIe+vXnWj0fppUEtMDL0+idd5Sta8TGpHssn/eusA9mrPr9qNDym6SxAYZjNvCn/9RBg==",
      "dev": true,
      "dependencies": {
        "debug": "^4.1.1",
        "get-stream": "^5.1.0",
        "yauzl": "^2.10.0"
      },
      "bin": {
        "extract-zip": "cli.js"
      },
      "engines": {
        "node": ">= 10.17.0"
      },
      "optionalDependencies": {
        "@types/yauzl": "^2.9.1"
      }
    },
    "node_modules/extract-zip/node_modules/debug": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.0.tgz",
      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
      "dev": true,
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/extract-zip/node_modules/get-stream": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/get-stream/-/get-stream-5.2.0.tgz",
      "integrity": "sha512-nBF+F1rAZVCu/p7rjzgA+Yb4lfYXrpl7a6VmJrU8wF9I1CKvP/QwPNZHnOlwbTkY6dvtFIzFMSyQXbLoTQPRpA==",
      "dev": true,
      "dependencies": {
        "pump": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/extract-zip/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true
    },
    "node_modules/farmhash-modern": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/farmhash-modern/-/farmhash-modern-1.1.0.tgz",
      "integrity": "sha512-6ypT4XfgqJk/F3Yuv4SX26I3doUjt0GTG4a+JgWxXQpxXzTBq8fPUeGHfcYMMDPHJHm3yPOSjaeBwBGAHWXCdA==",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q=="
    },
    "node_modules/fast-json-stable-stringify": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz",
      "integrity": "sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==",
      "dev": true
    },
    "node_modules/fast-levenshtein": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz",
      "integrity": "sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==",
      "dev": true
    },
    "node_modules/fast-uri": {
      "version": "3.0.6",
      "resolved": "https://registry.npmjs.org/fast-uri/-/fast-uri-3.0.6.tgz",
      "integrity": "sha512-Atfo14OibSv5wAp4VWNsFYE1AchQRTv9cBGWET4pZWHzYshFSS9NQI6I57rdKn9croWVMbYFbLhJ+yJvmZIIHw==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fastify"
        },
        {
          "type": "opencollective",
          "url": "https://opencollective.com/fastify"
        }
      ],
      "license": "BSD-3-Clause"
    },
    "node_modules/fast-xml-parser": {
      "version": "4.5.1",
      "resolved": "https://registry.npmjs.org/fast-xml-parser/-/fast-xml-parser-4.5.1.tgz",
      "integrity": "sha512-y655CeyUQ+jj7KBbYMc4FG01V8ZQqjN+gDYGJ50RtfsUB8iG9AmwmwoAgeKLJdmueKKMrH1RJ7yXHTSoczdv5w==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/NaturalIntelligence"
        },
        {
          "type": "paypal",
          "url": "https://paypal.me/naturalintelligence"
        }
      ],
      "optional": true,
      "dependencies": {
        "strnum": "^1.0.5"
      },
      "bin": {
        "fxparser": "src/cli/cli.js"
      }
    },
    "node_modules/faye-websocket": {
      "version": "0.11.4",
      "resolved": "https://registry.npmjs.org/faye-websocket/-/faye-websocket-0.11.4.tgz",
      "integrity": "sha512-CzbClwlXAuiRQAlUyfqPgvPoNKTckTPGfwZV4ZdAhVcP2lh9KUxJg2b5GkE7XbjKQ3YJnQ9z6D9ntLAlB+tP8g==",
      "dependencies": {
        "websocket-driver": ">=0.5.1"
      },
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/fb-watchman": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/fb-watchman/-/fb-watchman-2.0.2.tgz",
      "integrity": "sha512-p5161BqbuCaSnB8jIbzQHOlpgsPmK5rJVDfDKO91Axs5NC1uu3HRQm6wt9cd9/+GtQQIO53JdGXXoyDpTAsgYA==",
      "dev": true,
      "license": "Apache-2.0",
      "peer": true,
      "dependencies": {
        "bser": "2.1.1"
      }
    },
    "node_modules/fd-slicer": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/fd-slicer/-/fd-slicer-1.1.0.tgz",
      "integrity": "sha512-cE1qsB/VwyQozZ+q1dGxR8LBYNZeofhEdUNGSMbQD3Gw2lAzX9Zb3uIU6Ebc/Fmyjo9AWWfnn0AUCHqtevs/8g==",
      "dev": true,
      "dependencies": {
        "pend": "~1.2.0"
      }
    },
    "node_modules/fecha": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/fecha/-/fecha-4.2.3.tgz",
      "integrity": "sha512-OP2IUU6HeYKJi3i0z4A19kHMQoLVs4Hc+DPqqxI2h/DPZHTm/vjsfC6P0b4jCMy14XizLBqvndQ+UilD7707Jw=="
    },
    "node_modules/fetch-blob": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/fetch-blob/-/fetch-blob-3.2.0.tgz",
      "integrity": "sha512-7yAQpD2UMJzLi1Dqv7qFYnPbaPx7ZfFK6PiIxQ4PfkGPyNyl2Ugx+a/umUonmKqjhM4DnfbMvdX6otXq83soQQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/jimmywarting"
        },
        {
          "type": "paypal",
          "url": "https://paypal.me/jimmywarting"
        }
      ],
      "dependencies": {
        "node-domexception": "^1.0.0",
        "web-streams-polyfill": "^3.0.3"
      },
      "engines": {
        "node": "^12.20 || >= 14.13"
      }
    },
    "node_modules/figures": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/figures/-/figures-3.2.0.tgz",
      "integrity": "sha512-yaduQFRKLXYOGgEn6AZau90j3ggSOyiqXU0F9JZfeXYhNa+Jk4X+s45A2zg5jns87GAFa34BBm2kXw4XpNcbdg==",
      "dev": true,
      "dependencies": {
        "escape-string-regexp": "^1.0.5"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/figures/node_modules/escape-string-regexp": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-1.0.5.tgz",
      "integrity": "sha512-vbRorB5FUQWvla16U8R/qgaFIya2qGzwDrNmCZuYKrbdSUMG6I1ZCGQRefkRVhuOkIGVne7BQ35DSfo1qvJqFg==",
      "dev": true,
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/file-entry-cache": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/file-entry-cache/-/file-entry-cache-8.0.0.tgz",
      "integrity": "sha512-XXTUwCvisa5oacNGRP9SfNtYBNAMi+RPwBFmblZEF7N7swHYQS6/Zfk7SRwx4D5j3CH211YNRco1DEMNVfZCnQ==",
      "dev": true,
      "dependencies": {
        "flat-cache": "^4.0.0"
      },
      "engines": {
        "node": ">=16.0.0"
      }
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dev": true,
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/finalhandler": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-1.3.1.tgz",
      "integrity": "sha512-6BN9trH7bp3qvnrRyzsBz+g3lZxTNZTbVO2EV1CS0WIcDbawYVdYvGflME/9QP0h0pYlCDBCTjYa9nZzMDpyxQ==",
      "dependencies": {
        "debug": "2.6.9",
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "on-finished": "2.4.1",
        "parseurl": "~1.3.3",
        "statuses": "2.0.1",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/find-up": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-4.1.0.tgz",
      "integrity": "sha512-PpOwAdQ/YlXQ2vj8a3h8IipDuYRi3wceVQQGYWxNINccq40Anw7BlsEXCMbt1Zt+OLA6Fq9suIpIWD0OsnISlw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "locate-path": "^5.0.0",
        "path-exists": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/firebase-admin": {
      "version": "12.7.0",
      "resolved": "https://registry.npmjs.org/firebase-admin/-/firebase-admin-12.7.0.tgz",
      "integrity": "sha512-raFIrOyTqREbyXsNkSHyciQLfv8AUZazehPaQS1lZBSCDYW74FYXU0nQZa3qHI4K+hawohlDbywZ4+qce9YNxA==",
      "dependencies": {
        "@fastify/busboy": "^3.0.0",
        "@firebase/database-compat": "1.0.8",
        "@firebase/database-types": "1.0.5",
        "@types/node": "^22.0.1",
        "farmhash-modern": "^1.1.0",
        "jsonwebtoken": "^9.0.0",
        "jwks-rsa": "^3.1.0",
        "node-forge": "^1.3.1",
        "uuid": "^10.0.0"
      },
      "engines": {
        "node": ">=14"
      },
      "optionalDependencies": {
        "@google-cloud/firestore": "^7.7.0",
        "@google-cloud/storage": "^7.7.0"
      }
    },
    "node_modules/firebase-functions": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/firebase-functions/-/firebase-functions-6.2.0.tgz",
      "integrity": "sha512-vfyyVHS8elxplzEQ9To+NaINRPFUsDasQrasTa2eFJBYSPzdhkw6rwLmvwyYw622+ze+g4sDIb14VZym+afqXQ==",
      "dependencies": {
        "@types/cors": "^2.8.5",
        "@types/express": "^4.17.21",
        "cors": "^2.8.5",
        "express": "^4.21.0",
        "protobufjs": "^7.2.2"
      },
      "bin": {
        "firebase-functions": "lib/bin/firebase-functions.js"
      },
      "engines": {
        "node": ">=14.10.0"
      },
      "peerDependencies": {
        "firebase-admin": "^11.10.0 || ^12.0.0 || ^13.0.0"
      }
    },
    "node_modules/firebase-functions-test": {
      "version": "3.4.0",
      "resolved": "https://registry.npmjs.org/firebase-functions-test/-/firebase-functions-test-3.4.0.tgz",
      "integrity": "sha512-ignkiegIvGtCbDZFEKerLrzrKGonCHD/VJsuNhcfz3jDfhP9yN7mJeq7AHXz8cOJaAnBnJ0WxHj3xezem2dEbw==",
      "dev": true,
      "dependencies": {
        "@types/lodash": "^4.14.104",
        "lodash": "^4.17.5",
        "ts-deepmerge": "^2.0.1"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "peerDependencies": {
        "firebase-admin": "^8.0.0 || ^9.0.0 || ^10.0.0 || ^11.0.0 || ^12.0.0 || ^13.0.0",
        "firebase-functions": ">=4.9.0",
        "jest": ">=28.0.0"
      }
    },
    "node_modules/flat-cache": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/flat-cache/-/flat-cache-4.0.1.tgz",
      "integrity": "sha512-f7ccFPK3SXFHpx15UIGyRJ/FJQctuKZ0zVuN3frBo4HnK3cay9VEW0R6yPYFHC0AgqhukPzKjq22t5DmAyqGyw==",
      "dev": true,
      "dependencies": {
        "flatted": "^3.2.9",
        "keyv": "^4.5.4"
      },
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/flatted": {
      "version": "3.3.2",
      "resolved": "https://registry.npmjs.org/flatted/-/flatted-3.3.2.tgz",
      "integrity": "sha512-AiwGJM8YcNOaobumgtng+6NHuOqC3A7MixFeDafM3X9cIUM+xUXoS5Vfgf+OihAYe20fxqNM9yPBXJzRtZ/4eA==",
      "dev": true
    },
    "node_modules/fn.name": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/fn.name/-/fn.name-1.1.0.tgz",
      "integrity": "sha512-GRnmB5gPyJpAhTQdSZTSp9uaPSvl09KoYcMQtsB9rQoOmzs9dH6ffeccH+Z+cv6P68Hu5bC6JjRh4Ah/mHSNRw=="
    },
    "node_modules/follow-redirects": {
      "version": "1.15.9",
      "resolved": "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.15.9.tgz",
      "integrity": "sha512-gew4GsXizNgdoRyqmyfMHyAmXsZDk6mHkSxZFCzW9gwlbtOW44CDtYavM+y+72qD/Vq2l550kMF52DT8fOLJqQ==",
      "dev": true,
      "funding": [
        {
          "type": "individual",
          "url": "https://github.com/sponsors/RubenVerborgh"
        }
      ],
      "engines": {
        "node": ">=4.0"
      },
      "peerDependenciesMeta": {
        "debug": {
          "optional": true
        }
      }
    },
    "node_modules/foreground-child": {
      "version": "3.3.0",
      "resolved": "https://registry.npmjs.org/foreground-child/-/foreground-child-3.3.0.tgz",
      "integrity": "sha512-Ld2g8rrAyMYFXBhEqMz8ZAHBi4J4uS1i/CxGMDnjyFWddMXLVcDp051DZfu+t7+ab7Wv6SMqpWmyFIj5UbfFvg==",
      "dev": true,
      "dependencies": {
        "cross-spawn": "^7.0.0",
        "signal-exit": "^4.0.1"
      },
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/foreground-child/node_modules/signal-exit": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-4.1.0.tgz",
      "integrity": "sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==",
      "dev": true,
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/form-data": {
      "version": "2.5.2",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-2.5.2.tgz",
      "integrity": "sha512-GgwY0PS7DbXqajuGf4OYlsrIu3zgxD6Vvql43IBhm6MahqA5SK/7mwhtNj2AdH2z35YR34ujJ7BN+3fFC3jP5Q==",
      "dependencies": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.6",
        "mime-types": "^2.1.12",
        "safe-buffer": "^5.2.1"
      },
      "engines": {
        "node": ">= 0.12"
      }
    },
    "node_modules/form-data-encoder": {
      "version": "1.7.2",
      "resolved": "https://registry.npmjs.org/form-data-encoder/-/form-data-encoder-1.7.2.tgz",
      "integrity": "sha512-qfqtYan3rxrnCk1VYaA4H+Ms9xdpPqvLZa6xmMgFvhO32x7/3J/ExcTd6qpxM0vH2GdMI+poehyBZvqfMTto8A=="
    },
    "node_modules/formdata-node": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/formdata-node/-/formdata-node-4.4.1.tgz",
      "integrity": "sha512-0iirZp3uVDjVGt9p49aTaqjk84TrglENEDuqfdlZQ1roC9CWlPk6Avf8EEnZNcAqPonwkG35x4n3ww/1THYAeQ==",
      "dependencies": {
        "node-domexception": "1.0.0",
        "web-streams-polyfill": "4.0.0-beta.3"
      },
      "engines": {
        "node": ">= 12.20"
      }
    },
    "node_modules/formdata-node/node_modules/web-streams-polyfill": {
      "version": "4.0.0-beta.3",
      "resolved": "https://registry.npmjs.org/web-streams-polyfill/-/web-streams-polyfill-4.0.0-beta.3.tgz",
      "integrity": "sha512-QW95TCTaHmsYfHDybGMwO5IJIM93I/6vTRk+daHTWFPhwh+C8Cg7j7XyKrwrj8Ib6vYXe0ocYNrmzY4xAAN6ug==",
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/formdata-polyfill": {
      "version": "4.0.10",
      "resolved": "https://registry.npmjs.org/formdata-polyfill/-/formdata-polyfill-4.0.10.tgz",
      "integrity": "sha512-buewHzMvYL29jdeQTVILecSaZKnt/RJWjoZCF5OW60Z67/GmSLBkOFM7qh1PI3zFNtJbaZL5eQu1vLfazOwj4g==",
      "dependencies": {
        "fetch-blob": "^3.1.2"
      },
      "engines": {
        "node": ">=12.20.0"
      }
    },
    "node_modules/forwarded": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
      "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fresh": {
      "version": "0.5.2",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-0.5.2.tgz",
      "integrity": "sha512-zJ2mQYM18rEFOudeV4GShTGIQ7RbzA7ozbU9I/XBpm7kqgMywgmylMwXHxZJmkVoYkna9d2pVXVXPdYTP9ej8Q==",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/from": {
      "version": "0.1.7",
      "resolved": "https://registry.npmjs.org/from/-/from-0.1.7.tgz",
      "integrity": "sha512-twe20eF1OxVxp/ML/kq2p1uc6KvFK/+vs8WjEbeKmV2He22MKm7YF2ANIt+EOqhJ5L3K/SuuPhk0hWQDjOM23g==",
      "dev": true
    },
    "node_modules/fs.realpath": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz",
      "integrity": "sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==",
      "dev": true,
      "license": "ISC",
      "peer": true
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/functional-red-black-tree": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/functional-red-black-tree/-/functional-red-black-tree-1.0.1.tgz",
      "integrity": "sha512-dsKNQNdj6xA3T+QlADDA7mOSlX0qiMINjn0cgr+eGHGsbSHzTabcIogz2+p/iqP1Xs6EP/sS2SbqH+brGTbq0g=="
    },
    "node_modules/gaxios": {
      "version": "6.7.1",
      "resolved": "https://registry.npmjs.org/gaxios/-/gaxios-6.7.1.tgz",
      "integrity": "sha512-LDODD4TMYx7XXdpwxAVRAIAuB0bzv0s+ywFonY46k126qzQHT9ygyoa9tncmOiQmmDrik65UYsEkv3lbfqQ3yQ==",
      "dependencies": {
        "extend": "^3.0.2",
        "https-proxy-agent": "^7.0.1",
        "is-stream": "^2.0.0",
        "node-fetch": "^2.6.9",
        "uuid": "^9.0.1"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/gaxios/node_modules/uuid": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-9.0.1.tgz",
      "integrity": "sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/gcp-metadata": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/gcp-metadata/-/gcp-metadata-6.1.0.tgz",
      "integrity": "sha512-Jh/AIwwgaxan+7ZUUmRLCjtchyDiqh4KjBJ5tW3plBZb5iL/BPcso8A5DlzeD9qlw0duCamnNdpFjxwaT0KyKg==",
      "dependencies": {
        "gaxios": "^6.0.0",
        "json-bigint": "^1.0.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/genkit": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/genkit/-/genkit-1.0.4.tgz",
      "integrity": "sha512-QJBvz8tJBQaqaHwBge3Hf4xoDNWJ8VVyDtKJsbCGEMwKnZa+g9Qh3LyBPx14RpPpJizZrr2j8Rvv0IocMEaj6Q==",
      "license": "Apache-2.0",
      "dependencies": {
        "@genkit-ai/ai": "1.0.4",
        "@genkit-ai/core": "1.0.4",
        "uuid": "^10.0.0"
      }
    },
    "node_modules/genkit-cli": {
      "version": "0.9.12",
      "resolved": "https://registry.npmjs.org/genkit-cli/-/genkit-cli-0.9.12.tgz",
      "integrity": "sha512-Qsk7TmVBxghTT+0cRe2j0fYJboUIfWhuUoeVbWshranye6tConGMyDEZdXBIeMWIixSbG7k8a7a2INdRdjcQJw==",
      "dev": true,
      "dependencies": {
        "@genkit-ai/telemetry-server": "0.9.12",
        "@genkit-ai/tools-common": "0.9.12",
        "axios": "^1.7.7",
        "colorette": "^2.0.20",
        "commander": "^11.1.0",
        "extract-zip": "^2.0.1",
        "get-port": "5.1.1",
        "inquirer": "^8.2.0",
        "open": "^6.3.0",
        "ora": "^5.4.1"
      },
      "bin": {
        "genkit": "dist/bin/genkit.js"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.2.7.tgz",
      "integrity": "sha512-VW6Pxhsrk0KAOqs3WEd0klDiF/+V7gQOpAvY1jVU/LHmaD/kQO4523aiJuikX/QAKYiW6x8Jh+RJej1almdtCA==",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.0",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-package-type": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/get-package-type/-/get-package-type-0.1.0.tgz",
      "integrity": "sha512-pjzuKtY64GYfWizNAJ0fr9VqttZkNiK2iS430LtIHzjBEr6bX8Am2zm4sW4Ro5wjWW5cAlRL1qAMTcXbjNAO2Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=8.0.0"
      }
    },
    "node_modules/get-port": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/get-port/-/get-port-5.1.1.tgz",
      "integrity": "sha512-g/Q1aTSDOxFpchXC4i8ZWvxA1lnPqx/JHqcpIw0/LX9T8x/GBbi6YnlN5nhaKIFkT8oFsscUKgDJYxfwfS6QsQ==",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/get-stream": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/get-stream/-/get-stream-6.0.1.tgz",
      "integrity": "sha512-ts6Wi+2j3jQjqi70w5AlN8DFnkSwC+MqmxEzdEALB2qXZYV3X/b1CTfgPLGJNMeAWxdPfU8FO1ms3NUfaHCPYg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/get-tsconfig": {
      "version": "4.10.0",
      "resolved": "https://registry.npmjs.org/get-tsconfig/-/get-tsconfig-4.10.0.tgz",
      "integrity": "sha512-kGzZ3LWWQcGIAmg6iWvXn0ei6WDtV26wzHRMwDSzmAbcXrTEXxHy6IehI6/4eT6VRKyMP1eF1VqwrVUmE/LR7A==",
      "dev": true,
      "dependencies": {
        "resolve-pkg-maps": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/privatenumber/get-tsconfig?sponsor=1"
      }
    },
    "node_modules/glob": {
      "version": "7.2.3",
      "resolved": "https://registry.npmjs.org/glob/-/glob-7.2.3.tgz",
      "integrity": "sha512-nFR0zLpU2YCaRxwoCJvL6UvCH2JFyFVIvwTLsIf21AuHlMskA1hhTdk+LlYJtOlYt9v6dvszD2BGRqBL+iQK9Q==",
      "deprecated": "Glob versions prior to v9 are no longer supported",
      "dev": true,
      "license": "ISC",
      "peer": true,
      "dependencies": {
        "fs.realpath": "^1.0.0",
        "inflight": "^1.0.4",
        "inherits": "2",
        "minimatch": "^3.1.1",
        "once": "^1.3.0",
        "path-is-absolute": "^1.0.0"
      },
      "engines": {
        "node": "*"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/globals": {
      "version": "11.12.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-11.12.0.tgz",
      "integrity": "sha512-WOBp/EEGUiIsJSp7wcv/y6MO+lV9UoncWqxuFfm8eBwzWNgyfBd6Gz+IeKQ9jCmyhoH99g15M3T+QaVHFjizVA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/google-auth-library": {
      "version": "9.15.1",
      "resolved": "https://registry.npmjs.org/google-auth-library/-/google-auth-library-9.15.1.tgz",
      "integrity": "sha512-Jb6Z0+nvECVz+2lzSMt9u98UsoakXxA2HGHMCxh+so3n90XgYWkq5dur19JAJV7ONiJY22yBTyJB1TSkvPq9Ng==",
      "dependencies": {
        "base64-js": "^1.3.0",
        "ecdsa-sig-formatter": "^1.0.11",
        "gaxios": "^6.1.1",
        "gcp-metadata": "^6.1.0",
        "gtoken": "^7.0.0",
        "jws": "^4.0.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/google-gax": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/google-gax/-/google-gax-4.4.1.tgz",
      "integrity": "sha512-Phyp9fMfA00J3sZbJxbbB4jC55b7DBjE3F6poyL3wKMEBVKA79q6BGuHcTiM28yOzVql0NDbRL8MLLh8Iwk9Dg==",
      "dependencies": {
        "@grpc/grpc-js": "^1.10.9",
        "@grpc/proto-loader": "^0.7.13",
        "@types/long": "^4.0.0",
        "abort-controller": "^3.0.0",
        "duplexify": "^4.0.0",
        "google-auth-library": "^9.3.0",
        "node-fetch": "^2.7.0",
        "object-hash": "^3.0.0",
        "proto3-json-serializer": "^2.0.2",
        "protobufjs": "^7.3.2",
        "retry-request": "^7.0.0",
        "uuid": "^9.0.1"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/google-gax/node_modules/uuid": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-9.0.1.tgz",
      "integrity": "sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/googleapis": {
      "version": "140.0.1",
      "resolved": "https://registry.npmjs.org/googleapis/-/googleapis-140.0.1.tgz",
      "integrity": "sha512-ZGvBX4mQcFXO9ACnVNg6Aqy3KtBPB5zTuue43YVLxwn8HSv8jB7w+uDKoIPSoWuxGROgnj2kbng6acXncOQRNA==",
      "dependencies": {
        "google-auth-library": "^9.0.0",
        "googleapis-common": "^7.0.0"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/googleapis-common": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/googleapis-common/-/googleapis-common-7.2.0.tgz",
      "integrity": "sha512-/fhDZEJZvOV3X5jmD+fKxMqma5q2Q9nZNSF3kn1F18tpxmA86BcTxAGBQdM0N89Z3bEaIs+HVznSmFJEAmMTjA==",
      "dependencies": {
        "extend": "^3.0.2",
        "gaxios": "^6.0.3",
        "google-auth-library": "^9.7.0",
        "qs": "^6.7.0",
        "url-template": "^2.0.8",
        "uuid": "^9.0.0"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/googleapis-common/node_modules/uuid": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-9.0.1.tgz",
      "integrity": "sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.11",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
      "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
      "dev": true
    },
    "node_modules/gtoken": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/gtoken/-/gtoken-7.1.0.tgz",
      "integrity": "sha512-pCcEwRi+TKpMlxAQObHDQ56KawURgyAf6jtIY046fJ5tIv3zDe/LEIubckAO8fj6JnAxLdmWkUfNyulQ2iKdEw==",
      "dependencies": {
        "gaxios": "^6.0.0",
        "jws": "^4.0.0"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/handlebars": {
      "version": "4.7.8",
      "resolved": "https://registry.npmjs.org/handlebars/-/handlebars-4.7.8.tgz",
      "integrity": "sha512-vafaFqs8MZkRrSX7sFVUdo3ap/eNiLnb4IakshzvP56X5Nr1iGKAIqdX6tMlm6HcNRIkr6AxO5jFEoJzzpT8aQ==",
      "license": "MIT",
      "dependencies": {
        "minimist": "^1.2.5",
        "neo-async": "^2.6.2",
        "source-map": "^0.6.1",
        "wordwrap": "^1.0.0"
      },
      "bin": {
        "handlebars": "bin/handlebars"
      },
      "engines": {
        "node": ">=0.4.7"
      },
      "optionalDependencies": {
        "uglify-js": "^3.1.4"
      }
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
      "integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/html-entities": {
      "version": "2.5.2",
      "resolved": "https://registry.npmjs.org/html-entities/-/html-entities-2.5.2.tgz",
      "integrity": "sha512-K//PSRMQk4FZ78Kyau+mZurHn3FH0Vwr+H36eE0rPbeYkRRi9YxceYPhuN60UwWorxyKHhqoAJl2OFKa4BVtaA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/mdevils"
        },
        {
          "type": "patreon",
          "url": "https://patreon.com/mdevils"
        }
      ]
    },
    "node_modules/html-escaper": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/html-escaper/-/html-escaper-2.0.2.tgz",
      "integrity": "sha512-H2iMtd0I4Mt5eYiapRdIDjp+XzelXQ0tFE4JS7YFwFevXXMmOp9myNrUvCg0D6ws8iqkRPBfKHgbwig1SmlLfg==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/http-errors": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.0.tgz",
      "integrity": "sha512-FtwrG/euBzaEjYeRqOgly7G0qviiXoJWnvEH2Z1plBdXgbyjv34pHTSb9zoeHMyDy33+DWy5Wt9Wo+TURtOYSQ==",
      "dependencies": {
        "depd": "2.0.0",
        "inherits": "2.0.4",
        "setprototypeof": "1.2.0",
        "statuses": "2.0.1",
        "toidentifier": "1.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/http-parser-js": {
      "version": "0.5.9",
      "resolved": "https://registry.npmjs.org/http-parser-js/-/http-parser-js-0.5.9.tgz",
      "integrity": "sha512-n1XsPy3rXVxlqxVioEWdC+0+M+SQw0DpJynwtOPo1X+ZlvdzTLtDBIJJlDQTnwZIFJrZSzSGmIOUdP8tu+SgLw=="
    },
    "node_modules/http-proxy-agent": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/http-proxy-agent/-/http-proxy-agent-5.0.0.tgz",
      "integrity": "sha512-n2hY8YdoRE1i7r6M0w9DIw5GgZN0G25P8zLCRQ8rjXtTU3vsNFBI/vWK/UIeE6g5MUUz6avwAPXmL6Fy9D/90w==",
      "dependencies": {
        "@tootallnate/once": "2",
        "agent-base": "6",
        "debug": "4"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/http-proxy-agent/node_modules/agent-base": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-6.0.2.tgz",
      "integrity": "sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==",
      "dependencies": {
        "debug": "4"
      },
      "engines": {
        "node": ">= 6.0.0"
      }
    },
    "node_modules/http-proxy-agent/node_modules/debug": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.0.tgz",
      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/http-proxy-agent/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="
    },
    "node_modules/https-proxy-agent": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-7.0.6.tgz",
      "integrity": "sha512-vK9P5/iUfdl95AI+JVyUuIcVtd4ofvtrOr3HNtM2yxC9bnMbEdp3x01OhQNnjb8IJYi38VlTE3mBXwcfvywuSw==",
      "dependencies": {
        "agent-base": "^7.1.2",
        "debug": "4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/https-proxy-agent/node_modules/debug": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.0.tgz",
      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/https-proxy-agent/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="
    },
    "node_modules/human-signals": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/human-signals/-/human-signals-2.1.0.tgz",
      "integrity": "sha512-B4FFZ6q/T2jhhksgkbEW3HBvWIfDW85snkQgawt07S7J5QXTk6BkNV+0yAeZrM5QpMAdYlocGoljn0sJ/WQkFw==",
      "dev": true,
      "license": "Apache-2.0",
      "peer": true,
      "engines": {
        "node": ">=10.17.0"
      }
    },
    "node_modules/humanize-ms": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/humanize-ms/-/humanize-ms-1.2.1.tgz",
      "integrity": "sha512-Fl70vYtsAFb/C06PTS9dZBo7ihau+Tu/DNCk/OyHhea07S+aeMWpFFkUaXRa8fI+ScZbEI8dfSxwY7gxZ9SAVQ==",
      "dependencies": {
        "ms": "^2.0.0"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.4.24",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.4.24.tgz",
      "integrity": "sha512-v3MXnZAcvnywkTUEZomIActle7RXXeedOR31wwl7VlyoXO4Qi9arvSenNQWne1TcRwhCL1HwLI21bEqdpj8/rA==",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/ieee754": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/ieee754/-/ieee754-1.2.1.tgz",
      "integrity": "sha512-dcyqhDvX1C46lXZcVqCpK+FtMRQVdIMN6/Df5js2zouUsqG7I6sFxitIC+7KYK29KdXOLHdu9zL4sFnoVQnqaA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ]
    },
    "node_modules/ignore": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.3.2.tgz",
      "integrity": "sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==",
      "dev": true,
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/import-fresh": {
      "version": "3.3.0",
      "resolved": "https://registry.npmjs.org/import-fresh/-/import-fresh-3.3.0.tgz",
      "integrity": "sha512-veYYhQa+D1QBKznvhUHxb8faxlrwUnxseDAbAp457E0wLNio2bOSKnjYDhMj+YiAq61xrMGhQk9iXVk5FzgQMw==",
      "dev": true,
      "dependencies": {
        "parent-module": "^1.0.0",
        "resolve-from": "^4.0.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/import-fresh/node_modules/resolve-from": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-4.0.0.tgz",
      "integrity": "sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/import-in-the-middle": {
      "version": "1.12.0",
      "resolved": "https://registry.npmjs.org/import-in-the-middle/-/import-in-the-middle-1.12.0.tgz",
      "integrity": "sha512-yAgSE7GmtRcu4ZUSFX/4v69UGXwugFFSdIQJ14LHPOPPQrWv8Y7O9PHsw8Ovk7bKCLe4sjXMbZFqGFcLHpZ89w==",
      "dependencies": {
        "acorn": "^8.8.2",
        "acorn-import-attributes": "^1.9.5",
        "cjs-module-lexer": "^1.2.2",
        "module-details-from-path": "^1.0.3"
      }
    },
    "node_modules/import-local": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/import-local/-/import-local-3.2.0.tgz",
      "integrity": "sha512-2SPlun1JUPWoM6t3F0dw0FkCF/jWY8kttcY4f599GLTSjh2OCuuhdTkJQsEcZzBqbXZGKMK2OqW1oZsjtf/gQA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "pkg-dir": "^4.2.0",
        "resolve-cwd": "^3.0.0"
      },
      "bin": {
        "import-local-fixture": "fixtures/cli.js"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/imurmurhash": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz",
      "integrity": "sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==",
      "dev": true,
      "engines": {
        "node": ">=0.8.19"
      }
    },
    "node_modules/inflight": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/inflight/-/inflight-1.0.6.tgz",
      "integrity": "sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==",
      "deprecated": "This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.",
      "dev": true,
      "license": "ISC",
      "peer": true,
      "dependencies": {
        "once": "^1.3.0",
        "wrappy": "1"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ=="
    },
    "node_modules/inquirer": {
      "version": "8.2.6",
      "resolved": "https://registry.npmjs.org/inquirer/-/inquirer-8.2.6.tgz",
      "integrity": "sha512-M1WuAmb7pn9zdFRtQYk26ZBoY043Sse0wVDdk4Bppr+JOXyQYybdtvK+l9wUibhtjdjvtoiNy8tk+EgsYIUqKg==",
      "dev": true,
      "dependencies": {
        "ansi-escapes": "^4.2.1",
        "chalk": "^4.1.1",
        "cli-cursor": "^3.1.0",
        "cli-width": "^3.0.0",
        "external-editor": "^3.0.3",
        "figures": "^3.0.0",
        "lodash": "^4.17.21",
        "mute-stream": "0.0.8",
        "ora": "^5.4.1",
        "run-async": "^2.4.0",
        "rxjs": "^7.5.5",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0",
        "through": "^2.3.6",
        "wrap-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=12.0.0"
      }
    },
    "node_modules/inquirer/node_modules/wrap-ansi": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-6.2.0.tgz",
      "integrity": "sha512-r6lPcBGxZXlIcymEu7InxDMhdW0KDxpLgoFLcguasxCaJ/SOIZwINatK9KY/tf+ZrlywOKU0UDj3ATXUBfxJXA==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/ipaddr.js": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
      "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/is": {
      "version": "3.3.0",
      "resolved": "https://registry.npmjs.org/is/-/is-3.3.0.tgz",
      "integrity": "sha512-nW24QBoPcFGGHJGUwnfpI7Yc5CdqWNdsyHQszVE/z2pKHXzh7FZ5GWhJqSyaQ9wMkQnsTx+kAI8bHlCX4tKdbg==",
      "optional": true,
      "engines": {
        "node": "*"
      }
    },
    "node_modules/is-arrayish": {
      "version": "0.2.1",
      "resolved": "https://registry.npmjs.org/is-arrayish/-/is-arrayish-0.2.1.tgz",
      "integrity": "sha512-zz06S8t0ozoDXMG+ube26zeCTNXcKIPJZJi8hBrF4idCLms4CG9QtK7qBl1boi5ODzFpjswb5JPmHCbMpjaYzg==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/is-binary-path": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-2.1.0.tgz",
      "integrity": "sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==",
      "dev": true,
      "dependencies": {
        "binary-extensions": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.16.1",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.1.tgz",
      "integrity": "sha512-UfoeMA6fIJ8wTYFEUjelnaGI67v6+N7qXJEvQuIGa99l4xsCruSYOVSQ0uPANn4dAzm8lkYPaKLrrijLq7x23w==",
      "dependencies": {
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz",
      "integrity": "sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-generator-fn": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-generator-fn/-/is-generator-fn-2.1.0.tgz",
      "integrity": "sha512-cTIB4yPYL/Grw0EaSzASzg6bBy9gqCofvWN8okThAYIxKJZC+udlRAmGbM0XLeniEJSs8uEgHPGuHSe1XsOLSQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dev": true,
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-interactive": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-interactive/-/is-interactive-1.0.0.tgz",
      "integrity": "sha512-2HvIEKRoqS62guEC+qBjpvRubdX910WCMuJTZ+I9yvqKU2/12eSL549HMwtabb4oupdj2sMP50k+XJfB/8JE6w==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "dev": true,
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/is-obj": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/is-obj/-/is-obj-2.0.0.tgz",
      "integrity": "sha512-drqDG3cbczxxEJRoOXcOjtdp1J/lyp1mNn0xaznRs8+muBhgQcrnbspox5X5fOw0HnMnbfDzvnEMEtqDEJEo8w==",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-stream": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-stream/-/is-stream-2.0.1.tgz",
      "integrity": "sha512-hFoiJiTl63nn+kstHGBtewWSKnQLpyb155KHheA1l39uvtO9nWIop1p3udqPcUd/xbF1VLMO4n7OI6p7RbngDg==",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-typedarray": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-typedarray/-/is-typedarray-1.0.0.tgz",
      "integrity": "sha512-cyA56iCMHAh5CdzjJIa4aohJyeO1YbwLi3Jc35MmRU6poroFjIGZzUzupGiRPOjgHg9TLu43xbpwXk523fMxKA==",
      "dev": true
    },
    "node_modules/is-unicode-supported": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/is-unicode-supported/-/is-unicode-supported-0.1.0.tgz",
      "integrity": "sha512-knxG2q4UC3u8stRGyAVJCOdxFmv5DZiRcdlIaAQXAbSfJya+OhopNotLQrstBhququ4ZpuKbDc/8S6mgXgPFPw==",
      "dev": true,
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-wsl": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-wsl/-/is-wsl-1.1.0.tgz",
      "integrity": "sha512-gfygJYZ2gLTDlmbWMI0CE2MwnFzSN/2SZfkMlItC4K/JBlsWVDB0bO6XhqcY13YXE7iMcAJnzTCJjPiTeJJ0Mw==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "dev": true
    },
    "node_modules/istanbul-lib-coverage": {
      "version": "3.2.2",
      "resolved": "https://registry.npmjs.org/istanbul-lib-coverage/-/istanbul-lib-coverage-3.2.2.tgz",
      "integrity": "sha512-O8dpsF+r0WV/8MNRKfnmrtCWhuKjxrq2w+jpzBL5UZKTi2LeVWnWOmWRxFlesJONmc+wLAGvKQZEOanko0LFTg==",
      "dev": true,
      "license": "BSD-3-Clause",
      "peer": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/istanbul-lib-instrument": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/istanbul-lib-instrument/-/istanbul-lib-instrument-6.0.3.tgz",
      "integrity": "sha512-Vtgk7L/R2JHyyGW07spoFlB8/lpjiOLTjMdms6AFMraYt3BaJauod/NGrfnVG/y4Ix1JEuMRPDPEj2ua+zz1/Q==",
      "dev": true,
      "license": "BSD-3-Clause",
      "peer": true,
      "dependencies": {
        "@babel/core": "^7.23.9",
        "@babel/parser": "^7.23.9",
        "@istanbuljs/schema": "^0.1.3",
        "istanbul-lib-coverage": "^3.2.0",
        "semver": "^7.5.4"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/istanbul-lib-instrument/node_modules/semver": {
      "version": "7.7.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.1.tgz",
      "integrity": "sha512-hlq8tAfn0m/61p4BVRcPzIGr6LKiMwo4VM6dGi6pt4qcRkmNzTcWq6eCEjEh+qXjkMDvPlOFFSGwQjoEa6gyMA==",
      "dev": true,
      "license": "ISC",
      "peer": true,
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/istanbul-lib-report": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/istanbul-lib-report/-/istanbul-lib-report-3.0.1.tgz",
      "integrity": "sha512-GCfE1mtsHGOELCU8e/Z7YWzpmybrx/+dSTfLrvY8qRmaY6zXTKWn6WQIjaAFw069icm6GVMNkgu0NzI4iPZUNw==",
      "dev": true,
      "license": "BSD-3-Clause",
      "peer": true,
      "dependencies": {
        "istanbul-lib-coverage": "^3.0.0",
        "make-dir": "^4.0.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/istanbul-lib-source-maps": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/istanbul-lib-source-maps/-/istanbul-lib-source-maps-4.0.1.tgz",
      "integrity": "sha512-n3s8EwkdFIJCG3BPKBYvskgXGoy88ARzvegkitk60NxRdwltLOTaH7CUiMRXvwYorl0Q712iEjcWB+fK/MrWVw==",
      "dev": true,
      "license": "BSD-3-Clause",
      "peer": true,
      "dependencies": {
        "debug": "^4.1.1",
        "istanbul-lib-coverage": "^3.0.0",
        "source-map": "^0.6.1"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/istanbul-lib-source-maps/node_modules/debug": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.0.tgz",
      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/istanbul-lib-source-maps/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/istanbul-reports": {
      "version": "3.1.7",
      "resolved": "https://registry.npmjs.org/istanbul-reports/-/istanbul-reports-3.1.7.tgz",
      "integrity": "sha512-BewmUXImeuRk2YY0PVbxgKAysvhRPUQE0h5QRM++nVWyubKGV0l8qQ5op8+B2DOmwSe63Jivj0BjkPQVf8fP5g==",
      "dev": true,
      "license": "BSD-3-Clause",
      "peer": true,
      "dependencies": {
        "html-escaper": "^2.0.0",
        "istanbul-lib-report": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/jackspeak": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/jackspeak/-/jackspeak-3.4.3.tgz",
      "integrity": "sha512-OGlZQpz2yfahA/Rd1Y8Cd9SIEsqvXkLVoSw/cgwhnhFMDbsQFeZYoJJ7bIZBS9BcamUW96asq/npPWugM+RQBw==",
      "dev": true,
      "dependencies": {
        "@isaacs/cliui": "^8.0.2"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      },
      "optionalDependencies": {
        "@pkgjs/parseargs": "^0.11.0"
      }
    },
    "node_modules/jest": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest/-/jest-29.7.0.tgz",
      "integrity": "sha512-NIy3oAFp9shda19hy4HK0HRTWKtPJmGdnvywu01nOqNC2vZg+Z+fvJDxpMQA88eb2I9EcafcdjYgsDthnYTvGw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/core": "^29.7.0",
        "@jest/types": "^29.6.3",
        "import-local": "^3.0.2",
        "jest-cli": "^29.7.0"
      },
      "bin": {
        "jest": "bin/jest.js"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      },
      "peerDependencies": {
        "node-notifier": "^8.0.1 || ^9.0.0 || ^10.0.0"
      },
      "peerDependenciesMeta": {
        "node-notifier": {
          "optional": true
        }
      }
    },
    "node_modules/jest-changed-files": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-changed-files/-/jest-changed-files-29.7.0.tgz",
      "integrity": "sha512-fEArFiwf1BpQ+4bXSprcDc3/x4HSzL4al2tozwVpDFpsxALjLYdyiIK4e5Vz66GQJIbXJ82+35PtysofptNX2w==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "execa": "^5.0.0",
        "jest-util": "^29.7.0",
        "p-limit": "^3.1.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-circus": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-circus/-/jest-circus-29.7.0.tgz",
      "integrity": "sha512-3E1nCMgipcTkCocFwM90XXQab9bS+GMsjdpmPrlelaxwD93Ad8iVEjX/vvHPdLPnFf+L40u+5+iutRdA1N9myw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/environment": "^29.7.0",
        "@jest/expect": "^29.7.0",
        "@jest/test-result": "^29.7.0",
        "@jest/types": "^29.6.3",
        "@types/node": "*",
        "chalk": "^4.0.0",
        "co": "^4.6.0",
        "dedent": "^1.0.0",
        "is-generator-fn": "^2.0.0",
        "jest-each": "^29.7.0",
        "jest-matcher-utils": "^29.7.0",
        "jest-message-util": "^29.7.0",
        "jest-runtime": "^29.7.0",
        "jest-snapshot": "^29.7.0",
        "jest-util": "^29.7.0",
        "p-limit": "^3.1.0",
        "pretty-format": "^29.7.0",
        "pure-rand": "^6.0.0",
        "slash": "^3.0.0",
        "stack-utils": "^2.0.3"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-cli": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-cli/-/jest-cli-29.7.0.tgz",
      "integrity": "sha512-OVVobw2IubN/GSYsxETi+gOe7Ka59EFMR/twOU3Jb2GnKKeMGJB5SGUUrEz3SFVmJASUdZUzy83sLNNQ2gZslg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/core": "^29.7.0",
        "@jest/test-result": "^29.7.0",
        "@jest/types": "^29.6.3",
        "chalk": "^4.0.0",
        "create-jest": "^29.7.0",
        "exit": "^0.1.2",
        "import-local": "^3.0.2",
        "jest-config": "^29.7.0",
        "jest-util": "^29.7.0",
        "jest-validate": "^29.7.0",
        "yargs": "^17.3.1"
      },
      "bin": {
        "jest": "bin/jest.js"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      },
      "peerDependencies": {
        "node-notifier": "^8.0.1 || ^9.0.0 || ^10.0.0"
      },
      "peerDependenciesMeta": {
        "node-notifier": {
          "optional": true
        }
      }
    },
    "node_modules/jest-config": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-config/-/jest-config-29.7.0.tgz",
      "integrity": "sha512-uXbpfeQ7R6TZBqI3/TxCU4q4ttk3u0PJeC+E0zbfSoSjq6bJ7buBPxzQPL0ifrkY4DNu4JUdk0ImlBUYi840eQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/core": "^7.11.6",
        "@jest/test-sequencer": "^29.7.0",
        "@jest/types": "^29.6.3",
        "babel-jest": "^29.7.0",
        "chalk": "^4.0.0",
        "ci-info": "^3.2.0",
        "deepmerge": "^4.2.2",
        "glob": "^7.1.3",
        "graceful-fs": "^4.2.9",
        "jest-circus": "^29.7.0",
        "jest-environment-node": "^29.7.0",
        "jest-get-type": "^29.6.3",
        "jest-regex-util": "^29.6.3",
        "jest-resolve": "^29.7.0",
        "jest-runner": "^29.7.0",
        "jest-util": "^29.7.0",
        "jest-validate": "^29.7.0",
        "micromatch": "^4.0.4",
        "parse-json": "^5.2.0",
        "pretty-format": "^29.7.0",
        "slash": "^3.0.0",
        "strip-json-comments": "^3.1.1"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      },
      "peerDependencies": {
        "@types/node": "*",
        "ts-node": ">=9.0.0"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "ts-node": {
          "optional": true
        }
      }
    },
    "node_modules/jest-diff": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-diff/-/jest-diff-29.7.0.tgz",
      "integrity": "sha512-LMIgiIrhigmPrs03JHpxUh2yISK3vLFPkAodPeo0+BuF7wA2FoQbkEg1u8gBYBThncu7e1oEDUfIXVuTqLRUjw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "chalk": "^4.0.0",
        "diff-sequences": "^29.6.3",
        "jest-get-type": "^29.6.3",
        "pretty-format": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-docblock": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-docblock/-/jest-docblock-29.7.0.tgz",
      "integrity": "sha512-q617Auw3A612guyaFgsbFeYpNP5t2aoUNLwBUbc/0kD1R4t9ixDbyFTHd1nok4epoVFpr7PmeWHrhvuV3XaJ4g==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "detect-newline": "^3.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-each": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-each/-/jest-each-29.7.0.tgz",
      "integrity": "sha512-gns+Er14+ZrEoC5fhOfYCY1LOHHr0TI+rQUHZS8Ttw2l7gl+80eHc/gFf2Ktkw0+SIACDTeWvpFcv3B04VembQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/types": "^29.6.3",
        "chalk": "^4.0.0",
        "jest-get-type": "^29.6.3",
        "jest-util": "^29.7.0",
        "pretty-format": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-environment-node": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-environment-node/-/jest-environment-node-29.7.0.tgz",
      "integrity": "sha512-DOSwCRqXirTOyheM+4d5YZOrWcdu0LNZ87ewUoywbcb2XR4wKgqiG8vNeYwhjFMbEkfju7wx2GYH0P2gevGvFw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/environment": "^29.7.0",
        "@jest/fake-timers": "^29.7.0",
        "@jest/types": "^29.6.3",
        "@types/node": "*",
        "jest-mock": "^29.7.0",
        "jest-util": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-get-type": {
      "version": "29.6.3",
      "resolved": "https://registry.npmjs.org/jest-get-type/-/jest-get-type-29.6.3.tgz",
      "integrity": "sha512-zrteXnqYxfQh7l5FHyL38jL39di8H8rHoecLH3JNxH3BwOrBsNeabdap5e0I23lD4HHI8W5VFBZqG4Eaq5LNcw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-haste-map": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-haste-map/-/jest-haste-map-29.7.0.tgz",
      "integrity": "sha512-fP8u2pyfqx0K1rGn1R9pyE0/KTn+G7PxktWidOBTqFPLYX0b9ksaMFkhK5vrS3DVun09pckLdlx90QthlW7AmA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/types": "^29.6.3",
        "@types/graceful-fs": "^4.1.3",
        "@types/node": "*",
        "anymatch": "^3.0.3",
        "fb-watchman": "^2.0.0",
        "graceful-fs": "^4.2.9",
        "jest-regex-util": "^29.6.3",
        "jest-util": "^29.7.0",
        "jest-worker": "^29.7.0",
        "micromatch": "^4.0.4",
        "walker": "^1.0.8"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      },
      "optionalDependencies": {
        "fsevents": "^2.3.2"
      }
    },
    "node_modules/jest-leak-detector": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-leak-detector/-/jest-leak-detector-29.7.0.tgz",
      "integrity": "sha512-kYA8IJcSYtST2BY9I+SMC32nDpBT3J2NvWJx8+JCuCdl/CR1I4EKUJROiP8XtCcxqgTTBGJNdbB1A8XRKbTetw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "jest-get-type": "^29.6.3",
        "pretty-format": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-matcher-utils": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-matcher-utils/-/jest-matcher-utils-29.7.0.tgz",
      "integrity": "sha512-sBkD+Xi9DtcChsI3L3u0+N0opgPYnCRPtGcQYrgXmR+hmt/fYfWAL0xRXYU8eWOdfuLgBe0YCW3AFtnRLagq/g==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "chalk": "^4.0.0",
        "jest-diff": "^29.7.0",
        "jest-get-type": "^29.6.3",
        "pretty-format": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-message-util": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-message-util/-/jest-message-util-29.7.0.tgz",
      "integrity": "sha512-GBEV4GRADeP+qtB2+6u61stea8mGcOT4mCtrYISZwfu9/ISHFJ/5zOMXYbpBE9RsS5+Gb63DW4FgmnKJ79Kf6w==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/code-frame": "^7.12.13",
        "@jest/types": "^29.6.3",
        "@types/stack-utils": "^2.0.0",
        "chalk": "^4.0.0",
        "graceful-fs": "^4.2.9",
        "micromatch": "^4.0.4",
        "pretty-format": "^29.7.0",
        "slash": "^3.0.0",
        "stack-utils": "^2.0.3"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-mock": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-mock/-/jest-mock-29.7.0.tgz",
      "integrity": "sha512-ITOMZn+UkYS4ZFh83xYAOzWStloNzJFO2s8DWrE4lhtGD+AorgnbkiKERe4wQVBydIGPx059g6riW5Btp6Llnw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/types": "^29.6.3",
        "@types/node": "*",
        "jest-util": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-pnp-resolver": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/jest-pnp-resolver/-/jest-pnp-resolver-1.2.3.tgz",
      "integrity": "sha512-+3NpwQEnRoIBtx4fyhblQDPgJI0H1IEIkX7ShLUjPGA7TtUTvI1oiKi3SR4oBR0hQhQR80l4WAe5RrXBwWMA8w==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6"
      },
      "peerDependencies": {
        "jest-resolve": "*"
      },
      "peerDependenciesMeta": {
        "jest-resolve": {
          "optional": true
        }
      }
    },
    "node_modules/jest-regex-util": {
      "version": "29.6.3",
      "resolved": "https://registry.npmjs.org/jest-regex-util/-/jest-regex-util-29.6.3.tgz",
      "integrity": "sha512-KJJBsRCyyLNWCNBOvZyRDnAIfUiRJ8v+hOBQYGn8gDyF3UegwiP4gwRR3/SDa42g1YbVycTidUF3rKjyLFDWbg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-resolve": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-resolve/-/jest-resolve-29.7.0.tgz",
      "integrity": "sha512-IOVhZSrg+UvVAshDSDtHyFCCBUl/Q3AAJv8iZ6ZjnZ74xzvwuzLXid9IIIPgTnY62SJjfuupMKZsZQRsCvxEgA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "chalk": "^4.0.0",
        "graceful-fs": "^4.2.9",
        "jest-haste-map": "^29.7.0",
        "jest-pnp-resolver": "^1.2.2",
        "jest-util": "^29.7.0",
        "jest-validate": "^29.7.0",
        "resolve": "^1.20.0",
        "resolve.exports": "^2.0.0",
        "slash": "^3.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-resolve-dependencies": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-resolve-dependencies/-/jest-resolve-dependencies-29.7.0.tgz",
      "integrity": "sha512-un0zD/6qxJ+S0et7WxeI3H5XSe9lTBBR7bOHCHXkKR6luG5mwDDlIzVQ0V5cZCuoTgEdcdwzTghYkTWfubi+nA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "jest-regex-util": "^29.6.3",
        "jest-snapshot": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-runner": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-runner/-/jest-runner-29.7.0.tgz",
      "integrity": "sha512-fsc4N6cPCAahybGBfTRcq5wFR6fpLznMg47sY5aDpsoejOcVYFb07AHuSnR0liMcPTgBsA3ZJL6kFOjPdoNipQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/console": "^29.7.0",
        "@jest/environment": "^29.7.0",
        "@jest/test-result": "^29.7.0",
        "@jest/transform": "^29.7.0",
        "@jest/types": "^29.6.3",
        "@types/node": "*",
        "chalk": "^4.0.0",
        "emittery": "^0.13.1",
        "graceful-fs": "^4.2.9",
        "jest-docblock": "^29.7.0",
        "jest-environment-node": "^29.7.0",
        "jest-haste-map": "^29.7.0",
        "jest-leak-detector": "^29.7.0",
        "jest-message-util": "^29.7.0",
        "jest-resolve": "^29.7.0",
        "jest-runtime": "^29.7.0",
        "jest-util": "^29.7.0",
        "jest-watcher": "^29.7.0",
        "jest-worker": "^29.7.0",
        "p-limit": "^3.1.0",
        "source-map-support": "0.5.13"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-runtime": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-runtime/-/jest-runtime-29.7.0.tgz",
      "integrity": "sha512-gUnLjgwdGqW7B4LvOIkbKs9WGbn+QLqRQQ9juC6HndeDiezIwhDP+mhMwHWCEcfQ5RUXa6OPnFF8BJh5xegwwQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/environment": "^29.7.0",
        "@jest/fake-timers": "^29.7.0",
        "@jest/globals": "^29.7.0",
        "@jest/source-map": "^29.6.3",
        "@jest/test-result": "^29.7.0",
        "@jest/transform": "^29.7.0",
        "@jest/types": "^29.6.3",
        "@types/node": "*",
        "chalk": "^4.0.0",
        "cjs-module-lexer": "^1.0.0",
        "collect-v8-coverage": "^1.0.0",
        "glob": "^7.1.3",
        "graceful-fs": "^4.2.9",
        "jest-haste-map": "^29.7.0",
        "jest-message-util": "^29.7.0",
        "jest-mock": "^29.7.0",
        "jest-regex-util": "^29.6.3",
        "jest-resolve": "^29.7.0",
        "jest-snapshot": "^29.7.0",
        "jest-util": "^29.7.0",
        "slash": "^3.0.0",
        "strip-bom": "^4.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-snapshot": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-snapshot/-/jest-snapshot-29.7.0.tgz",
      "integrity": "sha512-Rm0BMWtxBcioHr1/OX5YCP8Uov4riHvKPknOGs804Zg9JGZgmIBkbtlxJC/7Z4msKYVbIJtfU+tKb8xlYNfdkw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/core": "^7.11.6",
        "@babel/generator": "^7.7.2",
        "@babel/plugin-syntax-jsx": "^7.7.2",
        "@babel/plugin-syntax-typescript": "^7.7.2",
        "@babel/types": "^7.3.3",
        "@jest/expect-utils": "^29.7.0",
        "@jest/transform": "^29.7.0",
        "@jest/types": "^29.6.3",
        "babel-preset-current-node-syntax": "^1.0.0",
        "chalk": "^4.0.0",
        "expect": "^29.7.0",
        "graceful-fs": "^4.2.9",
        "jest-diff": "^29.7.0",
        "jest-get-type": "^29.6.3",
        "jest-matcher-utils": "^29.7.0",
        "jest-message-util": "^29.7.0",
        "jest-util": "^29.7.0",
        "natural-compare": "^1.4.0",
        "pretty-format": "^29.7.0",
        "semver": "^7.5.3"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-snapshot/node_modules/semver": {
      "version": "7.7.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.1.tgz",
      "integrity": "sha512-hlq8tAfn0m/61p4BVRcPzIGr6LKiMwo4VM6dGi6pt4qcRkmNzTcWq6eCEjEh+qXjkMDvPlOFFSGwQjoEa6gyMA==",
      "dev": true,
      "license": "ISC",
      "peer": true,
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/jest-util": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-util/-/jest-util-29.7.0.tgz",
      "integrity": "sha512-z6EbKajIpqGKU56y5KBUgy1dt1ihhQJgWzUlZHArA/+X2ad7Cb5iF+AK1EWVL/Bo7Rz9uurpqw6SiBCefUbCGA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/types": "^29.6.3",
        "@types/node": "*",
        "chalk": "^4.0.0",
        "ci-info": "^3.2.0",
        "graceful-fs": "^4.2.9",
        "picomatch": "^2.2.3"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-validate": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-validate/-/jest-validate-29.7.0.tgz",
      "integrity": "sha512-ZB7wHqaRGVw/9hST/OuFUReG7M8vKeq0/J2egIGLdvjHCmYqGARhzXmtgi+gVeZ5uXFF219aOc3Ls2yLg27tkw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/types": "^29.6.3",
        "camelcase": "^6.2.0",
        "chalk": "^4.0.0",
        "jest-get-type": "^29.6.3",
        "leven": "^3.1.0",
        "pretty-format": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-validate/node_modules/camelcase": {
      "version": "6.3.0",
      "resolved": "https://registry.npmjs.org/camelcase/-/camelcase-6.3.0.tgz",
      "integrity": "sha512-Gmy6FhYlCY7uOElZUSbxo2UCDH8owEk996gkbrpsgGtrJLM3J7jGxl9Ic7Qwwj4ivOE5AWZWRMecDdF7hqGjFA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/jest-watcher": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-watcher/-/jest-watcher-29.7.0.tgz",
      "integrity": "sha512-49Fg7WXkU3Vl2h6LbLtMQ/HyB6rXSIX7SqvBLQmssRBGN9I0PNvPmAmCWSOY6SOvrjhI/F7/bGAv9RtnsPA03g==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/test-result": "^29.7.0",
        "@jest/types": "^29.6.3",
        "@types/node": "*",
        "ansi-escapes": "^4.2.1",
        "chalk": "^4.0.0",
        "emittery": "^0.13.1",
        "jest-util": "^29.7.0",
        "string-length": "^4.0.1"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-worker": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-worker/-/jest-worker-29.7.0.tgz",
      "integrity": "sha512-eIz2msL/EzL9UFTFFx7jBTkeZfku0yUAyZZZmJ93H2TYEiroIx2PQjEXcwYtYl8zXCxb+PAmA2hLIt/6ZEkPHw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@types/node": "*",
        "jest-util": "^29.7.0",
        "merge-stream": "^2.0.0",
        "supports-color": "^8.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-worker/node_modules/supports-color": {
      "version": "8.1.1",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-8.1.1.tgz",
      "integrity": "sha512-MpUEN2OodtUzxvKQl72cUF7RQ5EiHsGvSsVG0ia9c5RbWGL2CI4C7EpPS8UTBIplnlzZiNuV56w+FuNxy3ty2Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/supports-color?sponsor=1"
      }
    },
    "node_modules/jose": {
      "version": "4.15.9",
      "resolved": "https://registry.npmjs.org/jose/-/jose-4.15.9.tgz",
      "integrity": "sha512-1vUQX+IdDMVPj4k8kOxgUqlcK518yluMuGZwqlr44FS1ppZB/5GWh4rZG89erpOBOJjU/OBsnCVFfapsRz6nEA==",
      "funding": {
        "url": "https://github.com/sponsors/panva"
      }
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/js-yaml": {
      "version": "3.14.1",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-3.14.1.tgz",
      "integrity": "sha512-okMH7OXXJ7YrN9Ok3/SXrnu4iX9yOk+25nqX4imS2npuvTYDmo/QEZoqwZkYaIDk3jVvBOTOIEgEhaLOynBS9g==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "argparse": "^1.0.7",
        "esprima": "^4.0.0"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json-2-csv": {
      "version": "5.5.7",
      "resolved": "https://registry.npmjs.org/json-2-csv/-/json-2-csv-5.5.7.tgz",
      "integrity": "sha512-aZ0EOadeNnO4ifF60oXXTH8P177WeHhFLbRLqILW1Kk1gNHlgAOuvddMwEIaxbLpCzx+vXo49whK6AILdg8qLg==",
      "dev": true,
      "dependencies": {
        "deeks": "3.1.0",
        "doc-path": "4.1.1"
      },
      "engines": {
        "node": ">= 16"
      }
    },
    "node_modules/json-bigint": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/json-bigint/-/json-bigint-1.0.0.tgz",
      "integrity": "sha512-SiPv/8VpZuWbvLSMtTDU8hEfrZWg/mH/nV/b4o0CYbSxu1UIQPLdwKOCIyLQX+VIPO5vrLX3i8qtqFyhdPSUSQ==",
      "dependencies": {
        "bignumber.js": "^9.0.0"
      }
    },
    "node_modules/json-buffer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/json-buffer/-/json-buffer-3.0.1.tgz",
      "integrity": "sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==",
      "dev": true
    },
    "node_modules/json-parse-even-better-errors": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/json-parse-even-better-errors/-/json-parse-even-better-errors-2.3.1.tgz",
      "integrity": "sha512-xyFwyhro/JEof6Ghe2iz2NcXoj2sloNsWr/XsERDK/oiPCfaNhl5ONfp+jQdAZRQQ0IJWNzH9zIZF7li91kh2w==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/json-schema": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/json-schema/-/json-schema-0.4.0.tgz",
      "integrity": "sha512-es94M3nTIfsEPisRafak+HDLfHXnKBhV3vU5eqPcS3flIWqcxJWgXHXiey3YrpaNsanY5ei1VoYEbOzijuq9BA=="
    },
    "node_modules/json-schema-traverse": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-1.0.0.tgz",
      "integrity": "sha512-NM8/P9n3XjXhIZn1lLhkFaACTOURQXjWhV4BA/RnOv8xvgqtqpAX9IO4mRQxSx1Rlo4tqzeqb0sOlruaOy3dug==",
      "license": "MIT"
    },
    "node_modules/json-stable-stringify-without-jsonify": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/json-stable-stringify-without-jsonify/-/json-stable-stringify-without-jsonify-1.0.1.tgz",
      "integrity": "sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==",
      "dev": true
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/jsonwebtoken": {
      "version": "9.0.2",
      "resolved": "https://registry.npmjs.org/jsonwebtoken/-/jsonwebtoken-9.0.2.tgz",
      "integrity": "sha512-PRp66vJ865SSqOlgqS8hujT5U4AOgMfhrwYIuIhfKaoSCZcirrmASQr8CX7cUg+RMih+hgznrjp99o+W4pJLHQ==",
      "dependencies": {
        "jws": "^3.2.2",
        "lodash.includes": "^4.3.0",
        "lodash.isboolean": "^3.0.3",
        "lodash.isinteger": "^4.0.4",
        "lodash.isnumber": "^3.0.3",
        "lodash.isplainobject": "^4.0.6",
        "lodash.isstring": "^4.0.1",
        "lodash.once": "^4.0.0",
        "ms": "^2.1.1",
        "semver": "^7.5.4"
      },
      "engines": {
        "node": ">=12",
        "npm": ">=6"
      }
    },
    "node_modules/jsonwebtoken/node_modules/jwa": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/jwa/-/jwa-1.4.1.tgz",
      "integrity": "sha512-qiLX/xhEEFKUAJ6FiBMbes3w9ATzyk5W7Hvzpa/SLYdxNtng+gcurvrI7TbACjIXlsJyr05/S1oUhZrc63evQA==",
      "dependencies": {
        "buffer-equal-constant-time": "1.0.1",
        "ecdsa-sig-formatter": "1.0.11",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/jsonwebtoken/node_modules/jws": {
      "version": "3.2.2",
      "resolved": "https://registry.npmjs.org/jws/-/jws-3.2.2.tgz",
      "integrity": "sha512-YHlZCB6lMTllWDtSPHz/ZXTsi8S00usEV6v1tjq8tOUZzw7DpSDWVXjXDre6ed1w/pd495ODpHZYSdkRTsa0HA==",
      "dependencies": {
        "jwa": "^1.4.1",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/jsonwebtoken/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="
    },
    "node_modules/jsonwebtoken/node_modules/semver": {
      "version": "7.6.3",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.6.3.tgz",
      "integrity": "sha512-oVekP1cKtI+CTDvHWYFUcMtsK/00wmAEfyqKfNdARm8u1wNVhSgaX7A8d4UuIlUI5e84iEwOhs7ZPYRmzU9U6A==",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/jwa": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/jwa/-/jwa-2.0.0.tgz",
      "integrity": "sha512-jrZ2Qx916EA+fq9cEAeCROWPTfCwi1IVHqT2tapuqLEVVDKFDENFw1oL+MwrTvH6msKxsd1YTDVw6uKEcsrLEA==",
      "dependencies": {
        "buffer-equal-constant-time": "1.0.1",
        "ecdsa-sig-formatter": "1.0.11",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/jwks-rsa": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jwks-rsa/-/jwks-rsa-3.1.0.tgz",
      "integrity": "sha512-v7nqlfezb9YfHHzYII3ef2a2j1XnGeSE/bK3WfumaYCqONAIstJbrEGapz4kadScZzEt7zYCN7bucj8C0Mv/Rg==",
      "dependencies": {
        "@types/express": "^4.17.17",
        "@types/jsonwebtoken": "^9.0.2",
        "debug": "^4.3.4",
        "jose": "^4.14.6",
        "limiter": "^1.1.5",
        "lru-memoizer": "^2.2.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/jwks-rsa/node_modules/debug": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.0.tgz",
      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/jwks-rsa/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="
    },
    "node_modules/jws": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/jws/-/jws-4.0.0.tgz",
      "integrity": "sha512-KDncfTmOZoOMTFG4mBlG0qUIOlc03fmzH+ru6RgYVZhPkyiy/92Owlt/8UEN+a4TXR1FQetfIpJE8ApdvdVxTg==",
      "dependencies": {
        "jwa": "^2.0.0",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/keyv": {
      "version": "4.5.4",
      "resolved": "https://registry.npmjs.org/keyv/-/keyv-4.5.4.tgz",
      "integrity": "sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==",
      "dev": true,
      "dependencies": {
        "json-buffer": "3.0.1"
      }
    },
    "node_modules/kleur": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/kleur/-/kleur-3.0.3.tgz",
      "integrity": "sha512-eTIzlVOSUR+JxdDFepEYcBMtZ9Qqdef+rnzWdRZuMbOywu5tO2w2N7rqjoANZ5k9vywhL6Br1VRjUIgTQx4E8w==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/kuler": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/kuler/-/kuler-2.0.0.tgz",
      "integrity": "sha512-Xq9nH7KlWZmXAtodXDDRE7vs6DU1gTU8zYDHDiWLSip45Egwq3plLHzPn27NgvzL2r1LMPC1vdqh98sQxtqj4A=="
    },
    "node_modules/leven": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/leven/-/leven-3.1.0.tgz",
      "integrity": "sha512-qsda+H8jTaUaN/x5vzW2rzc+8Rw4TAQ/4KjB46IwK5VH+IlVeeeje/EoZRpiXvIqjFgK84QffqPztGI3VBLG1A==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/levn": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/levn/-/levn-0.4.1.tgz",
      "integrity": "sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==",
      "dev": true,
      "dependencies": {
        "prelude-ls": "^1.2.1",
        "type-check": "~0.4.0"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/limiter": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/limiter/-/limiter-1.1.5.tgz",
      "integrity": "sha512-FWWMIEOxz3GwUI4Ts/IvgVy6LPvoMPgjMdQ185nN6psJyBJ4yOpzqm695/h5umdLJg2vW3GR5iG11MAkR2AzJA=="
    },
    "node_modules/lines-and-columns": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz",
      "integrity": "sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/locate-path": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-5.0.0.tgz",
      "integrity": "sha512-t7hw9pI+WvuwNJXwk5zVHpyhIqzg2qTlklJOf0mVxGSbe3Fp2VieZcduNYjaLDoy6p9uGpQEGWG87WpMKlNq8g==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "p-locate": "^4.1.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/lodash": {
      "version": "4.17.21",
      "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
      "integrity": "sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==",
      "dev": true
    },
    "node_modules/lodash.camelcase": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/lodash.camelcase/-/lodash.camelcase-4.3.0.tgz",
      "integrity": "sha512-TwuEnCnxbc3rAvhf/LbG7tJUDzhqXyFnv3dtzLOPgCG/hODL7WFnsbwktkD7yUV0RrreP/l1PALq/YSg6VvjlA=="
    },
    "node_modules/lodash.clonedeep": {
      "version": "4.5.0",
      "resolved": "https://registry.npmjs.org/lodash.clonedeep/-/lodash.clonedeep-4.5.0.tgz",
      "integrity": "sha512-H5ZhCF25riFd9uB5UCkVKo61m3S/xZk1x4wA6yp/L3RFP6Z/eHH1ymQcGLo7J3GMPfm0V/7m1tryHuGVxpqEBQ=="
    },
    "node_modules/lodash.includes": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/lodash.includes/-/lodash.includes-4.3.0.tgz",
      "integrity": "sha512-W3Bx6mdkRTGtlJISOvVD/lbqjTlPPUDTMnlXZFnVwi9NKJ6tiAk6LVdlhZMm17VZisqhKcgzpO5Wz91PCt5b0w=="
    },
    "node_modules/lodash.isboolean": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/lodash.isboolean/-/lodash.isboolean-3.0.3.tgz",
      "integrity": "sha512-Bz5mupy2SVbPHURB98VAcw+aHh4vRV5IPNhILUCsOzRmsTmSQ17jIuqopAentWoehktxGd9e/hbIXq980/1QJg=="
    },
    "node_modules/lodash.isinteger": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/lodash.isinteger/-/lodash.isinteger-4.0.4.tgz",
      "integrity": "sha512-DBwtEWN2caHQ9/imiNeEA5ys1JoRtRfY3d7V9wkqtbycnAmTvRRmbHKDV4a0EYc678/dia0jrte4tjYwVBaZUA=="
    },
    "node_modules/lodash.isnumber": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/lodash.isnumber/-/lodash.isnumber-3.0.3.tgz",
      "integrity": "sha512-QYqzpfwO3/CWf3XP+Z+tkQsfaLL/EnUlXWVkIk5FUPc4sBdTehEqZONuyRt2P67PXAk+NXmTBcc97zw9t1FQrw=="
    },
    "node_modules/lodash.isplainobject": {
      "version": "4.0.6",
      "resolved": "https://registry.npmjs.org/lodash.isplainobject/-/lodash.isplainobject-4.0.6.tgz",
      "integrity": "sha512-oSXzaWypCMHkPC3NvBEaPHf0KsA5mvPrOPgQWDsbg8n7orZ290M0BmC/jgRZ4vcJ6DTAhjrsSYgdsW/F+MFOBA=="
    },
    "node_modules/lodash.isstring": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/lodash.isstring/-/lodash.isstring-4.0.1.tgz",
      "integrity": "sha512-0wJxfxH1wgO3GrbuP+dTTk7op+6L41QCXbGINEmD+ny/G/eCqGzxyCsh7159S+mgDDcoarnBw6PC1PS5+wUGgw=="
    },
    "node_modules/lodash.mapvalues": {
      "version": "4.6.0",
      "resolved": "https://registry.npmjs.org/lodash.mapvalues/-/lodash.mapvalues-4.6.0.tgz",
      "integrity": "sha512-JPFqXFeZQ7BfS00H58kClY7SPVeHertPE0lNuCyZ26/XlN8TvakYD7b9bGyNmXbT/D3BbtPAAmq90gPWqLkxlQ==",
      "license": "MIT"
    },
    "node_modules/lodash.merge": {
      "version": "4.6.2",
      "resolved": "https://registry.npmjs.org/lodash.merge/-/lodash.merge-4.6.2.tgz",
      "integrity": "sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ=="
    },
    "node_modules/lodash.once": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/lodash.once/-/lodash.once-4.1.1.tgz",
      "integrity": "sha512-Sb487aTOCr9drQVL8pIxOzVhafOjZN9UU54hiN8PU3uAiSV7lx1yYNpbNmex2PK6dSJoNTSJUUswT651yww3Mg=="
    },
    "node_modules/log-symbols": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/log-symbols/-/log-symbols-4.1.0.tgz",
      "integrity": "sha512-8XPvpAA8uyhfteu8pIvQxpJZ7SYYdpUivZpGy6sFsBuKRY/7rQGavedeB8aK+Zkyq6upMFVL/9AW6vOYzfRyLg==",
      "dev": true,
      "dependencies": {
        "chalk": "^4.1.0",
        "is-unicode-supported": "^0.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/logform": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/logform/-/logform-2.7.0.tgz",
      "integrity": "sha512-TFYA4jnP7PVbmlBIfhlSe+WKxs9dklXMTEGcBCIvLhE/Tn3H6Gk1norupVW7m5Cnd4bLcr08AytbyV/xj7f/kQ==",
      "dependencies": {
        "@colors/colors": "1.6.0",
        "@types/triple-beam": "^1.3.2",
        "fecha": "^4.2.0",
        "ms": "^2.1.1",
        "safe-stable-stringify": "^2.3.1",
        "triple-beam": "^1.3.0"
      },
      "engines": {
        "node": ">= 12.0.0"
      }
    },
    "node_modules/logform/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="
    },
    "node_modules/long": {
      "version": "5.2.4",
      "resolved": "https://registry.npmjs.org/long/-/long-5.2.4.tgz",
      "integrity": "sha512-qtzLbJE8hq7VabR3mISmVGtoXP8KGc2Z/AT8OuqlYD7JTR3oqrgwdjnk07wpj1twXxYmgDXgoKVWUG/fReSzHg=="
    },
    "node_modules/lru-cache": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
      "dev": true,
      "license": "ISC",
      "peer": true,
      "dependencies": {
        "yallist": "^3.0.2"
      }
    },
    "node_modules/lru-memoizer": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/lru-memoizer/-/lru-memoizer-2.3.0.tgz",
      "integrity": "sha512-GXn7gyHAMhO13WSKrIiNfztwxodVsP8IoZ3XfrJV4yH2x0/OeTO/FIaAHTY5YekdGgW94njfuKmyyt1E0mR6Ug==",
      "dependencies": {
        "lodash.clonedeep": "^4.5.0",
        "lru-cache": "6.0.0"
      }
    },
    "node_modules/lru-memoizer/node_modules/lru-cache": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-6.0.0.tgz",
      "integrity": "sha512-Jo6dJ04CmSjuznwJSS3pUeWmd/H0ffTlkXXgwZi+eq1UCmqQwCh+eLsYOYCwY991i2Fah4h1BEMCx4qThGbsiA==",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/lru-memoizer/node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A=="
    },
    "node_modules/make-dir": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/make-dir/-/make-dir-4.0.0.tgz",
      "integrity": "sha512-hXdUTZYIVOt1Ex//jAQi+wTZZpUpwBj/0QsOzqegb3rGMMeJiSEu5xLHnYfBrRV4RH2+OCSOO95Is/7x1WJ4bw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "semver": "^7.5.3"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/make-dir/node_modules/semver": {
      "version": "7.7.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.1.tgz",
      "integrity": "sha512-hlq8tAfn0m/61p4BVRcPzIGr6LKiMwo4VM6dGi6pt4qcRkmNzTcWq6eCEjEh+qXjkMDvPlOFFSGwQjoEa6gyMA==",
      "dev": true,
      "license": "ISC",
      "peer": true,
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/makeerror": {
      "version": "1.0.12",
      "resolved": "https://registry.npmjs.org/makeerror/-/makeerror-1.0.12.tgz",
      "integrity": "sha512-JmqCvUhmt43madlpFzG4BQzG2Z3m6tvQDNKdClZnO3VbIudJYmxsT0FNJMeiB2+JTSlTQTSbU8QdesVmwJcmLg==",
      "dev": true,
      "license": "BSD-3-Clause",
      "peer": true,
      "dependencies": {
        "tmpl": "1.0.5"
      }
    },
    "node_modules/map-stream": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/map-stream/-/map-stream-0.1.0.tgz",
      "integrity": "sha512-CkYQrPYZfWnu/DAmVCpTSX/xHpKZ80eKh2lAkyA6AJTef6bW+6JpbQZN5rofum7da+SyN1bi5ctTm+lTfcCW3g==",
      "dev": true
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/media-typer": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-0.3.0.tgz",
      "integrity": "sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/merge-descriptors": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-1.0.3.tgz",
      "integrity": "sha512-gaNvAS7TZ897/rVaZ0nMtAyxNyi/pdbjbAwUpFQpN70GqnVfOiXpeUUMKRBmzXaSQ8DdTX4/0ms62r2K+hE6mQ==",
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/merge-stream": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/merge-stream/-/merge-stream-2.0.0.tgz",
      "integrity": "sha512-abv/qOcuPfk3URPfDzmZU1LKmuw8kT+0nIHvKrKgFrwifol/doWcdA4ZqsWQ8ENrFKkd67Mfpo/LovbIUsbt3w==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/methods": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/methods/-/methods-1.1.2.tgz",
      "integrity": "sha512-iclAHeNqNm68zFtnZ0e+1L2yUIdvzNoauKU4WBA3VvH/vPFieF7qfRlwUZU+DA9P9bPXIS90ulxoUoCH23sV2w==",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/mime": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/mime/-/mime-3.0.0.tgz",
      "integrity": "sha512-jSCU7/VB1loIWBZe14aEYHU/+1UMEHoaO7qxCOVJOw9GgH72VAWppxNcjU+x9a2k3GSIBXNKxXQFqRvvZ7vr3A==",
      "optional": true,
      "bin": {
        "mime": "cli.js"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mimic-fn": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/mimic-fn/-/mimic-fn-2.1.0.tgz",
      "integrity": "sha512-OqbOk5oEQeAZ8WXWydlu9HJjz9WVdEIvamMCcXmuqUYjTknH/sqsWvhQ3vgwKFRR1HpjvNBKQ37nbJgYzGqGcg==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/minimatch": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.2.tgz",
      "integrity": "sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==",
      "dev": true,
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/minimist": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz",
      "integrity": "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/minipass": {
      "version": "7.1.2",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-7.1.2.tgz",
      "integrity": "sha512-qOOzS1cBTWYF4BH8fVePDBOO9iptMnGUEZwNc/cMWnTV2nVLZ7VoNWEPHkYczZA0pdoA7dl6e7FL659nX9S2aw==",
      "dev": true,
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/module-details-from-path": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/module-details-from-path/-/module-details-from-path-1.0.3.tgz",
      "integrity": "sha512-ySViT69/76t8VhE1xXHK6Ch4NcDd26gx0MzKXLO+F7NOtnqH68d9zF94nT8ZWSxXh8ELOERsnJO/sWt1xZYw5A=="
    },
    "node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A=="
    },
    "node_modules/mute-stream": {
      "version": "0.0.8",
      "resolved": "https://registry.npmjs.org/mute-stream/-/mute-stream-0.0.8.tgz",
      "integrity": "sha512-nnbWWOkoWyUsTjKrhgD0dcz22mdkSnpYqbEjIm2nhwhuxlSkpywJmBo8h0ZqJdkp73mb90SssHkN4rsRaBAfAA==",
      "dev": true
    },
    "node_modules/natural-compare": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/natural-compare/-/natural-compare-1.4.0.tgz",
      "integrity": "sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==",
      "dev": true
    },
    "node_modules/negotiator": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.3.tgz",
      "integrity": "sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/neo-async": {
      "version": "2.6.2",
      "resolved": "https://registry.npmjs.org/neo-async/-/neo-async-2.6.2.tgz",
      "integrity": "sha512-Yd3UES5mWCSqR+qNT93S3UoYUkqAZ9lLg8a7g9rimsWmYGK8cVToA4/sF3RrshdyV3sAGMXVUmpMYOw+dLpOuw==",
      "license": "MIT"
    },
    "node_modules/node-domexception": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/node-domexception/-/node-domexception-1.0.0.tgz",
      "integrity": "sha512-/jKZoMpw0F8GRwl4/eLROPA3cfcXtLApP0QzLmUT/HuPCZWyB7IY9ZrMeKw2O/nFIqPQB3PVM9aYm0F312AXDQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/jimmywarting"
        },
        {
          "type": "github",
          "url": "https://paypal.me/jimmywarting"
        }
      ],
      "engines": {
        "node": ">=10.5.0"
      }
    },
    "node_modules/node-fetch": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-2.7.0.tgz",
      "integrity": "sha512-c4FRfUm/dbcWZ7U+1Wq0AwCyFL+3nt2bEw05wfxSz+DWpWsitgmSgYmy2dQdWyKC1694ELPqMs/YzUSNozLt8A==",
      "dependencies": {
        "whatwg-url": "^5.0.0"
      },
      "engines": {
        "node": "4.x || >=6.0.0"
      },
      "peerDependencies": {
        "encoding": "^0.1.0"
      },
      "peerDependenciesMeta": {
        "encoding": {
          "optional": true
        }
      }
    },
    "node_modules/node-forge": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/node-forge/-/node-forge-1.3.1.tgz",
      "integrity": "sha512-dPEtOeMvF9VMcYV/1Wb8CPoVAXtp6MKMlcbAt4ddqmGqUJ6fQZFXkNZNkNlfevtNkGtaSoXf/vNNNSvgrdXwtA==",
      "engines": {
        "node": ">= 6.13.0"
      }
    },
    "node_modules/node-int64": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/node-int64/-/node-int64-0.4.0.tgz",
      "integrity": "sha512-O5lz91xSOeoXP6DulyHfllpq+Eg00MWitZIbtPfoSEvqIHdl5gfcY6hYzDWnj0qD5tz52PI08u9qUvSVeUBeHw==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/node-releases": {
      "version": "2.0.19",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.19.tgz",
      "integrity": "sha512-xxOWJsBKtzAq7DY0J+DTzuz58K8e7sJbdgwkbMWQe8UYB6ekmsQ45q0M/tJDsGaZmbC+l7n57UV8Hl5tHxO9uw==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/normalize-path": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz",
      "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/npm-run-path": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/npm-run-path/-/npm-run-path-4.0.1.tgz",
      "integrity": "sha512-S48WzZW777zhNIrn7gxOlISNAqi9ZC/uQFnRdbeIHhZhCA6UqpkOT8T1G7BvfdgP4Er8gF4sUbaS0i7QvIfCWw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "path-key": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-hash": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/object-hash/-/object-hash-3.0.0.tgz",
      "integrity": "sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.3",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.3.tgz",
      "integrity": "sha512-kDCGIbxkDSXE3euJZZXzc6to7fCrKHNI/hSRQnRuQ+BWjFNzZwiFF8fj/6o2t2G9/jTj8PSIYTfCLelLZEeRpA==",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/on-finished": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
      "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/one-time": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/one-time/-/one-time-1.0.0.tgz",
      "integrity": "sha512-5DXOiRKwuSEcQ/l0kGCF6Q3jcADFv5tSmRaJck/OqkVFcOzutB134KRSfF0xDrL39MNnqxbHBbUUcjZIhTgb2g==",
      "dependencies": {
        "fn.name": "1.x.x"
      }
    },
    "node_modules/onetime": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/onetime/-/onetime-5.1.2.tgz",
      "integrity": "sha512-kbpaSSGJTWdAY5KPVeMOKXSrPtr8C8C7wodJbcsd51jRnmD+GZu8Y0VoU6Dm5Z4vWr0Ig/1NKuWRKf7j5aaYSg==",
      "dev": true,
      "dependencies": {
        "mimic-fn": "^2.1.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/open": {
      "version": "6.4.0",
      "resolved": "https://registry.npmjs.org/open/-/open-6.4.0.tgz",
      "integrity": "sha512-IFenVPgF70fSm1keSd2iDBIDIBZkroLeuffXq+wKTzTJlBpesFWojV9lb8mzOfaAzM1sr7HQHuO0vtV0zYekGg==",
      "dev": true,
      "dependencies": {
        "is-wsl": "^1.1.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/openai": {
      "version": "4.80.0",
      "resolved": "https://registry.npmjs.org/openai/-/openai-4.80.0.tgz",
      "integrity": "sha512-5TqdNQgjOMxo3CkCvtjzuSwuznO/o3q5aak0MTy6IjRvPtvVA1wAFGJU3eZT1JHzhs2wFb/xtDG0o6Y/2KGCfw==",
      "dependencies": {
        "@types/node": "^18.11.18",
        "@types/node-fetch": "^2.6.4",
        "abort-controller": "^3.0.0",
        "agentkeepalive": "^4.2.1",
        "form-data-encoder": "1.7.2",
        "formdata-node": "^4.3.2",
        "node-fetch": "^2.6.7"
      },
      "bin": {
        "openai": "bin/cli"
      },
      "peerDependencies": {
        "ws": "^8.18.0",
        "zod": "^3.23.8"
      },
      "peerDependenciesMeta": {
        "ws": {
          "optional": true
        },
        "zod": {
          "optional": true
        }
      }
    },
    "node_modules/openai/node_modules/@types/node": {
      "version": "18.19.74",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-18.19.74.tgz",
      "integrity": "sha512-HMwEkkifei3L605gFdV+/UwtpxP6JSzM+xFk2Ia6DNFSwSVBRh9qp5Tgf4lNFOMfPVuU0WnkcWpXZpgn5ufO4A==",
      "dependencies": {
        "undici-types": "~5.26.4"
      }
    },
    "node_modules/openai/node_modules/undici-types": {
      "version": "5.26.5",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-5.26.5.tgz",
      "integrity": "sha512-JlCMO+ehdEIKqlFxk6IfVoAUVmgz7cU7zD/h9XZ0qzeosSHmUJVOzSQvvYSYWXkFXC+IfLKSIffhv0sVZup6pA=="
    },
    "node_modules/openapi3-ts": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/openapi3-ts/-/openapi3-ts-4.4.0.tgz",
      "integrity": "sha512-9asTNB9IkKEzWMcHmVZE7Ts3kC9G7AFHfs8i7caD8HbI76gEjdkId4z/AkP83xdZsH7PLAnnbl47qZkXuxpArw==",
      "dev": true,
      "dependencies": {
        "yaml": "^2.5.0"
      }
    },
    "node_modules/optionator": {
      "version": "0.9.4",
      "resolved": "https://registry.npmjs.org/optionator/-/optionator-0.9.4.tgz",
      "integrity": "sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==",
      "dev": true,
      "dependencies": {
        "deep-is": "^0.1.3",
        "fast-levenshtein": "^2.0.6",
        "levn": "^0.4.1",
        "prelude-ls": "^1.2.1",
        "type-check": "^0.4.0",
        "word-wrap": "^1.2.5"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/ora": {
      "version": "5.4.1",
      "resolved": "https://registry.npmjs.org/ora/-/ora-5.4.1.tgz",
      "integrity": "sha512-5b6Y85tPxZZ7QytO+BQzysW31HJku27cRIlkbAXaNx+BdcVi+LlRFmVXzeF6a7JCwJpyw5c4b+YSVImQIrBpuQ==",
      "dev": true,
      "dependencies": {
        "bl": "^4.1.0",
        "chalk": "^4.1.0",
        "cli-cursor": "^3.1.0",
        "cli-spinners": "^2.5.0",
        "is-interactive": "^1.0.0",
        "is-unicode-supported": "^0.1.0",
        "log-symbols": "^4.1.0",
        "strip-ansi": "^6.0.0",
        "wcwidth": "^1.0.1"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/os-tmpdir": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/os-tmpdir/-/os-tmpdir-1.0.2.tgz",
      "integrity": "sha512-D2FR03Vir7FIu45XBY20mTb+/ZSWB00sjU9jdQXt83gDrI4Ztz5Fs7/yy74g2N5SVQY4xY1qDr4rNddwYRVX0g==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/p-limit": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz",
      "integrity": "sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==",
      "devOptional": true,
      "dependencies": {
        "yocto-queue": "^0.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/p-locate": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-4.1.0.tgz",
      "integrity": "sha512-R79ZZ/0wAxKGu3oYMlz8jy/kbhsNrS7SKZ7PxEHBgJ5+F2mtFW2fK2cOtBh1cHYkQsbzFV7I+EoRKe6Yt0oK7A==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "p-limit": "^2.2.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/p-locate/node_modules/p-limit": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-2.3.0.tgz",
      "integrity": "sha512-//88mFWSJx8lxCzwdAABTJL2MyWB12+eIY7MDL2SqLmAkeKU9qxRvWuSyTjm3FUmpBEMuFfckAIqEaVGUDxb6w==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "p-try": "^2.0.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/p-try": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/p-try/-/p-try-2.2.0.tgz",
      "integrity": "sha512-R4nPAVTAU0B9D35/Gk3uJf/7XYbQcyohSKdvAxIRSNghFl4e71hVoGnBNQz9cWaXxO2I10KTC+3jMdvvoKw6dQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/package-json-from-dist": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/package-json-from-dist/-/package-json-from-dist-1.0.1.tgz",
      "integrity": "sha512-UEZIS3/by4OC8vL3P2dTXRETpebLI2NiI5vIrjaD/5UtrkFX/tNbwjTSRAGC/+7CAo2pIcBaRgWmcBBHcsaCIw==",
      "dev": true
    },
    "node_modules/parent-module": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/parent-module/-/parent-module-1.0.1.tgz",
      "integrity": "sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==",
      "dev": true,
      "dependencies": {
        "callsites": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/parse-json": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/parse-json/-/parse-json-5.2.0.tgz",
      "integrity": "sha512-ayCKvm/phCGxOkYRSCM82iDwct8/EonSEgCSxWxD7ve6jHggsFl4fZVQBPRNgQoKiuV/odhFrGzQXZwbifC8Rg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/code-frame": "^7.0.0",
        "error-ex": "^1.3.1",
        "json-parse-even-better-errors": "^2.3.0",
        "lines-and-columns": "^1.1.6"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/partial-json": {
      "version": "0.1.7",
      "resolved": "https://registry.npmjs.org/partial-json/-/partial-json-0.1.7.tgz",
      "integrity": "sha512-Njv/59hHaokb/hRUjce3Hdv12wd60MtM9Z5Olmn+nehe0QDAsRtRbJPvJ0Z91TusF0SuZRIvnM+S4l6EIP8leA==",
      "license": "MIT"
    },
    "node_modules/path-exists": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",
      "integrity": "sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-is-absolute": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.1.tgz",
      "integrity": "sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw=="
    },
    "node_modules/path-scurry": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/path-scurry/-/path-scurry-1.11.1.tgz",
      "integrity": "sha512-Xa4Nw17FS9ApQFJ9umLiJS4orGjm7ZzwUrwamcGQuHSzDyth9boKDaycYdDcZDuqYATXw4HFXgaqWTctW/v1HA==",
      "dev": true,
      "dependencies": {
        "lru-cache": "^10.2.0",
        "minipass": "^5.0.0 || ^6.0.2 || ^7.0.0"
      },
      "engines": {
        "node": ">=16 || 14 >=14.18"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/path-scurry/node_modules/lru-cache": {
      "version": "10.4.3",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-10.4.3.tgz",
      "integrity": "sha512-JNAzZcXrCt42VGLuYz0zfAzDfAvJWW6AfYlDBQyDV5DClI2m5sAmK+OIO7s59XfsRsWHp02jAJrRadPRGTt6SQ==",
      "dev": true
    },
    "node_modules/path-to-regexp": {
      "version": "0.1.12",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-0.1.12.tgz",
      "integrity": "sha512-RA1GjUVMnvYFxuqovrEqZoxxW5NUZqbwKtYz/Tt7nXerk0LbLblQmrsgdeOxV5SFHf0UDggjS/bSeOZwt1pmEQ=="
    },
    "node_modules/pause-stream": {
      "version": "0.0.11",
      "resolved": "https://registry.npmjs.org/pause-stream/-/pause-stream-0.0.11.tgz",
      "integrity": "sha512-e3FBlXLmN/D1S+zHzanP4E/4Z60oFAa3O051qt1pxa7DEJWKAyil6upYVXCWadEnuoqa4Pkc9oUx9zsxYeRv8A==",
      "dev": true,
      "dependencies": {
        "through": "~2.3"
      }
    },
    "node_modules/pend": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/pend/-/pend-1.2.0.tgz",
      "integrity": "sha512-F3asv42UuXchdzt+xXqfW1OGlVBe+mxa2mqI0pg5yAHZPvFmY3Y6drSf/GQ1A86WgWEN9Kzh/WrgKa6iGcHXLg==",
      "dev": true
    },
    "node_modules/pg-int8": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/pg-int8/-/pg-int8-1.0.1.tgz",
      "integrity": "sha512-WCtabS6t3c8SkpDBUlb1kjOs7l66xsGdKpIPZsg4wR+B3+u9UAum2odSsF9tnvxg80h4ZxLWMy4pRjOsFIqQpw==",
      "license": "ISC",
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/pg-protocol": {
      "version": "1.7.1",
      "resolved": "https://registry.npmjs.org/pg-protocol/-/pg-protocol-1.7.1.tgz",
      "integrity": "sha512-gjTHWGYWsEgy9MsY0Gp6ZJxV24IjDqdpTW7Eh0x+WfJLFsm/TJx1MzL6T0D88mBvkpxotCQ6TwW6N+Kko7lhgQ==",
      "license": "MIT"
    },
    "node_modules/pg-types": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/pg-types/-/pg-types-2.2.0.tgz",
      "integrity": "sha512-qTAAlrEsl8s4OiEQY69wDvcMIdQN6wdz5ojQiOy6YRMuynxenON0O5oCpJI6lshc6scgAY8qvJ2On/p+CXY0GA==",
      "license": "MIT",
      "dependencies": {
        "pg-int8": "1.0.1",
        "postgres-array": "~2.0.0",
        "postgres-bytea": "~1.0.0",
        "postgres-date": "~1.0.4",
        "postgres-interval": "^1.1.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC",
      "peer": true
    },
    "node_modules/picomatch": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.1.tgz",
      "integrity": "sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==",
      "dev": true,
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/pirates": {
      "version": "4.0.6",
      "resolved": "https://registry.npmjs.org/pirates/-/pirates-4.0.6.tgz",
      "integrity": "sha512-saLsH7WeYYPiD25LDuLRRY/i+6HaPYr6G1OUlN39otzkSTxKnubR9RTxS3/Kk50s1g2JTgFwWQDQyplC5/SHZg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/pkg-dir": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/pkg-dir/-/pkg-dir-4.2.0.tgz",
      "integrity": "sha512-HRDzbaKjC+AOWVXxAU/x54COGeIv9eb+6CkDSQoNTt4XyWoIJvuPsXizxu/Fr23EiekbtZwmh1IcIG/l/a10GQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "find-up": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/postgres-array": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/postgres-array/-/postgres-array-2.0.0.tgz",
      "integrity": "sha512-VpZrUqU5A69eQyW2c5CA1jtLecCsN2U/bD6VilrFDWq5+5UIEVO7nazS3TEcHf1zuPYO/sqGvUvW62g86RXZuA==",
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/postgres-bytea": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/postgres-bytea/-/postgres-bytea-1.0.0.tgz",
      "integrity": "sha512-xy3pmLuQqRBZBXDULy7KbaitYqLcmxigw14Q5sj8QBVLqEwXfeybIKVWiqAXTlcvdvb0+xkOtDbfQMOf4lST1w==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/postgres-date": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/postgres-date/-/postgres-date-1.0.7.tgz",
      "integrity": "sha512-suDmjLVQg78nMK2UZ454hAG+OAW+HQPZ6n++TNDUX+L0+uUlLywnoxJKDou51Zm+zTCjrCl0Nq6J9C5hP9vK/Q==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/postgres-interval": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/postgres-interval/-/postgres-interval-1.2.0.tgz",
      "integrity": "sha512-9ZhXKM/rw350N1ovuWHbGxnGh/SNJ4cnxHiM0rxE4VN41wsg8P8zWn9hv/buK00RP4WvlOyr/RBDiptyxVbkZQ==",
      "license": "MIT",
      "dependencies": {
        "xtend": "^4.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/prelude-ls": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/prelude-ls/-/prelude-ls-1.2.1.tgz",
      "integrity": "sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==",
      "dev": true,
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/pretty-format": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/pretty-format/-/pretty-format-29.7.0.tgz",
      "integrity": "sha512-Pdlw/oPxN+aXdmM9R00JVC9WVFoCLTKJvDVLgmJ+qAffBMxsV85l/Lu7sNx4zSzPyoL2euImuEwHhOXdEgNFZQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@jest/schemas": "^29.6.3",
        "ansi-styles": "^5.0.0",
        "react-is": "^18.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/pretty-format/node_modules/ansi-styles": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-5.2.0.tgz",
      "integrity": "sha512-Cxwpt2SfTzTtXcfOlzGEee8O+c+MmUgGrNiBcXnuWxuFJHe6a5Hz7qwhwe5OgaSYI0IJvkLqWX1ASG+cJOkEiA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/prompts": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/prompts/-/prompts-2.4.2.tgz",
      "integrity": "sha512-NxNv/kLguCA7p3jE8oL2aEBsrJWgAakBpgmgK6lpPWV+WuOmY6r2/zbAVnP+T8bQlA0nzHXSJSJW0Hq7ylaD2Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "kleur": "^3.0.3",
        "sisteransi": "^1.0.5"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/proto3-json-serializer": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/proto3-json-serializer/-/proto3-json-serializer-2.0.2.tgz",
      "integrity": "sha512-SAzp/O4Yh02jGdRc+uIrGoe87dkN/XtwxfZ4ZyafJHymd79ozp5VG5nyZ7ygqPM5+cpLDjjGnYFUkngonyDPOQ==",
      "dependencies": {
        "protobufjs": "^7.2.5"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/protobuf.js": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/protobuf.js/-/protobuf.js-1.1.2.tgz",
      "integrity": "sha512-USO7Xus/pzPw549M1TguiyoOrKEhm9VMXv+CkDufcjMC8Rd7EPbxeRQPEjCV8ua1tm0k7z9xHkogcxovZogWdA==",
      "dependencies": {
        "long": "~1.1.2"
      }
    },
    "node_modules/protobuf.js/node_modules/long": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/long/-/long-1.1.5.tgz",
      "integrity": "sha512-TU6nAF5SdasnTr28c7e74P4Crbn9o3/zwo1pM22Wvg2i2vlZ4Eelxwu4QT7j21z0sDBlJDEnEZjXTZg2J8WJrg==",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/protobufjs": {
      "version": "7.4.0",
      "resolved": "https://registry.npmjs.org/protobufjs/-/protobufjs-7.4.0.tgz",
      "integrity": "sha512-mRUWCc3KUU4w1jU8sGxICXH/gNS94DvI1gxqDvBzhj1JpcsimQkYiOJfwsPUykUI5ZaspFbSgmBLER8IrQ3tqw==",
      "hasInstallScript": true,
      "dependencies": {
        "@protobufjs/aspromise": "^1.1.2",
        "@protobufjs/base64": "^1.1.2",
        "@protobufjs/codegen": "^2.0.4",
        "@protobufjs/eventemitter": "^1.1.0",
        "@protobufjs/fetch": "^1.1.0",
        "@protobufjs/float": "^1.0.2",
        "@protobufjs/inquire": "^1.1.0",
        "@protobufjs/path": "^1.1.2",
        "@protobufjs/pool": "^1.1.0",
        "@protobufjs/utf8": "^1.1.0",
        "@types/node": ">=13.7.0",
        "long": "^5.0.0"
      },
      "engines": {
        "node": ">=12.0.0"
      }
    },
    "node_modules/proxy-addr": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",
      "integrity": "sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==",
      "dependencies": {
        "forwarded": "0.2.0",
        "ipaddr.js": "1.9.1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/proxy-from-env": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/proxy-from-env/-/proxy-from-env-1.1.0.tgz",
      "integrity": "sha512-D+zkORCbA9f1tdWRK0RaCR3GPv50cMxcrz4X8k5LTSUD1Dkw47mKJEZQNunItRTkWwgtaUSo1RVFRIG9ZXiFYg==",
      "dev": true
    },
    "node_modules/ps-tree": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/ps-tree/-/ps-tree-1.2.0.tgz",
      "integrity": "sha512-0VnamPPYHl4uaU/nSFeZZpR21QAWRz+sRv4iW9+v/GS/J5U5iZB5BNN6J0RMoOvdx2gWM2+ZFMIm58q24e4UYA==",
      "dev": true,
      "dependencies": {
        "event-stream": "=3.3.4"
      },
      "bin": {
        "ps-tree": "bin/ps-tree.js"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/pump": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/pump/-/pump-3.0.2.tgz",
      "integrity": "sha512-tUPXtzlGM8FE3P0ZL6DVs/3P58k9nk8/jZeQCurTJylQA8qFYzHFfhBJkuqyE0FifOsQ0uKWekiZ5g8wtr28cw==",
      "dependencies": {
        "end-of-stream": "^1.1.0",
        "once": "^1.3.1"
      }
    },
    "node_modules/pumpify": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/pumpify/-/pumpify-2.0.1.tgz",
      "integrity": "sha512-m7KOje7jZxrmutanlkS1daj1dS6z6BgslzOXmcSEpIlCxM3VJH7lG5QLeck/6hgF6F4crFf01UtQmNsJfweTAw==",
      "license": "MIT",
      "dependencies": {
        "duplexify": "^4.1.1",
        "inherits": "^2.0.3",
        "pump": "^3.0.0"
      }
    },
    "node_modules/punycode": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/pure-rand": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/pure-rand/-/pure-rand-6.1.0.tgz",
      "integrity": "sha512-bVWawvoZoBYpp6yIoQtQXHZjmz35RSVHnUOTefl8Vcjr8snTPY1wnpSPMWekcFwbxI6gtmT7rSYPFvz71ldiOA==",
      "dev": true,
      "funding": [
        {
          "type": "individual",
          "url": "https://github.com/sponsors/dubzzz"
        },
        {
          "type": "opencollective",
          "url": "https://opencollective.com/fast-check"
        }
      ],
      "license": "MIT",
      "peer": true
    },
    "node_modules/qs": {
      "version": "6.13.0",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.13.0.tgz",
      "integrity": "sha512-+38qI9SOr8tfZ4QmJNplMUxqjbe7LKvvZgWdExBOmd+egZTtjLB67Gu0HRX3u/XOq7UU2Nx6nsjvS16Z9uwfpg==",
      "dependencies": {
        "side-channel": "^1.0.6"
      },
      "engines": {
        "node": ">=0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/range-parser": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.2.1.tgz",
      "integrity": "sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/raw-body": {
      "version": "2.5.2",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-2.5.2.tgz",
      "integrity": "sha512-8zGqypfENjCIqGhgXToC8aB2r7YrBX+AQAfIPs/Mlk+BtPTztOvTS01NRW/3Eh60J+a48lt8qsCzirQ6loCVfA==",
      "dependencies": {
        "bytes": "3.1.2",
        "http-errors": "2.0.0",
        "iconv-lite": "0.4.24",
        "unpipe": "1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/react-is": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react-is/-/react-is-18.3.1.tgz",
      "integrity": "sha512-/LLMVyas0ljjAtoYiPqYiL8VWXzUUdThrmU5+n20DZv+a+ClRoevUzw5JxU+Ieh5/c87ytoTBV9G1FiKfNJdmg==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/readable-stream": {
      "version": "3.6.2",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-3.6.2.tgz",
      "integrity": "sha512-9u/sniCrY3D5WdsERHzHE4G2YCXqoG5FTHUiCC4SIbr6XcLZBY05ya9EKjYek9O5xOAwjGq+1JdGBAS7Q9ScoA==",
      "dependencies": {
        "inherits": "^2.0.3",
        "string_decoder": "^1.1.1",
        "util-deprecate": "^1.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/readdirp": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz",
      "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
      "dev": true,
      "dependencies": {
        "picomatch": "^2.2.1"
      },
      "engines": {
        "node": ">=8.10.0"
      }
    },
    "node_modules/require-directory": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz",
      "integrity": "sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/require-from-string": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/require-from-string/-/require-from-string-2.0.2.tgz",
      "integrity": "sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/require-in-the-middle": {
      "version": "7.4.0",
      "resolved": "https://registry.npmjs.org/require-in-the-middle/-/require-in-the-middle-7.4.0.tgz",
      "integrity": "sha512-X34iHADNbNDfr6OTStIAHWSAvvKQRYgLO6duASaVf7J2VA3lvmNYboAHOuLC2huav1IwgZJtyEcJCKVzFxOSMQ==",
      "dependencies": {
        "debug": "^4.3.5",
        "module-details-from-path": "^1.0.3",
        "resolve": "^1.22.8"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/require-in-the-middle/node_modules/debug": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.0.tgz",
      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/require-in-the-middle/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="
    },
    "node_modules/resolve": {
      "version": "1.22.10",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.10.tgz",
      "integrity": "sha512-NPRy+/ncIMeDlTAsuqwKIiferiawhefFJtkNSW0qZJEqMEb+qBt/77B/jGeeek+F0uOeN05CDa6HXbbIgtVX4w==",
      "dependencies": {
        "is-core-module": "^2.16.0",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/resolve-cwd": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/resolve-cwd/-/resolve-cwd-3.0.0.tgz",
      "integrity": "sha512-OrZaX2Mb+rJCpH/6CpSqt9xFVpN++x01XnN2ie9g6P5/3xelLAkXWVADpdz1IHD/KFfEXyE6V0U01OQ3UO2rEg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "resolve-from": "^5.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/resolve-from": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-5.0.0.tgz",
      "integrity": "sha512-qYg9KP24dD5qka9J47d0aVky0N+b4fTU89LN9iDnjB5waksiC49rvMB0PrUJQGoTmH50XPiqOvAjDfaijGxYZw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/resolve-pkg-maps": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/resolve-pkg-maps/-/resolve-pkg-maps-1.0.0.tgz",
      "integrity": "sha512-seS2Tj26TBVOC2NIc2rOe2y2ZO7efxITtLZcGSOnHHNOQ7CkiUBfw0Iw2ck6xkIhPwLhKNLS8BO+hEpngQlqzw==",
      "dev": true,
      "funding": {
        "url": "https://github.com/privatenumber/resolve-pkg-maps?sponsor=1"
      }
    },
    "node_modules/resolve.exports": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/resolve.exports/-/resolve.exports-2.0.3.tgz",
      "integrity": "sha512-OcXjMsGdhL4XnbShKpAcSqPMzQoYkYyhbEaeSko47MjRP9NfEQMhZkXL1DoFlt9LWQn4YttrdnV6X2OiyzBi+A==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/restore-cursor": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/restore-cursor/-/restore-cursor-3.1.0.tgz",
      "integrity": "sha512-l+sSefzHpj5qimhFSE5a8nufZYAM3sBSVMAPtYkmC+4EH2anSGaEMXSD0izRQbu9nfyQ9y5JrVmp7E8oZrUjvA==",
      "dev": true,
      "dependencies": {
        "onetime": "^5.1.0",
        "signal-exit": "^3.0.2"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/retry": {
      "version": "0.13.1",
      "resolved": "https://registry.npmjs.org/retry/-/retry-0.13.1.tgz",
      "integrity": "sha512-XQBQ3I8W1Cge0Seh+6gjj03LbmRFWuoszgK9ooCpwYIrhhoO80pfq4cUkU5DkknwfOfFteRwlZ56PYOGYyFWdg==",
      "optional": true,
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/retry-request": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/retry-request/-/retry-request-7.0.2.tgz",
      "integrity": "sha512-dUOvLMJ0/JJYEn8NrpOaGNE7X3vpI5XlZS/u0ANjqtcZVKnIxP7IgCFwrKTxENw29emmwug53awKtaMm4i9g5w==",
      "dependencies": {
        "@types/request": "^2.48.8",
        "extend": "^3.0.2",
        "teeny-request": "^9.0.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/run-async": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/run-async/-/run-async-2.4.1.tgz",
      "integrity": "sha512-tvVnVv01b8c1RrA6Ep7JkStj85Guv/YrMcwqYQnwjsAS2cTmmPGBBjAjpCW7RrSodNSoE2/qg9O4bceNvUuDgQ==",
      "dev": true,
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/rxjs": {
      "version": "7.8.1",
      "resolved": "https://registry.npmjs.org/rxjs/-/rxjs-7.8.1.tgz",
      "integrity": "sha512-AA3TVj+0A2iuIoQkWEK/tqFjBq2j+6PO6Y0zJcvzLAFhEFIO3HL0vls9hWLncZbAAbK0mar7oZ4V079I/qPMxg==",
      "dev": true,
      "dependencies": {
        "tslib": "^2.1.0"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ]
    },
    "node_modules/safe-stable-stringify": {
      "version": "2.5.0",
      "resolved": "https://registry.npmjs.org/safe-stable-stringify/-/safe-stable-stringify-2.5.0.tgz",
      "integrity": "sha512-b3rppTKm9T+PsVCBEOUR46GWI7fdOs00VKZ1+9c1EWDaDMvjQc6tUwuFyIprgGgTcWoVHSKrU8H31ZHA2e0RHA==",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg=="
    },
    "node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/send": {
      "version": "0.19.0",
      "resolved": "https://registry.npmjs.org/send/-/send-0.19.0.tgz",
      "integrity": "sha512-dW41u5VfLXu8SJh5bwRmyYUbAoSB3c9uQh6L8h/KtsFREPWpbX1lrljJo186Jc4nmci/sGUZ9a0a0J2zgfq2hw==",
      "dependencies": {
        "debug": "2.6.9",
        "depd": "2.0.0",
        "destroy": "1.2.0",
        "encodeurl": "~1.0.2",
        "escape-html": "~1.0.3",
        "etag": "~1.8.1",
        "fresh": "0.5.2",
        "http-errors": "2.0.0",
        "mime": "1.6.0",
        "ms": "2.1.3",
        "on-finished": "2.4.1",
        "range-parser": "~1.2.1",
        "statuses": "2.0.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/send/node_modules/encodeurl": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-1.0.2.tgz",
      "integrity": "sha512-TPJXq8JqFaVYm2CWmPvnP2Iyo4ZSM7/QKcSmuMLDObfpH5fi7RUGmd/rTDf+rut/saiDiQEeVTNgAmJEdAOx0w==",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/send/node_modules/mime": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/mime/-/mime-1.6.0.tgz",
      "integrity": "sha512-x0Vn8spI+wuJ1O6S7gnbaQg8Pxh4NNHb7KSINmEWKiPE4RKOplvijn+NkmYmmRgP68mc70j2EbeTFRsrswaQeg==",
      "bin": {
        "mime": "cli.js"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/send/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="
    },
    "node_modules/serve-static": {
      "version": "1.16.2",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-1.16.2.tgz",
      "integrity": "sha512-VqpjJZKadQB/PEbEwvFdO43Ax5dFBZ2UECszz8bQ7pi7wt//PWe1P6MN7eCnjsatYtBT6EuiClbjSWP2WrIoTw==",
      "dependencies": {
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "parseurl": "~1.3.3",
        "send": "0.19.0"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/setprototypeof": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
      "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw=="
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "dev": true,
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shimmer": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/shimmer/-/shimmer-1.2.1.tgz",
      "integrity": "sha512-sQTKC1Re/rM6XyFM6fIAGHRPVGvyXfgzIDvzoq608vM+jeyVD0Tu1E6Np0Kc2zAIFWIj963V2800iF/9LPieQw=="
    },
    "node_modules/side-channel": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.0.tgz",
      "integrity": "sha512-ZX99e6tRweoUXqR+VBrslhda51Nh5MTQwou5tnUDgbtyM0dBgmhEDtWGP/xbKn6hqfPRHujUNwz5fy/wbbhnpw==",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.3",
        "side-channel-list": "^1.0.0",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.0.tgz",
      "integrity": "sha512-FCLHtRD/gnpCiCHEiJLOwdmFP+wzCmDEkc9y7NsYxeF4u7Btsn1ZuwgwJGxImImHicJArLP4R0yX4c2KCrMrTA==",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/signal-exit": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-3.0.7.tgz",
      "integrity": "sha512-wnD2ZE+l+SPC/uoS0vXeE9L1+0wuaMqKlfz9AMUo38JsyLSBWSFcHR1Rri62LZc12vLr1gb3jl7iwQhgwpAbGQ==",
      "dev": true
    },
    "node_modules/simple-swizzle": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/simple-swizzle/-/simple-swizzle-0.2.2.tgz",
      "integrity": "sha512-JA//kQgZtbuY83m+xT+tXJkmJncGMTFT+C+g2h2R9uxkYIrE2yy9sgmcLhCnw57/WSD+Eh3J97FPEDFnbXnDUg==",
      "dependencies": {
        "is-arrayish": "^0.3.1"
      }
    },
    "node_modules/simple-swizzle/node_modules/is-arrayish": {
      "version": "0.3.2",
      "resolved": "https://registry.npmjs.org/is-arrayish/-/is-arrayish-0.3.2.tgz",
      "integrity": "sha512-eVRqCvVlZbuw3GrM63ovNSNAeA1K16kaR/LRY/92w0zxQ5/1YzwblUX652i4Xs9RwAGjW9d9y6X88t8OaAJfWQ=="
    },
    "node_modules/sisteransi": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/sisteransi/-/sisteransi-1.0.5.tgz",
      "integrity": "sha512-bLGGlR1QxBcynn2d5YmDX4MGjlZvy2MRBDRNHLJ8VI6l6+9FUiyTFNJ0IveOSP0bcXgVDPRcfGqA0pjaqUpfVg==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/slash": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/slash/-/slash-3.0.0.tgz",
      "integrity": "sha512-g9Q1haeby36OSStwb4ntCGGGaKsaVSjQ68fBxoQcutl5fS1vuY18H3wSt3jFyFtrkx+Kz0V1G85A4MyAdDMi2Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-support": {
      "version": "0.5.13",
      "resolved": "https://registry.npmjs.org/source-map-support/-/source-map-support-0.5.13.tgz",
      "integrity": "sha512-SHSKFHadjVA5oR4PPqhtAVdcBWwRYVd6g6cAXnIbRiIwc2EhPrTuKUBdSLvlEKyIP3GCf89fltvcZiP9MMFA1w==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "buffer-from": "^1.0.0",
        "source-map": "^0.6.0"
      }
    },
    "node_modules/split": {
      "version": "0.3.3",
      "resolved": "https://registry.npmjs.org/split/-/split-0.3.3.tgz",
      "integrity": "sha512-wD2AeVmxXRBoX44wAycgjVpMhvbwdI2aZjCkvfNcH1YqHQvJVa1duWc73OyVGJUc05fhFaTZeQ/PYsrmyH0JVA==",
      "dev": true,
      "dependencies": {
        "through": "2"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/sprintf-js": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/sprintf-js/-/sprintf-js-1.0.3.tgz",
      "integrity": "sha512-D9cPgkvLlV3t3IzL0D0YLvGA9Ahk4PcvVwUbN0dSGr1aP0Nrt4AEnTUbuGvquEC0mA64Gqt1fzirlRs5ibXx8g==",
      "dev": true,
      "license": "BSD-3-Clause",
      "peer": true
    },
    "node_modules/stack-trace": {
      "version": "0.0.10",
      "resolved": "https://registry.npmjs.org/stack-trace/-/stack-trace-0.0.10.tgz",
      "integrity": "sha512-KGzahc7puUKkzyMt+IqAep+TVNbKP+k2Lmwhub39m1AsTSkaDutx56aDCo+HLDzf/D26BIHTJWNiTG1KAJiQCg==",
      "engines": {
        "node": "*"
      }
    },
    "node_modules/stack-utils": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/stack-utils/-/stack-utils-2.0.6.tgz",
      "integrity": "sha512-XlkWvfIm6RmsWtNJx+uqtKLS8eqFbxUg0ZzLXqY0caEy9l7hruX8IpiDnjsLavoBgqCCR71TqWO8MaXYheJ3RQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "escape-string-regexp": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/statuses": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.1.tgz",
      "integrity": "sha512-RwNA9Z/7PrK06rYLIzFMlaF+l73iwpzsqRIFgbMLbTcLD6cOao82TaWefPXQvB2fOC4AjuYSEndS7N/mTCbkdQ==",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/stream-combiner": {
      "version": "0.0.4",
      "resolved": "https://registry.npmjs.org/stream-combiner/-/stream-combiner-0.0.4.tgz",
      "integrity": "sha512-rT00SPnTVyRsaSz5zgSPma/aHSOic5U1prhYdRy5HS2kTZviFpmDgzilbtsJsxiroqACmayynDN/9VzIbX5DOw==",
      "dev": true,
      "dependencies": {
        "duplexer": "~0.1.1"
      }
    },
    "node_modules/stream-events": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/stream-events/-/stream-events-1.0.5.tgz",
      "integrity": "sha512-E1GUzBSgvct8Jsb3v2X15pjzN1tYebtbLaMg+eBOUOAxgbLoSbT2NS91ckc5lJD1KfLjId+jXJRgo0qnV5Nerg==",
      "dependencies": {
        "stubs": "^3.0.0"
      }
    },
    "node_modules/stream-shift": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/stream-shift/-/stream-shift-1.0.3.tgz",
      "integrity": "sha512-76ORR0DO1o1hlKwTbi/DM3EXWGf3ZJYO8cXX5RJwnul2DEg2oyoZyjLNoQM8WsvZiFKCRfC1O0J7iCvie3RZmQ=="
    },
    "node_modules/string_decoder": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz",
      "integrity": "sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==",
      "dependencies": {
        "safe-buffer": "~5.2.0"
      }
    },
    "node_modules/string-length": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/string-length/-/string-length-4.0.2.tgz",
      "integrity": "sha512-+l6rNN5fYHNhZZy41RXsYptCjA2Igmq4EG7kZAYFQI1E1VTXarr6ZPXBg6eq7Y6eK4FEhY6AJlyuFIb/v/S0VQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "char-regex": "^1.0.2",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/string-width-cjs": {
      "name": "string-width",
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "dev": true,
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi-cjs": {
      "name": "strip-ansi",
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dev": true,
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-bom": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/strip-bom/-/strip-bom-4.0.0.tgz",
      "integrity": "sha512-3xurFv5tEgii33Zi8Jtp55wEIILR9eh34FAW00PZf+JnSsTmV/ioewSgQl97JHvgjoRGwPShsWm+IdrxB35d0w==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-final-newline": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/strip-final-newline/-/strip-final-newline-2.0.0.tgz",
      "integrity": "sha512-BrpvfNAE3dcvq7ll3xVumzjKjZQ5tI1sEUIKr3Uoks0XUl45St3FlatVqef9prk4jRDzhW6WZg+3bk93y6pLjA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/strip-json-comments": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-3.1.1.tgz",
      "integrity": "sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==",
      "dev": true,
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/strnum": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/strnum/-/strnum-1.0.5.tgz",
      "integrity": "sha512-J8bbNyKKXl5qYcR36TIO8W3mVGVHrmmxsd5PAItGkmyzwJvybiw2IVq5nqd0i4LSNSkB/sx9VHllbfFdr9k1JA==",
      "optional": true
    },
    "node_modules/stubs": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/stubs/-/stubs-3.0.0.tgz",
      "integrity": "sha512-PdHt7hHUJKxvTCgbKX9C1V/ftOcjJQgz8BZwNfV5c4B6dcGqlpelTbJ999jBGZ2jYiPAwcX5dP6oBwVlBlUbxw=="
    },
    "node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "dev": true,
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/teeny-request": {
      "version": "9.0.0",
      "resolved": "https://registry.npmjs.org/teeny-request/-/teeny-request-9.0.0.tgz",
      "integrity": "sha512-resvxdc6Mgb7YEThw6G6bExlXKkv6+YbuzGg9xuXxSgxJF7Ozs+o8Y9+2R3sArdWdW8nOokoQb1yrpFB0pQK2g==",
      "dependencies": {
        "http-proxy-agent": "^5.0.0",
        "https-proxy-agent": "^5.0.0",
        "node-fetch": "^2.6.9",
        "stream-events": "^1.0.5",
        "uuid": "^9.0.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/teeny-request/node_modules/agent-base": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-6.0.2.tgz",
      "integrity": "sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==",
      "dependencies": {
        "debug": "4"
      },
      "engines": {
        "node": ">= 6.0.0"
      }
    },
    "node_modules/teeny-request/node_modules/debug": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.0.tgz",
      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/teeny-request/node_modules/https-proxy-agent": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-5.0.1.tgz",
      "integrity": "sha512-dFcAjpTQFgoLMzC2VwU+C/CbS7uRL0lWmxDITmqm7C+7F0Odmj6s9l6alZc6AELXhrnggM2CeWSXHGOdX2YtwA==",
      "dependencies": {
        "agent-base": "6",
        "debug": "4"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/teeny-request/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="
    },
    "node_modules/teeny-request/node_modules/uuid": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-9.0.1.tgz",
      "integrity": "sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/terminate": {
      "version": "2.8.0",
      "resolved": "https://registry.npmjs.org/terminate/-/terminate-2.8.0.tgz",
      "integrity": "sha512-bcbjJEg0wY5nuJXvGxxHfmoEPkyHLCctUKO6suwtxy7jVSgGcgPeGwpbLDLELFhIaxCGRr3dPvyNg1yuz2V0eg==",
      "dev": true,
      "dependencies": {
        "ps-tree": "^1.2.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/test-exclude": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/test-exclude/-/test-exclude-6.0.0.tgz",
      "integrity": "sha512-cAGWPIyOHU6zlmg88jwm7VRyXnMN7iV68OGAbYDk/Mh/xC/pzVPlQtY6ngoIH/5/tciuhGfvESU8GrHrcxD56w==",
      "dev": true,
      "license": "ISC",
      "peer": true,
      "dependencies": {
        "@istanbuljs/schema": "^0.1.2",
        "glob": "^7.1.4",
        "minimatch": "^3.0.4"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/text-hex": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/text-hex/-/text-hex-1.0.0.tgz",
      "integrity": "sha512-uuVGNWzgJ4yhRaNSiubPY7OjISw4sw4E5Uv0wbjp+OzcbmVU/rsT8ujgcXJhn9ypzsgr5vlzpPqP+MBBKcGvbg=="
    },
    "node_modules/through": {
      "version": "2.3.8",
      "resolved": "https://registry.npmjs.org/through/-/through-2.3.8.tgz",
      "integrity": "sha512-w89qg7PI8wAdvX60bMDP+bFoD5Dvhm9oLheFp5O4a2QF0cSBGsBX4qZmadPMvVqlLJBBci+WqGGOAPvcDeNSVg==",
      "dev": true
    },
    "node_modules/tmp": {
      "version": "0.0.33",
      "resolved": "https://registry.npmjs.org/tmp/-/tmp-0.0.33.tgz",
      "integrity": "sha512-jRCJlojKnZ3addtTOjdIqoRuPEKBvNXcGYqzO6zWZX8KfKEpnGY5jfggJQ3EjKuu8D4bJRr0y+cYJFmYbImXGw==",
      "dev": true,
      "dependencies": {
        "os-tmpdir": "~1.0.2"
      },
      "engines": {
        "node": ">=0.6.0"
      }
    },
    "node_modules/tmpl": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/tmpl/-/tmpl-1.0.5.tgz",
      "integrity": "sha512-3f0uOEAQwIqGuWW2MVzYg8fV/QNnc/IpuJNG837rLuczAaLVHslWHZQj4IGiEl5Hs3kkbhwL9Ab7Hrsmuj+Smw==",
      "dev": true,
      "license": "BSD-3-Clause",
      "peer": true
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dev": true,
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
      "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/tr46": {
      "version": "0.0.3",
      "resolved": "https://registry.npmjs.org/tr46/-/tr46-0.0.3.tgz",
      "integrity": "sha512-N3WMsuqV66lT30CrXNbEjx4GEwlow3v6rr4mCcv6prnfwhS01rkgyFdjPNBYd9br7LpXV1+Emh01fHnq2Gdgrw=="
    },
    "node_modules/triple-beam": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/triple-beam/-/triple-beam-1.4.1.tgz",
      "integrity": "sha512-aZbgViZrg1QNcG+LULa7nhZpJTZSLm/mXnHXnbAbjmN5aSa0y7V+wvv6+4WaBtpISJzThKy+PIPxc1Nq1EJ9mg==",
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/ts-deepmerge": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/ts-deepmerge/-/ts-deepmerge-2.0.7.tgz",
      "integrity": "sha512-3phiGcxPSSR47RBubQxPoZ+pqXsEsozLo4G4AlSrsMKTFg9TA3l+3he5BqpUi9wiuDbaHWXH/amlzQ49uEdXtg==",
      "dev": true
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w=="
    },
    "node_modules/tsx": {
      "version": "4.19.2",
      "resolved": "https://registry.npmjs.org/tsx/-/tsx-4.19.2.tgz",
      "integrity": "sha512-pOUl6Vo2LUq/bSa8S5q7b91cgNSjctn9ugq/+Mvow99qW6x/UZYwzxy/3NmqoT66eHYfCVvFvACC58UBPFf28g==",
      "dev": true,
      "dependencies": {
        "esbuild": "~0.23.0",
        "get-tsconfig": "^4.7.5"
      },
      "bin": {
        "tsx": "dist/cli.mjs"
      },
      "engines": {
        "node": ">=18.0.0"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      }
    },
    "node_modules/type-check": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/type-check/-/type-check-0.4.0.tgz",
      "integrity": "sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==",
      "dev": true,
      "dependencies": {
        "prelude-ls": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/type-detect": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/type-detect/-/type-detect-4.0.8.tgz",
      "integrity": "sha512-0fr/mIH1dlO+x7TlcMy+bIDqKPsw/70tVyeHW787goQjhmqaZe10uwLujubK9q9Lg6Fiho1KUKDYz0Z7k7g5/g==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/type-fest": {
      "version": "0.21.3",
      "resolved": "https://registry.npmjs.org/type-fest/-/type-fest-0.21.3.tgz",
      "integrity": "sha512-t0rzBq87m3fVcduHDUFhKmyyX+9eo6WQjZvf51Ea/M0Q7+T374Jp1aUiyUl0GKxp8M/OETVHSDvmkyPgvX+X2w==",
      "dev": true,
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/type-is": {
      "version": "1.6.18",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-1.6.18.tgz",
      "integrity": "sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==",
      "dependencies": {
        "media-typer": "0.3.0",
        "mime-types": "~2.1.24"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/typedarray-to-buffer": {
      "version": "3.1.5",
      "resolved": "https://registry.npmjs.org/typedarray-to-buffer/-/typedarray-to-buffer-3.1.5.tgz",
      "integrity": "sha512-zdu8XMNEDepKKR+XYOXAVPtWui0ly0NtohUscw+UmaHiAWT8hrV1rr//H6V+0DvJ3OQ19S979M0laLfX8rm82Q==",
      "dev": true,
      "dependencies": {
        "is-typedarray": "^1.0.0"
      }
    },
    "node_modules/typescript": {
      "version": "4.9.5",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-4.9.5.tgz",
      "integrity": "sha512-1FXk9E2Hm+QzZQ7z+McJiHL4NW1F2EzMu9Nq9i3zAaGqibafqYwCVU6WyWAuyQRRzOlxou8xZSyXLEN8oKj24g==",
      "dev": true,
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=4.2.0"
      }
    },
    "node_modules/uglify-js": {
      "version": "3.19.3",
      "resolved": "https://registry.npmjs.org/uglify-js/-/uglify-js-3.19.3.tgz",
      "integrity": "sha512-v3Xu+yuwBXisp6QYTcH4UbH+xYJXqnq2m/LtQVWKWzYc1iehYnLixoQDN9FH6/j9/oybfd6W9Ghwkl8+UMKTKQ==",
      "license": "BSD-2-Clause",
      "optional": true,
      "bin": {
        "uglifyjs": "bin/uglifyjs"
      },
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg=="
    },
    "node_modules/unique-string": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/unique-string/-/unique-string-2.0.0.tgz",
      "integrity": "sha512-uNaeirEPvpZWSgzwsPGtU2zVSTrn/8L5q/IexZmH0eH6SA73CmAA5U4GwORTxQAZs95TAXLNqeLoPPNO5gZfWg==",
      "dev": true,
      "dependencies": {
        "crypto-random-string": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/update-browserslist-db": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.1.2.tgz",
      "integrity": "sha512-PPypAm5qvlD7XMZC3BujecnaOxwhrtoFR+Dqkk5Aa/6DssiH0ibKoketaj9w8LP7Bont1rYeoV5plxD7RTEPRg==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/uri-js": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/uri-js/-/uri-js-4.4.1.tgz",
      "integrity": "sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==",
      "dev": true,
      "dependencies": {
        "punycode": "^2.1.0"
      }
    },
    "node_modules/url-template": {
      "version": "2.0.8",
      "resolved": "https://registry.npmjs.org/url-template/-/url-template-2.0.8.tgz",
      "integrity": "sha512-XdVKMF4SJ0nP/O7XIPB0JwAEuT9lDIYnNsK8yGVe43y0AWoKeJNdv3ZNWh7ksJ6KqQFjOO6ox/VEitLnaVNufw=="
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw=="
    },
    "node_modules/utils-merge": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/utils-merge/-/utils-merge-1.0.1.tgz",
      "integrity": "sha512-pMZTvIkT1d+TFGvDOqodOclx0QWkkgi6Tdoa8gC8ffGAAqz9pzPTZWAybbsHHoED/ztMtkv/VoYTYyShUn81hA==",
      "engines": {
        "node": ">= 0.4.0"
      }
    },
    "node_modules/uuid": {
      "version": "10.0.0",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-10.0.0.tgz",
      "integrity": "sha512-8XkAphELsDnEGrDxUOHB3RGvXz6TeuYSGEZBOjtTtPm2lwhGBjLgOzLHB63IUWfBpNucQjND6d3AOudO+H3RWQ==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/v8-to-istanbul": {
      "version": "9.3.0",
      "resolved": "https://registry.npmjs.org/v8-to-istanbul/-/v8-to-istanbul-9.3.0.tgz",
      "integrity": "sha512-kiGUalWN+rgBJ/1OHZsBtU4rXZOfj/7rKQxULKlIzwzQSvMJUUNgPwJEEh7gU6xEVxC0ahoOBvN2YI8GH6FNgA==",
      "dev": true,
      "license": "ISC",
      "peer": true,
      "dependencies": {
        "@jridgewell/trace-mapping": "^0.3.12",
        "@types/istanbul-lib-coverage": "^2.0.1",
        "convert-source-map": "^2.0.0"
      },
      "engines": {
        "node": ">=10.12.0"
      }
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/walker": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/walker/-/walker-1.0.8.tgz",
      "integrity": "sha512-ts/8E8l5b7kY0vlWLewOkDXMmPdLcVV4GmOQLyxuSswIJsweeFZtAsMF7k1Nszz+TYBQrlYRmzOnr398y1JemQ==",
      "dev": true,
      "license": "Apache-2.0",
      "peer": true,
      "dependencies": {
        "makeerror": "1.0.12"
      }
    },
    "node_modules/wcwidth": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/wcwidth/-/wcwidth-1.0.1.tgz",
      "integrity": "sha512-XHPEwS0q6TaxcvG85+8EYkbiCux2XtWG2mkc47Ng2A77BQu9+DqIOJldST4HgPkuea7dvKSj5VgX3P1d4rW8Tg==",
      "dev": true,
      "dependencies": {
        "defaults": "^1.0.3"
      }
    },
    "node_modules/web-streams-polyfill": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/web-streams-polyfill/-/web-streams-polyfill-3.3.3.tgz",
      "integrity": "sha512-d2JWLCivmZYTSIoge9MsgFCZrt571BikcWGYkjC1khllbTeDlGqZ2D8vD8E/lJa8WGWbb7Plm8/XJYV7IJHZZw==",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/webidl-conversions": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-3.0.1.tgz",
      "integrity": "sha512-2JAn3z8AR6rjK8Sm8orRC0h/bcl/DqL7tRPdGZ4I1CjdF+EaMLmYxBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ=="
    },
    "node_modules/websocket-driver": {
      "version": "0.7.4",
      "resolved": "https://registry.npmjs.org/websocket-driver/-/websocket-driver-0.7.4.tgz",
      "integrity": "sha512-b17KeDIQVjvb0ssuSDF2cYXSg2iztliJ4B9WdsuB6J952qCPKmnVq4DyW5motImXHDC1cBT/1UezrJVsKw5zjg==",
      "dependencies": {
        "http-parser-js": ">=0.5.1",
        "safe-buffer": ">=5.1.0",
        "websocket-extensions": ">=0.1.1"
      },
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/websocket-extensions": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/websocket-extensions/-/websocket-extensions-0.1.4.tgz",
      "integrity": "sha512-OqedPIGOfsDlo31UNwYbCFMSaO9m9G/0faIHj5/dZFDMFqPTcx6UwqyOy3COEaEOg/9VsGIpdqn62W5KhoKSpg==",
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/whatwg-url": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-5.0.0.tgz",
      "integrity": "sha512-saE57nupxk6v3HY35+jzBwYa0rKSy0XR8JSxZPwgLr7ys0IBzhGviA1/TUGJLmSVqs8pb9AnvICXEuOHLprYTw==",
      "dependencies": {
        "tr46": "~0.0.3",
        "webidl-conversions": "^3.0.0"
      }
    },
    "node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "dev": true,
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/winston": {
      "version": "3.17.0",
      "resolved": "https://registry.npmjs.org/winston/-/winston-3.17.0.tgz",
      "integrity": "sha512-DLiFIXYC5fMPxaRg832S6F5mJYvePtmO5G9v9IgUFPhXm9/GkXarH/TUrBAVzhTCzAj9anE/+GjrgXp/54nOgw==",
      "dependencies": {
        "@colors/colors": "^1.6.0",
        "@dabh/diagnostics": "^2.0.2",
        "async": "^3.2.3",
        "is-stream": "^2.0.0",
        "logform": "^2.7.0",
        "one-time": "^1.0.0",
        "readable-stream": "^3.4.0",
        "safe-stable-stringify": "^2.3.1",
        "stack-trace": "0.0.x",
        "triple-beam": "^1.3.0",
        "winston-transport": "^4.9.0"
      },
      "engines": {
        "node": ">= 12.0.0"
      }
    },
    "node_modules/winston-transport": {
      "version": "4.9.0",
      "resolved": "https://registry.npmjs.org/winston-transport/-/winston-transport-4.9.0.tgz",
      "integrity": "sha512-8drMJ4rkgaPo1Me4zD/3WLfI/zPdA9o2IipKODunnGDcuqbHwjsbB79ylv04LCGGzU0xQ6vTznOMpQGaLhhm6A==",
      "dependencies": {
        "logform": "^2.7.0",
        "readable-stream": "^3.6.2",
        "triple-beam": "^1.3.0"
      },
      "engines": {
        "node": ">= 12.0.0"
      }
    },
    "node_modules/word-wrap": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/word-wrap/-/word-wrap-1.2.5.tgz",
      "integrity": "sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/wordwrap": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/wordwrap/-/wordwrap-1.0.0.tgz",
      "integrity": "sha512-gvVzJFlPycKc5dZN4yPkP8w7Dc37BtP1yczEneOb4uq34pXZcvrtRTmWV8W+Ume+XCxKgbjM+nevkyFPMybd4Q==",
      "license": "MIT"
    },
    "node_modules/wrap-ansi": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz",
      "integrity": "sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==",
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrap-ansi-cjs": {
      "name": "wrap-ansi",
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz",
      "integrity": "sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ=="
    },
    "node_modules/write-file-atomic": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/write-file-atomic/-/write-file-atomic-4.0.2.tgz",
      "integrity": "sha512-7KxauUdBmSdWnmpaGFg+ppNjKF8uNLry8LyzjauQDOVONfFLNKrKvQOxZ/VuTIcS/gge/YNahf5RIIQWTSarlg==",
      "dev": true,
      "license": "ISC",
      "peer": true,
      "dependencies": {
        "imurmurhash": "^0.1.4",
        "signal-exit": "^3.0.7"
      },
      "engines": {
        "node": "^12.13.0 || ^14.15.0 || >=16.0.0"
      }
    },
    "node_modules/xdg-basedir": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/xdg-basedir/-/xdg-basedir-4.0.0.tgz",
      "integrity": "sha512-PSNhEJDejZYV7h50BohL09Er9VaIefr2LMAf3OEmpCkjOi34eYyQYAXUTjEQtZJTKcF0E2UKTh+osDLsgNim9Q==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/xtend": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/xtend/-/xtend-4.0.2.tgz",
      "integrity": "sha512-LKYU1iAXJXUgAXn9URjiu+MWhyUXHsvfp7mcuYm9dSUKK0/CjtrUwFAxD82/mCWbtLsGjFIad0wIsod4zrTAEQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.4"
      }
    },
    "node_modules/y18n": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/y18n/-/y18n-5.0.8.tgz",
      "integrity": "sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/yallist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
      "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
      "dev": true,
      "license": "ISC",
      "peer": true
    },
    "node_modules/yaml": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/yaml/-/yaml-2.7.0.tgz",
      "integrity": "sha512-+hSoy/QHluxmC9kCIJyL/uyFmLmc+e5CFR5Wa+bpIhIj85LVb9ZH2nVnqrHoSvKogwODv0ClqZkmiSSaIH5LTA==",
      "bin": {
        "yaml": "bin.mjs"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/yargs": {
      "version": "17.7.2",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-17.7.2.tgz",
      "integrity": "sha512-7dSzzRQ++CKnNI/krKnYRV7JKKPUXMEh61soaHKg9mrWEhzFWhFnxPxGl+69cD1Ou63C13NUPCnmIcrvqCuM6w==",
      "dependencies": {
        "cliui": "^8.0.1",
        "escalade": "^3.1.1",
        "get-caller-file": "^2.0.5",
        "require-directory": "^2.1.1",
        "string-width": "^4.2.3",
        "y18n": "^5.0.5",
        "yargs-parser": "^21.1.1"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/yargs-parser": {
      "version": "21.1.1",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-21.1.1.tgz",
      "integrity": "sha512-tVpsJW7DdjecAiFpbIB1e3qxIQsE6NoPc5/eTdrbbIC4h0LVsWhnoa3g+m2HclBIujHzsxZ4VJVA+GUuc2/LBw==",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/yauzl": {
      "version": "2.10.0",
      "resolved": "https://registry.npmjs.org/yauzl/-/yauzl-2.10.0.tgz",
      "integrity": "sha512-p4a9I6X6nu6IhoGmBqAcbJy1mlC4j27vEPZX9F4L4/vZT3Lyq1VkFHw/V/PUcB9Buo+DG3iHkT0x3Qya58zc3g==",
      "dev": true,
      "dependencies": {
        "buffer-crc32": "~0.2.3",
        "fd-slicer": "~1.1.0"
      }
    },
    "node_modules/yocto-queue": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz",
      "integrity": "sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==",
      "devOptional": true,
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/zod": {
      "version": "3.24.1",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.24.1.tgz",
      "integrity": "sha512-muH7gBL9sI1nciMZV67X5fTKKBLtwpZ5VBp1vsOQzj1MhrBZ4wlVCm3gedKZWLp0Oyel8sIGfeiz54Su+OVT+A==",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/zod-to-json-schema": {
      "version": "3.24.1",
      "resolved": "https://registry.npmjs.org/zod-to-json-schema/-/zod-to-json-schema-3.24.1.tgz",
      "integrity": "sha512-3h08nf3Vw3Wl3PK+q3ow/lIil81IT2Oa7YpQyUUDsEWbXveMesdfK1xBd2RhCkynwZndAxixji/7SYJJowr62w==",
      "peerDependencies": {
        "zod": "^3.24.1"
      }
    }
  }
}
```

---

## /functions/package.json

```json
{
  "name": "functions",
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log",
    "genkit:start": "genkit start -- tsx --watch src/genkit-sample.ts"
  },
  "engines": {
    "node": "18"
  },
  "main": "lib/index.js",
  "dependencies": {
    "@genkit-ai/firebase": "^0.9.12",
    "@genkit-ai/googleai": "^1.0.4",
    "@genkit-ai/vertexai": "^0.9.12",
    "express": "^4.21.2",
    "firebase-admin": "^12.6.0",
    "firebase-functions": "^6.0.1",
    "genkit": "^1.0.4"
  },
  "devDependencies": {
    "@types/firebase": "^2.4.32",
    "eslint": "^9.18.0",
    "firebase-functions-test": "^3.1.0",
    "genkit-cli": "^0.9.12",
    "tsx": "^4.19.2",
    "typescript": "^4.9.5"
  },
  "private": true
}
```

---

## /functions/tsconfig.dev.json

```json
{
  "include": [
    ".eslintrc.js"
  ]
}
```

---

## /functions/tsconfig.json

```json
// File: /tsconfig.json
// Description: Root TypeScript configuration for the project
// Author: GitHub Copilot
// Created: 2023-10-10

{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "lib": [],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": false,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": false,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["node"],
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "typeRoots": ["node_modules/@types"]
  },
  "compileOnSave": true,
  "include": ["src"],
  "exclude": ["node_modules", "dist", "public"]
}
```

---

## /functions/src/index.ts

```typescript
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin
admin.initializeApp();

// Export an empty object to make this a module
export {};

// Example HTTP function with proper TypeScript types
export const api = onRequest({ cors: true }, async (request, response) => {
  try {
    logger.info("API request received", { path: request.path });
    
    // Basic health check endpoint
    if (request.path === "/health") {
      response.json({ status: "ok", timestamp: new Date().toISOString() });
      return;
    }
    
    response.status(404).json({ error: "Not found" });
  } catch (error) {
    logger.error("API error", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

// Add your Cloud Functions here
export const helloWorld = functions.https.onRequest((request, response) => {
  response.json({ message: "Hello from Firebase!" });
});
```

---

## /functions/lib/index.js

```javascript
"use strict";
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Remove these if not being used
// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map
```

---

## /src/App.css

```css
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

---

## /src/App.tsx

```tsx
import React, { useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import PrivateRoute from './components/PrivateRoute';
import { muiTheme, styledTheme } from './theme/theme';

// Lazy load components for better performance
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
  useEffect(() => {
    // Initialize service worker for Firebase messaging
    if ('serviceWorker' in navigator && (window.isSecureContext || process.env.NODE_ENV === 'development')) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js', {
          scope: '/__/auth/',
          type: 'module',
          updateViaCache: process.env.NODE_ENV === 'development' ? 'none' : 'imports'
        })
        .then((registration) => {
          console.debug('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          // Only log as error in production
          const logMethod = process.env.NODE_ENV === 'production' ? console.error : console.warn;
          logMethod('Service Worker registration failed:', error);
        });
    } else {
      console.debug('Service Worker registration skipped - requires HTTPS or production environment');
    }
  }, []);
  
  return (
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
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

export default App;
```

---

## /src/cleanup-workspace.sh

```plaintext
#!/bin/bash

# Remove duplicate/legacy files
echo "Removing duplicate and legacy files..."
rm components/Header.jsx
rm components/ParentDashboardLegacy.tsx
rm components/Sidebar.jsx
rm components/auth/LoginForm.jsx
rm components/layout/Header.jsx
rm components/layout/Layout.jsx
rm components/layout/Navbar.jsx
rm components/layout/Navigation.jsx
rm components/layout/Sidebar.jsx
rm components/layout/styles/Header.jsx
rm components/shared/Button.jsx
rm components/shared/LoadingSpinner.jsx
rm config/firebase.js
rm firebase/config.js
rm pages/*Legacy.jsx

# Move files to their new locations
echo "Moving files to new locations..."
mv components/ParentProfile/ParentProfile.tsx components/profile/
mv components/StudentProfileForm.tsx components/profile/
mv styles/* components/layout/styles/
rmdir styles

# Move component-specific styles to their folders
echo "Moving component styles..."
for cssfile in components/layout/styles/*.css; do
  component_name=$(basename "$cssfile" .css)
  target_dir="components/layout/"
  if [ -d "$target_dir" ]; then
    mv "$cssfile" "$target_dir"
  fi
done

echo "Cleanup complete!"
```

---

## /src/env.d.ts

```typescript
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

---

## /src/index.css

```css
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

---

## /src/index.tsx

```tsx
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

---

## /src/main.tsx

```tsx
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

---

## /src/pages/About.tsx

```tsx
// File: /src/pages/About.tsx
// Description: About page component providing information about Geaux Academy.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">About Geaux Academy</h1>
      <p className="mt-4">Geaux Academy is an interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery.</p>
    </div>
  );
};

export default About;
```

---

## /src/pages/Contact.tsx

```tsx
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

---

## /src/pages/Curriculum.tsx

```tsx
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

---

## /src/pages/Features.tsx

```tsx
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

---

## /src/pages/Home.tsx

```tsx
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

---

## /src/pages/LearningPlan.tsx

```tsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
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
      const userRef = doc(db, "users", currentUser.uid);
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
      const userRef = doc(db, "users", currentUser.uid);
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

---

## /src/pages/LearningStyles.tsx

```tsx
// File: /src/pages/LearningStyles.tsx
// Description: Learning Styles page component explaining different learning styles.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import { FaHeadphones, FaBook, FaRunning, FaBrain, FaUsers, FaEye } from 'react-icons/fa';
import Card from '../components/common/Card';

const LearningStyles: React.FC = () => {
  const learningStyles = [
    { title: "Visual", description: "Learn through seeing and watching demonstrations", icon: <FaEye /> },
    { title: "Auditory", description: "Learn through listening and speaking", icon: <FaHeadphones /> },
    { title: "Reading/Writing", description: "Learn through reading and writing text", icon: <FaBook /> },
    { title: "Kinesthetic", description: "Learn through doing and moving", icon: <FaRunning /> },
    { title: "Logical", description: "Learn through reasoning and problem-solving", icon: <FaBrain /> },
    { title: "Social", description: "Learn through group interaction and collaboration", icon: <FaUsers /> }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Learning Styles</h1>
      <p className="mt-4">Discover your preferred learning style and how Geaux Academy can help you learn more effectively.</p>

      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <StylesGrid>
          {learningStyles.map((style, index) => (
            <MotionStyleCard 
              key={index}
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.3 }}
            >
              <IconWrapper>{style.icon}</IconWrapper>
              <h3>{style.title}</h3>
              <p>{style.description}</p>
            </MotionStyleCard>
          ))}
        </StylesGrid>

        <CTASection>
          <h2>Want to know your learning style?</h2>
          <Button to='/take-assessment' $variant="primary">
            Take the Assessment
          </Button>
        </CTASection>
      </m.div>
    </div>
  );
};

const StylesGrid = styled(m.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StyleCard = styled(Card)`
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const MotionStyleCard = m.create(StyleCard);

const IconWrapper = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const CTASection = styled.div`
  text-align: center;
  margin: 4rem 0;
  
  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

const Button = styled(Link)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-block;
  padding: 1rem 2rem;
  background: ${({ theme, $variant }) => 
    $variant === 'secondary' ? theme.palette.secondary.main : theme.palette.primary.main};
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme, $variant }) => 
      $variant === 'secondary' ? theme.palette.secondary.dark : theme.palette.primary.dark};
  }
`;

export default LearningStyles;
```

---

## /src/pages/Login.tsx

```tsx
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

---

## /src/pages/NotFound.tsx

```tsx
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

---

## /src/pages/TakeAssessment.tsx

```tsx
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

---

## /src/pages/VarkStyles.tsx

```tsx
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

---

## /src/pages/values/Collaboration.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

const Collaboration: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      // Handle navigation to /dashboard after successful login
    } catch (err) {
      // Handle error as string per user preference
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaUsers size={40} />
        <h1>Collaboration</h1>
      </ValueHeader>
      <ValueContent>
        <p>We believe in the power of working together:</p>
        <ValuePoints>
          <li>Fostering partnerships between teachers, students, and parents</li>
          <li>Creating supportive learning communities</li>
          <li>Encouraging peer-to-peer learning</li>
          <li>Building strong educational networks</li>
        </ValuePoints>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

export default Collaboration;
```

---

## /src/pages/values/Excellence.tsx

```tsx
import React, { useState } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface ThemeProps {
  theme: DefaultTheme;
}

const Excellence: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      // Handle navigation to /dashboard after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      console.error('Login error:', err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaTrophy size={40} />
        <h1>Excellence</h1>
      </ValueHeader>
      <ValueContent>
        <p>We strive for excellence in every aspect of education:</p>
        <ValuePoints>
          <li>Setting high academic standards while supporting individual growth</li>
          <li>Continuously improving our teaching methodologies</li>
          <li>Providing top-quality educational resources</li>
          <li>Measuring and celebrating student achievements</li>
        </ValuePoints>
        <GoogleButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    position: relative;

    &::before {
      content: '•';
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const GoogleButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
  font-size: 0.875rem;
`;

export default Excellence;
```

---

## /src/pages/values/Innovation.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const Innovation: React.FC = () => {
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
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaLightbulb size={40} />
        <h1>Innovation</h1>
      </ValueHeader>
      <ValueContent>
        <p>Innovation drives our approach to personalized learning:</p>
        <ValuePoints>
          <li>Leveraging cutting-edge educational technology</li>
          <li>Developing adaptive learning pathways</li>
          <li>Creating interactive and engaging content</li>
          <li>Implementing data-driven teaching methods</li>
        </ValuePoints>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--primary-color);
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default Innovation;
```

---

## /src/pages/values/Integrity.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBalanceScale } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Integrity: React.FC = () => {
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

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaBalanceScale size={40} />
        <h1>Integrity</h1>
      </ValueHeader>
      <ValueContent>
        <p>At Geaux Academy, integrity is the foundation of everything we do. We believe in:</p>
        <ValuePoints>
          <li>Maintaining the highest ethical standards in education</li>
          <li>Being transparent with our teaching methods and student progress</li>
          <li>Creating a safe and honest learning environment</li>
          <li>Delivering on our promises to students and parents</li>
        </ValuePoints>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(motion.div)`
  max-width: 800px;
  margin: 80px auto;
  padding: 2rem;
`;

const ValueHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);

  h1 {
    margin-top: 1rem;
    font-size: 2.5rem;
  }
`;

const ValueContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
`;

const ValuePoints = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;

  li {
    padding: 1rem;
    margin-bottom: 1rem;
    background: var(--background-alt);
    border-radius: 4px;
    
    &:hover {
      transform: translateX(5px);
      transition: transform 0.2s;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default Integrity;
```

---

## /src/pages/profile/ParentProfile/CreateStudent.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addStudentProfile } from '../../../services/profileService';
import { useAuth } from '../../../contexts/AuthContext';
import StudentCard from '../../../components/student/StudentCard';

interface NewStudent {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}

const CreateStudent: React.FC = () => {
  const [studentName, setStudentName] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newStudent: NewStudent = { 
        name: studentName, 
        grade, 
        parentId: currentUser.uid,
        hasTakenAssessment: false
      };

      await addStudentProfile(currentUser.uid, newStudent);
      setStudentName('');
      setGrade('');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create student profile. Please try again.');
      console.error('Error creating student:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h2>Add a New Student</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            Student Name:
            <Input
              type="text"
              value={studentName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentName(e.target.value)}
              placeholder="Enter student's name"
              required
            />
          </Label>
        </FormGroup>

        <FormGroup>
          <Label>
            Grade Level:
            <Select 
              value={grade} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGrade(e.target.value)}
              required
            >
              <option value="">Select Grade</option>
              <option value="K">Kindergarten</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  Grade {i + 1}
                </option>
              ))}
            </Select>
          </Label>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Save Profile'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default CreateStudent;
```

---

## /src/pages/profile/ParentProfile/ParentDashboard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import StudentProgressTracker from './components/StudentProgressTracker';
import NotificationCenter from './dashboard/components/NotificationCenter';
import LearningStyleInsights from '../components/LearningStyleInsights';
import CurriculumApproval from './dashboard/components/CurriculumApproval';
import styled from 'styled-components';
import { useAuth } from "../../../contexts/AuthContext";
import { getParentProfile } from '../../../services/profileService';
import { Parent, Student } from '../../../types/auth';
import { useNavigate } from 'react-router-dom';

interface ParentProfile extends Omit<Parent, 'students'> {
  name: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'curriculum' | 'insights'>('overview');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const { currentUser: user, loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await getParentProfile(user.uid);
          if (profile) {
            setParentProfile({
              ...profile,
              name: profile.displayName,
              id: profile.id || user.uid,
              students: profile.students.map((student: string) => ({
                id: student,
                name: '',
                age: 0,
                grade: '',
                parentId: profile.id || user.uid,
                hasTakenAssessment: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })) || [],
              createdAt: profile.createdAt || new Date().toISOString(),
              updatedAt: profile.updatedAt || new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleProfileSwitch = (studentId: string) => {
    setSelectedStudent(studentId);
    navigate(`/student-dashboard/${studentId}`);
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Parent Dashboard</h1>
      </DashboardHeader>

      <ProfileSection>
        <h2>Account Details</h2>
        <p>Name: {parentProfile?.name || "Parent"}</p>
        <p>Email: {user?.email}</p>
        {!user && (
          <GoogleButton onClick={handleGoogleLogin}>
            Sign in with Google
          </GoogleButton>
        )}
      </ProfileSection>

      {user && (
        <>
          <StudentManagement>
            <h2>Student Profiles</h2>
            <AddStudentButton>➕ Add Student</AddStudentButton>
            
            <StudentList>
              {parentProfile?.students?.map((student) => (
                <StudentCard key={student.id} onClick={() => handleProfileSwitch(student.id)}>
                  <h3>{student.name}</h3>
                  <p>Grade: {student.grade}</p>
                  <p>Assessment: {student.hasTakenAssessment ? 'Completed' : 'Pending'}</p>
                  <ViewProfileButton>View Profile</ViewProfileButton>
                </StudentCard>
              ))}
            </StudentList>
          </StudentManagement>

          <TabContainer>
            <TabList>
              <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</Tab>
              <Tab active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>Progress</Tab>
              <Tab active={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')}>Curriculum</Tab>
              <Tab active={activeTab === 'insights'} onClick={() => setActiveTab('insights')}>Insights</Tab>
            </TabList>

            <TabContent>
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'progress' && <StudentProgressTracker />}
              {activeTab === 'curriculum' && <CurriculumApproval />}
              {activeTab === 'insights' && <LearningStyleInsights />}
            </TabContent>
          </TabContainer>

          <NotificationSection>
            <NotificationCenter />
          </NotificationSection>
        </>
      )}
    </DashboardContainer>
  );
};

// Styled components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }
`;

const ProfileSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StudentManagement = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const AddStudentButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: var(--primary-dark);
  }
`;

const StudentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StudentCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
`;

const TabContainer = styled.div`
  margin-top: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.button<TabProps>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? 'var(--primary-dark)' : '#f0f0f0'};
  }
`;

const TabContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NotificationSection = styled.div`
  margin-top: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f8f8f8;
  }
`;

const OverviewTab = styled.div`
  // Add specific styles for the overview tab content
`;

const ViewProfileButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }
`;

export default ParentDashboard;
```

---

## /src/pages/profile/ParentProfile/ParentProfile.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addStudent } from '../../../store/slices/profileSlice';
import { RootState } from '../../../store';
import { Student } from '../../../types/auth';  // Using the auth Student type consistently
import { useAuth } from '../../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';
import { getStudentProfile } from '../../../services/profileService';

const ParentProfile: React.FC = () => {
  const dispatch = useDispatch();
  const parent = useSelector((state: RootState) => state.profile.parent);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({});
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [studentsData, setStudentsData] = useState<Student[]>([]);

  const handleAddStudent = () => {
    if (newStudent.name) {
      dispatch(addStudent({
        id: Date.now().toString(),
        name: newStudent.name || '',
        grade: newStudent.grade || '',
        parentId: parent?.id || '',
        hasTakenAssessment: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      setShowAddStudent(false);
      setNewStudent({});
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    const fetchStudentsData = async () => {
      if (parent?.students) {
        try {
          const studentsPromises = parent.students.map(async studentId => {
            const student = await getStudentProfile(studentId);
            return student as Student;  // Ensure type consistency
          });
          const fetchedStudents = await Promise.all(studentsPromises);
          setStudentsData(fetchedStudents.filter((s): s is Student => s !== null));
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      }
    };

    fetchStudentsData();
  }, [parent?.students]);

  return (
    <Container>
      <ProfileBox>
        <Title>Parent Profile</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>

        <div className="students-section">
          <h3>My Students</h3>
          <button onClick={() => setShowAddStudent(true)}>Add Student</button>

          {showAddStudent && (
            <div className="add-student-form">
              <input
                type="text"
                placeholder="Student Name"
                value={newStudent.name || ''}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Grade"
                value={newStudent.grade || ''}
                onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
              />
              <button onClick={handleAddStudent}>Save</button>
              <button onClick={() => setShowAddStudent(false)}>Cancel</button>
            </div>
          )}

          <div className="students-list">
            {studentsData.map((student) => (
              <div key={student.id} className="student-card">
                <h4>{student.name}</h4>
                {student.grade && <p>Grade: {student.grade}</p>}
                <p>Learning Style: {student.learningStyle || 'Not assessed'}</p>
                <div className="progress-summary">
                  {student.hasTakenAssessment ? (
                    <div className="assessment-status">Assessment Complete</div>
                  ) : (
                    <div className="assessment-status">Assessment Needed</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProfileBox>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const ProfileBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  margin-bottom: 2rem;

  &:hover {
    background: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default ParentProfile;
```

---

## /src/pages/profile/ParentProfile/ParentProfileForm.tsx

```tsx
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { createParentProfile } from '../../../services/profileService';
import styled from 'styled-components';

interface FormData {
  displayName: string;
  phone: string;
  email: string;
}

export const ParentProfileForm: React.FC = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    displayName: currentUser?.displayName || '',
    phone: '',
    email: currentUser?.email || ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to create a profile');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('📝 Creating parent profile for:', currentUser.uid);
      await createParentProfile({
        uid: currentUser.uid,
        email: formData.email,
        displayName: formData.displayName,
        phone: formData.phone
      });
      setSuccess(true);
      console.log('✅ Parent profile created successfully');
    } catch (err) {
      console.error('❌ Error creating parent profile:', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessMessage>
        Profile created successfully! You can now add students to your account.
      </SuccessMessage>
    );
  }

  return (
    <FormContainer>
      <h2>Complete Your Parent Profile</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="displayName">Full Name</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="Your full name"
            value={formData.displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              displayName: e.target.value
            })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              phone: e.target.value
            })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              email: e.target.value
            })}
            required
            disabled={!!currentUser?.email}
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: #059669;
  background: #d1fae5;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  margin: 1rem 0;
`;

export default ParentProfileForm;
```

---

## /src/pages/profile/ParentProfile/dashboard/components/CurriculumApproval.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../../../types/auth';

interface CurriculumApprovalProps {
  studentData?: Student[];
}

const CurriculumApproval: React.FC<CurriculumApprovalProps> = ({ studentData }) => {
  return (
    <ApprovalContainer>
      <h3>Pending Curriculum Approvals</h3>
      {studentData?.map(student => (
        <ApprovalCard key={student.id}>
          <h4>{student.name}</h4>
          <ApprovalActions>
            <button className="approve">Approve</button>
            <button className="review">Review</button>
          </ApprovalActions>
        </ApprovalCard>
      ))}
    </ApprovalContainer>
  );
};

const ApprovalContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const ApprovalCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const ApprovalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  button {
    padding: 5px 15px;
    border-radius: 4px;
    border: none;
    cursor: pointer;

    &.approve {
      background: #4CAF50;
      color: white;
    }

    &.review {
      background: #FFA726;
      color: white;
    }
  }
`;

export default CurriculumApproval;
```

---

## /src/pages/profile/ParentProfile/dashboard/components/NotificationCenter.tsx

```tsx
import React from 'react';
import styled from 'styled-components';

const NotificationCenter: React.FC = () => {
  return (
    <NotificationContainer>
      <h3>Notifications</h3>
      <NotificationList>
        {/* Placeholder for notifications */}
        <NotificationItem>
          <span>No new notifications</span>
        </NotificationItem>
      </NotificationList>
    </NotificationContainer>
  );
};

const NotificationContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const NotificationList = styled.div`
  margin-top: 15px;
`;

const NotificationItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

export default NotificationCenter;
```

---

## /src/pages/profile/ParentProfile/components/StudentProgressTracker.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../../types/student';

interface StudentProgressTrackerProps {
  studentData?: Student[];
}

const StudentProgressTracker: React.FC<StudentProgressTrackerProps> = ({ studentData }) => {
  return (
    <ProgressContainer>
      <h3>Student Progress Overview</h3>
      {studentData?.map(student => (
        <ProgressCard key={student.id}>
          <h4>{student.name}</h4>
          <ProgressBar>
            <Progress width={75} />
          </ProgressBar>
        </ProgressCard>
      ))}
    </ProgressContainer>
  );
};

const ProgressContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ProgressCard = styled.div`
  margin: 15px 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
`;

const Progress = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
`;

export default StudentProgressTracker;
```

---

## /src/pages/profile/StudentProfile/StudentDashboard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import styled from 'styled-components';
import { FaGraduationCap, FaChartLine, FaBook } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { getStudentProfile } from '../../../services/profileService';
import { Student } from '../../../types/auth';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import LearningStyleChat from '../../../components/chat/LearningStyleChat';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

interface StudentData extends Student {
  recentActivities: Array<{
    id?: string;
    type: string;
    name: string;
    date: string;
  }>;
  progress: Array<{
    type: string;
    value: number;
  }>;
}

const StudentDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) {
        setError('Student ID not found');
        return;
      }

      try {
        const data = await getStudentProfile(id);
        if (data) {
          setStudentData({
            ...data,
            id: data.id || id,
            recentActivities: [],
            progress: []
          } as StudentData);
        } else {
          setError('Student not found');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <StyledLoadingContainer>
        <LoadingSpinner />
      </StyledLoadingContainer>
    );
  }

  if (error) {
    return <StyledErrorContainer>{error}</StyledErrorContainer>;
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <StyledHeader>
        <StyledHeaderLeft>
          <h1>Welcome, {studentData?.name}!</h1>
          <p>Grade {studentData?.grade}</p>
        </StyledHeaderLeft>
      </StyledHeader>

      <DashboardGrid>
        <MainSection>
          {!studentData?.hasTakenAssessment && (
            <AssessmentSection>
              <h2>Learning Style Assessment</h2>
              <p>Take your learning style assessment to get personalized recommendations.</p>
              <LearningStyleChat />
            </AssessmentSection>
          )}

          {studentData?.hasTakenAssessment && studentData.learningStyle && (
            <LearningStyleSection>
              <h2>Your Learning Style: {studentData.learningStyle}</h2>
              <p>Based on your assessment, we've customized your learning experience.</p>
            </LearningStyleSection>
          )}

          <ProgressSection>
            <h2>Recent Progress</h2>
            {/* Add progress visualization here */}
          </ProgressSection>
        </MainSection>
      </DashboardGrid>
    </m.div>
  );
};

const DashboardContainer = styled(m.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledLoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const StyledErrorContainer = styled.div`
  text-align: center;
  color: red;
  padding: 2rem;
`;

const StyledHeader = styled(m.header)`
  margin-bottom: 2rem;
`;

const StyledHeaderLeft = styled.div`
  h1 {
    margin: 0;
    color: var(--primary-color);
  }
  p {
    margin: 0.5rem 0 0;
    color: var(--text-secondary);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const MainSection = styled.div`
  display: grid;
  gap: 2rem;
`;

const AssessmentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const LearningStyleSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProgressSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export default StudentDashboard;
```

---

## /src/pages/profile/StudentProfile/StudentProfile.tsx

```tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import styled from "styled-components";
import CourseCard from "../../../components/CourseCard";

interface Course {
  title: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
}

const StudentProfile: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      console.error("Login error:", err);
    }
  };

  const courses: Course[] = [
    { title: "Introduction to Learning Styles", type: "Video Animated", category: "Learning Fundamentals" },
    { title: "Learning Style Quiz", type: "Quiz", category: "Assessment" },
    { title: "Visual Learning Techniques", type: "Mind Map", category: "Learning Techniques" }
  ];

  return (
    <Container>
      <ProfileBox>
        <Title>Student Profile</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>

        {/* Search Filter */}
        <input
          type="text"
          placeholder="Search courses..."
          className="border px-4 py-2 w-full mb-4 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        {/* Course List */}
        <div className="grid grid-cols-3 gap-4">
          {courses
            .filter((course) => course.title.toLowerCase().includes(filter.toLowerCase()))
            .map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
        </div>
      </ProfileBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const ProfileBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #2C3E50;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default StudentProfile;
```

---

## /src/pages/profile/StudentProfile/StudentProfileForm.tsx

```tsx
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import styled from 'styled-components';

interface StudentFormData {
  firstName: string;
  lastName: string;
  age: string;
  grade: string;
}

interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const StudentProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    age: '',
    grade: ''
  });

  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
    success: false
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      grade: ''
    });
    setFormState({
      loading: false,
      error: null,
      success: false
    });
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormState(prev => ({ ...prev, error: 'First and last name are required' }));
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 4 || parseInt(formData.age) > 18) {
      setFormState(prev => ({ ...prev, error: 'Age must be between 4 and 18' }));
      return false;
    }
    if (!formData.grade.trim()) {
      setFormState(prev => ({ ...prev, error: 'Grade is required' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parentId = auth.currentUser?.uid;
    
    if (!parentId) {
      setFormState(prev => ({ ...prev, error: 'Parent authentication required' }));
      return;
    }

    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await addDoc(collection(db, 'students'), {
        ...formData,
        parentId,
        createdAt: new Date().toISOString()
      });
      
      setFormState({ loading: false, error: null, success: true });
      setTimeout(resetForm, 3000);
    } catch (error) {
      setFormState({
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        success: false
      });
    }
  };

  return (
    <FormContainer>
      {formState.success && (
        <SuccessMessage>Student added successfully!</SuccessMessage>
      )}
      {formState.error && (
        <ErrorMessage>{formState.error}</ErrorMessage>
      )}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>First Name *</Label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Last Name *</Label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Age *</Label>
          <Input
            type="number"
            min="4"
            max="18"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Grade *</Label>
          <Input
            type="text"
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <SubmitButton type="submit" disabled={formState.loading}>
          {formState.loading ? 'Adding Student...' : 'Add Student'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: var(--secondary-color);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

const SuccessMessage = styled(Message)`
  background: var(--success-color);
  color: white;
`;

const ErrorMessage = styled(Message)`
  background: var(--danger-color);
  color: white;
`;

export default StudentProfileForm;
```

---

## /src/pages/profile/components/LearningStyleInsights.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../types/student';

interface LearningStyleInsightsProps {
  studentData?: Student[];
}

const LearningStyleInsights: React.FC<LearningStyleInsightsProps> = ({ studentData }) => {
  return (
    <InsightsContainer>
      <h3>Learning Style Analytics</h3>
      {studentData?.map(student => (
        <InsightCard key={student.id}>
          <h4>{student.name}</h4>
          <InsightContent>
            <div>Learning Style: {student.learningStyle || 'Not assessed'}</div>
            <div>Recommended Activities: {student.recommendedActivities?.length || 0}</div>
          </InsightContent>
        </InsightCard>
      ))}
    </InsightsContainer>
  );
};

const InsightsContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const InsightCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const InsightContent = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default LearningStyleInsights;
```

---

## /src/pages/__tests__/About.test.tsx

```tsx
// File: /src/pages/__tests__/About.test.tsx
// Description: Unit test for About page component.

import { screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { renderWithProviders } from "../../test/testUtils";
import About from "../About";

describe('About Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithProviders(<About />);
  });

  test("renders About component with correct content", () => {
    expect(screen.getByRole('heading', { name: /about geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/Geaux Academy is an interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery./i)).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Contact.test.tsx

```tsx
// File: /src/pages/__tests__/Contact.test.tsx
// Description: Unit test for Contact page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Contact from "../Contact";

describe('Contact Component', () => {
  test("renders Contact component with correct content", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByText(/Feel free to reach out to us with any questions or feedback./i)).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Curriculum.test.tsx

```tsx
// File: /src/pages/__tests__/Curriculum.test.tsx
// Description: Unit test for Curriculum page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Curriculum from "../Curriculum";

describe('Curriculum Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Curriculum component with correct content", () => {
    renderWithProviders(<Curriculum />);
    expect(screen.getByRole('heading', { name: /curriculum/i })).toBeInTheDocument();
    expect(screen.getByText(/Our curriculum is designed to adapt to your learning style and pace./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google to get started/i })).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Features.test.tsx

```tsx
// File: /src/pages/__tests__/Features.test.tsx
// Description: Unit test for Features page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Features from "../Features";

describe('Features Component', () => {
  test("renders Features component with correct content", () => {
    renderWithProviders(<Features />);
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("AI-powered learning style assessment")).toBeInTheDocument();
    expect(screen.getByText("Personalized learning paths")).toBeInTheDocument();
    expect(screen.getByText("Real-time progress tracking")).toBeInTheDocument();
    expect(screen.getByText("Interactive dashboard")).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Home.test.tsx

```tsx
// File: /src/pages/__tests__/Home.test.tsx
// Description: Unit test for Home page component.

import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders, mockLoginWithGoogle } from "../../test/testUtils";
import Home from "../Home";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Home component with correct content", () => {
    renderWithProviders(<Home />, { withRouter: true });
    expect(screen.getByRole('heading', { name: /welcome to geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/empowering personalized learning through ai/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ready to start your learning journey\?/i })).toBeInTheDocument();
  });

  test("handles Google login", async () => {
    renderWithProviders(<Home />, { withRouter: true });
    const loginButton = screen.getByRole('button', { name: /sign in with google/i });
    
    fireEvent.click(loginButton);
    
    expect(mockLoginWithGoogle).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
```

---

## /src/pages/__tests__/LearningStyles.test.tsx

```tsx
// File: /src/pages/__tests__/LearningStyles.test.tsx
// Description: Unit test for Learning Styles page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import LearningStyles from "../LearningStyles";

describe('LearningStyles Component', () => {
  test("renders Learning Styles component with correct content", () => {
    renderWithProviders(<LearningStyles />, { withRouter: true });
    expect(screen.getByText("Learning Styles")).toBeInTheDocument();
    expect(screen.getByText("Discover your preferred learning style and how Geaux Academy can help you learn more effectively.")).toBeInTheDocument();
  });
});
```

---

## /src/pages/styles/Contact.css

```css
.contact-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
```

---

## /src/server/main.py

```plaintext
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.student_routes import router as student_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your Vue.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## /src/server/routes/studentRoutes.js

```javascript
const express = require('express');
const router = express.Router();

// ...existing code...

router.post('/students', async (req, res) => {
  try {
    const { name } = req.body;
    // Here you would typically create a new student in your database
    // This is a mock response
    const newStudent = {
      id: Date.now(),
      name,
      createdAt: new Date()
    };
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: `Failed to create student profile: ${error.message}` });
  }
});

router.get('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    // Here you would typically fetch the student from your database
    // This is a mock response
    const student = {
      id: student_id,
      name: 'John Doe',
      createdAt: new Date()
    };
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: `Failed to get student profile: ${error.message}` });
  }
});

router.put('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    const { name } = req.body;
    // Here you would typically update the student in your database
    // This is a mock response
    const updatedStudent = {
      id: student_id,
      name,
      createdAt: new Date()
    };
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: `Failed to update student profile: ${error.message}` });
  }
});

router.delete('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    // Here you would typically delete the student from your database
    // This is a mock response
    res.status(200).json({ detail: `Student ${student_id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete student profile: ${error.message}` });
  }
});

// ...existing code...

module.exports = router;
```

---

## /src/server/routes/student_routes.py

```plaintext
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import time

router = APIRouter()

class StudentCreate(BaseModel):
    name: str

class StudentUpdate(BaseModel):
    name: str

class Student(StudentCreate):
    id: int
    created_at: datetime

students_db = {}

@router.post("/students", response_model=Student)
async def create_student(student: StudentCreate):
    try:
        new_student = Student(
            id=int(time.time()),
            name=student.name,
            created_at=datetime.now()
        )
        students_db[new_student.id] = new_student
        return new_student
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create student profile")

@router.get("/students/{student_id}", response_model=Student)
async def get_student(student_id: int):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: int, student_update: StudentUpdate):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    updated_student = Student(id=student_id, name=student_update.name, created_at=student.created_at)
    students_db[student_id] = updated_student
    return updated_student

@router.delete("/students/{student_id}")
async def delete_student(student_id: int):
    student = students_db.pop(student_id, None)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"detail": "Student deleted successfully"}
```

---

## /src/store/index.ts

```typescript
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';

const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
```

---

## /src/store/slices/profileSlice.ts

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Parent, Student } from '../../types/profiles';

interface ProfileState {
  parent: Parent | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  parent: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setParentProfile: (state, action: PayloadAction<Parent>) => {
      state.parent = action.payload;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      if (state.parent) {
        state.parent.students.push(action.payload);
      }
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      if (state.parent) {
        const index = state.parent.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.parent.students[index] = action.payload;
        }
      }
    },
  },
});

export const { setParentProfile, addStudent, updateStudent } = profileSlice.actions;
export default profileSlice.reducer;
```

---

## /src/config/env.js

```javascript
const config = {
  AZURE_ENDPOINT: process.env.REACT_APP_AZURE_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.openai.azure.com/',
  AZURE_COGNITIVE_ENDPOINT: process.env.REACT_APP_AZURE_COGNITIVE_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.cognitiveservices.azure.com/',
  AZURE_DEPLOYMENT_ENDPOINT: process.env.REACT_APP_AZURE_DEPLOYMENT_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.services.ai.azure.com/models',
  MODEL_NAME: process.env.REACT_APP_MODEL_NAME || 'gpt-4',
  AZURE_API_KEY: process.env.REACT_APP_AZURE_API_KEY || process.env.VITE_OPENAI_API_KEY
};

export default config;
```

---

## /src/types/auth.ts

```typescript
import { UserCredential } from 'firebase/auth';

// Common types for auth context and components
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  metadata?: {
    lastSignInTime?: string;
    creationTime?: string;
  };
}

export interface AuthError {
  code?: string;
  message: string;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  setAuthError: (error: string | null) => void;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
  createdAt: string;
  updatedAt: string;
  learningStyle?: string;
  assessmentResults?: object;
}

export interface Parent {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  students: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthRouteProps {
  children: React.ReactNode;
}

export interface PrivateRouteProps {
  children: React.ReactNode;
}

declare global {
  interface WindowEventMap {
    'firebase-auth-worker-status': CustomEvent<{
      success: boolean;
      isSecure: boolean;
      supportsServiceWorker: boolean;
      error?: string;
    }>;
    'firebase-auth-error': CustomEvent<{
      error: string;
      fallbackToRedirect?: boolean;
      status?: number;
    }>;
    'firebase-auth-popup-ready': CustomEvent<{
      secure: boolean;
    }>;
    'firebase-auth-success': CustomEvent<{
      status: number;
    }>;
    'firebase-auth-security': CustomEvent<{
      secure: boolean;
    }>;
  }
}

export {};
```

---

## /src/types/css.d.ts

```typescript
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const css: { [key: string]: string };
  export default css;
}
```

---

## /src/types/dashboard.ts

```typescript
export interface StudentProgress {
  completionRate: number;
  timeSpent: number;
  accuracy: number;
  subjectProgress: {
    [subject: string]: {
      completed: number;
      total: number;
    };
  };
}

export interface LearningStyle {
  visual: number;
  auditory: number;
  reading: number;
  kinesthetic: number;
  recommendations: string[];
}

export interface DashboardState {
  activeTab: 'overview' | 'progress' | 'learning-styles' | 'curriculum';
  studentData: {
    progress: StudentProgress;
    learningStyle: LearningStyle;
  } | null;
}
```

---

## /src/types/firebase.d.ts

```typescript
// File: /src/types/firebase.d.ts
// Description: Type declarations for Firebase modules
// Author: GitHub Copilot
// Created: 2024-02-12

declare module 'firebase/app' {
  export * from '@firebase/app';
}

declare module 'firebase/auth' {
  export * from '@firebase/auth';
}

declare module 'firebase/firestore' {
  export * from '@firebase/firestore';
}

declare module 'firebase/analytics' {
  export * from '@firebase/analytics';
}

declare module 'firebase/messaging' {
  export * from '@firebase/messaging';
}
```

---

## /src/types/profiles.ts

```typescript
// Base Types
export interface BaseProfile {
    uid: string;
    email: string;
    displayName: string;
    createdAt: string;
    updatedAt: string;
}

// Parent Profile Types
export interface Parent extends BaseProfile {
    phone?: string;
    students: string[];
}

// Student Profile Types
export interface Student {
    id: string;
    parentId: string;
    name: string;
    grade: string;
    learningStyle?: LearningStyle;
    hasTakenAssessment: boolean;
    assessmentStatus?: string;
    createdAt: string;
    updatedAt: string;
    recommendedActivities?: string[];
    progress?: StudentProgress[];
    assessmentResults?: AssessmentResult[];
}

// Progress Types
export interface StudentProgress {
    courseId: string;
    completed: number;
    total: number;
    lastAccessed: string;
}

// Assessment Types
export interface AssessmentResult {
    date: string;
    score: number;
    subject: string;
    details: Record<string, unknown>;
}

// Learning Style Types
export interface LearningStyle {
    type: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
    strengths: string[];
    recommendations: string[];
}
```

---

## /src/types/service-worker.d.ts

```typescript

```

---

## /src/types/student.ts

```typescript
export interface Student {
  id: string;
  name: string;
  grade?: string;
  age?: number;
  learningStyle?: string;
  hasTakenAssessment: boolean;
  progress?: Array<{
    id: string;
    type: string;
    name: string;
    date: string;
  }>;
  recommendedActivities?: string[];
  createdAt?: string;
  updatedAt?: string;
  parentId: string;
}
```

---

## /src/types/styled.d.ts

```typescript
import 'styled-components';
import { Theme } from '@mui/material/styles';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    breakpoints: Theme['breakpoints'] & {
      mobile: string;
      tablet: string;
      desktop: string;
      large: string;
    };
    spacing: Theme['spacing'] & {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    colors: {
      border: string;
      text: string;
      background: {
        hover: string;
      };
      error: {
        main: string;
        light: string;
      };
    };
    borderRadius: {
      default: string;
    };
  }
}
```

---

## /src/types/types.ts

```typescript
// File: /types/types.ts
// Description: Core type definitions for user profiles, assessments, and course progress
// Author: Geaux Academy Team
// Created: 2024
export interface ParentProfile {
  uid: string;
  email: string;
  displayName: string;
  students: StudentProfile[];
}

export interface StudentProfile {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  age: number;
  grade: string;
  learningStyle?: LearningStyle;
  assessmentResults?: AssessmentResult[];
  progress?: CourseProgress[];
}

export interface LearningStyle {
  type: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
  strengths: string[];
  recommendations: string[];
}

export interface AssessmentResult {
  date: string;
  score: number;
  subject: string;
  details: Record<string, unknown>;
}

export interface CourseProgress {
  courseId: string;
  completed: number;
  total: number;
  lastAccessed: string;
}
```

---

## /src/types/userTypes.ts

```typescript
export interface BaseProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentProfile extends BaseProfile {
  role: 'parent';
  phone?: string;
  students: StudentProfile[];
}

export interface StudentProfile extends BaseProfile {
  role: 'student';
  parentId: string;
  grade: string;
  dateOfBirth: Date;
}
```

---

## /src/services/api.js

```javascript
import axios from 'axios';

import { auth } from '../firebase/config';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://learn.geaux.app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true // Enable sending cookies in cross-origin requests
});

// Add request interceptor for auth headers
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true); // Get a fresh token
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.removeItem('token');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized errors and try token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out...", refreshError);
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
      }
    }

    // Handle other error cases
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      request: error.request,
      message: error.message
    });

    // Enhanced error handling
    let errorMessage = "An error occurred. Please try again.";
    switch (error.response?.status) {
      case 400:
        errorMessage = "Bad request. Please check your input.";
        break;
      case 403:
        errorMessage = "You don't have permission to perform this action.";
        break;
      case 404:
        errorMessage = "The requested resource was not found.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
        break;
      case 503:
        errorMessage = "Service unavailable. Please try again later.";
        break;
      default:
        errorMessage = `Error: ${error.message}`;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
```

---

## /src/services/cheshireService.ts

```typescript
import axios, { AxiosInstance } from 'axios';
import { auth } from '../firebase/config';

// Use environment variable if set, otherwise fall back to the production URL
const CHESHIRE_API_URL = import.meta.env.VITE_CHESHIRE_API_URL || 'https://cheshire.geaux.app';
const CHESHIRE_DEBUG = import.meta.env.VITE_CHESHIRE_DEBUG === 'true';

// Create axios instance with default configuration
const cheshireAxios: AxiosInstance = axios.create({
  baseURL: CHESHIRE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000
});

// Add authentication interceptor
cheshireAxios.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Auth interceptor error:', error);
    return Promise.reject(error);
  }
});

// Add response interceptor for better error handling
cheshireAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (CHESHIRE_DEBUG) {
      console.error('Cheshire API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Unable to connect to Cheshire API:', error);
      console.error('Please ensure the TIPI container is running and accessible at:', CHESHIRE_API_URL);
    }
    return Promise.reject(error);
  }
);

interface CheshireResponse {
  text: string;
  response: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

interface CheshireUser {
  username: string;
  permissions: {
    CONVERSATION: string[];
    MEMORY: string[];
    STATIC: string[];
    STATUS: string[];
  };
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface CheshireError {
  message: string;
  code?: string;
  response?: {
    status: number;
    data: unknown;
  };
  config?: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
}

export class CheshireService {
  private static async getAuthHeaders() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }
    const token = await user.getIdToken();
    return {
      Authorization: `Bearer ${token}`
    };
  }

  private static async getFirebaseToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      return null;
    }
  }

  static async checkTipiHealth(): Promise<{ status: string; version: string }> {
    try {
      const response = await cheshireAxios.get('/');
      return {
        status: 'healthy',
        version: response.data.version || 'unknown'
      };
    } catch (error) {
      const err = error as CheshireError;
      console.error('TIPI health check failed:', err);
      if (err.code === 'ERR_NETWORK') {
        throw new Error('TIPI container is not accessible. Please ensure it is running.');
      }
      throw err;
    }
  }

  static async initialize(): Promise<void> {
    try {
      // Check TIPI container health
      await this.checkTipiHealth();
      
      console.log('✅ Cheshire Cat service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Cheshire Cat service:', error);
      throw error;
    }
  }

  static async checkConnection(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      await cheshireAxios.get('/', { headers });
      return true;
    } catch (error) {
      console.error('Cheshire API Connection Error:', error);
      return false;
    }
  }

  static async sendChatMessage(message: string, userId: string, chatId: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await cheshireAxios.post<CheshireResponse>(
        '/message',
        { text: message },
        { headers }
      );
      
      return {
        data: response.data.response,
        memories: response.data.memories
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw this.getErrorMessage(error);
    }
  }

  static async createCheshireUser(firebaseUid: string, email: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const payload: CheshireUser = {
        username: email,
        permissions: {
          CONVERSATION: ["WRITE", "EDIT", "LIST", "READ", "DELETE"],
          MEMORY: ["READ", "LIST"],
          STATIC: ["READ"],
          STATUS: ["READ"]
        }
      };

      await cheshireAxios.post('/users/', payload, { headers });
    } catch (error) {
      console.error('Error creating Cheshire user:', error);
      throw this.getErrorMessage(error);
    }
  }

  static getErrorMessage(error: CheshireError): string {
    if (error.message === 'Authentication required') {
      return "Please log in to continue.";
    }
    if (error.message === 'Failed to obtain Cheshire auth token') {
      return "Unable to connect to the chat service. Please try again later.";
    }
    if (error.code === 'ECONNABORTED') {
      return "The request timed out. Please try again.";
    }
    if (error.code === 'ERR_NETWORK') {
      if (error.message.includes('CORS')) {
        return "Unable to connect to the chat service due to CORS restrictions. Please contact support.";
      }
      return "Network error - Unable to connect to the chat service. Please check your connection and try again.";
    }
    if (error.response?.status === 401) {
      return "Your session has expired. Please try again.";
    }
    if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }
    if (error.response?.status === 404) {
      return "The chat service is not available. Please check if the service is running.";
    }
    return "Sorry, I'm having trouble connecting to the chat service. Please try again later.";
  }
}
```

---

## /src/services/firestore.ts

```typescript
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function getData(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function setData(collectionName: string, docId: string, data: any) {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, data, { merge: true });
  return true;
}

// ...other helper functions as needed...
```

---

## /src/services/openai.js

```javascript
import axios from 'axios';

const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export default openaiClient;
```

---

## /src/services/profileService.ts

```typescript
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { Parent, Student, LearningStyle } from "../types/profiles";

// Cache for storing profiles
const profileCache = new Map();

// Helper to check online status
const isOnline = () => navigator.onLine;

// Helper to handle offline errors
const handleOfflineError = (operation: string) => {
  const error = new Error(`Cannot ${operation} while offline`);
  error.name = 'OfflineError';
  return error;
};

// ✅ Create Parent Profile
export const createParentProfile = async (parentData: Partial<Parent>): Promise<string> => {
  try {
    if (!parentData.uid) throw new Error('User ID is required');
    
    const parentRef = doc(db, 'parents', parentData.uid);
    await setDoc(parentRef, {
      ...parentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      students: []
    });
    
    console.log('✅ Parent profile created successfully:', parentData.uid);
    return parentData.uid;
  } catch (error) {
    console.error('❌ Error creating parent profile:', error);
    throw error;
  }
};

// ✅ Fetch Parent Profile
export const getParentProfile = async (userId: string): Promise<Parent | null> => {
  try {
    console.log('🔍 Fetching parent profile for:', userId);

    // Check cache first
    if (profileCache.has(`parent_${userId}`)) {
      return profileCache.get(`parent_${userId}`);
    }

    const docRef = doc(db, 'parents', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const parentProfile: Parent = {
        uid: data.uid || userId,
        email: data.email || '',
        displayName: data.displayName || '',
        students: data.students || [],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      console.log('✅ Parent profile found:', parentProfile);
      // Cache the result
      profileCache.set(`parent_${userId}`, parentProfile);
      return parentProfile;
    }
    
    console.log('ℹ️ No parent profile found, creating one...');
    // If no profile exists, create one
    await createParentProfile({ uid: userId });
    return getParentProfile(userId); // Retry fetch after creation
    
  } catch (error) {
    if (!isOnline()) {
      console.warn('Offline: Using cached data if available');
      return profileCache.get(`parent_${userId}`) || null;
    }
    console.error('❌ Error fetching parent profile:', error);
    throw error;
  }
};

// ✅ Fetch Student Profile
export const getStudentProfile = async (studentId: string): Promise<Student> => {
  try {
    // Check cache first
    if (profileCache.has(`student_${studentId}`)) {
      return profileCache.get(`student_${studentId}`);
    }

    const studentRef = doc(db, "students", studentId);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      throw new Error("Student profile not found");
    }

    const studentData = studentDoc.data() as Student;
    // Cache the result
    profileCache.set(`student_${studentId}`, studentData);
    return studentData;
  } catch (error) {
    if (!isOnline()) {
      console.warn('Offline: Using cached data if available');
      return profileCache.get(`student_${studentId}`) || null;
    }
    throw error;
  }
};

// ✅ Add Student Profile
export const addStudentProfile = async (parentId: string, studentData: {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}) => {
  try {
    console.log('📝 Adding student profile for parent:', parentId);
    
    // Add the student to the students collection
    const studentRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Update the parent's students array
    const parentRef = doc(db, 'parents', parentId);
    const parentDoc = await getDoc(parentRef);

    if (parentDoc.exists()) {
      const currentStudents = parentDoc.data().students || [];
      await updateDoc(parentRef, {
        students: [...currentStudents, studentRef.id],
        updatedAt: new Date().toISOString()
      });
    }

    console.log('✅ Student profile added successfully:', studentRef.id);
    return studentRef.id;
  } catch (error) {
    console.error('❌ Error adding student profile:', error);
    throw error;
  }
};

// ✅ Update Student's Assessment Status
export const updateStudentAssessmentStatus = async (studentId: string, status: string) => {
  if (!isOnline()) {
    throw handleOfflineError('update assessment status');
  }

  const studentRef = doc(db, "students", studentId);
  try {
    await updateDoc(studentRef, {
      hasTakenAssessment: status === 'completed',
      assessmentStatus: status,
      updatedAt: new Date().toISOString(),
    });

    // Update cache
    const cachedData = profileCache.get(`student_${studentId}`);
    if (cachedData) {
      profileCache.set(`student_${studentId}`, {
        ...cachedData,
        hasTakenAssessment: status === 'completed',
        assessmentStatus: status,
        updatedAt: new Date().toISOString()
      });
    }
    console.log(`Assessment status updated to: ${status}`);
  } catch (error) {
    console.error("Error updating assessment status:", error);
    throw new Error("Failed to update assessment status");
  }
};

// ✅ Save Learning Style
export const saveLearningStyle = async (studentId: string, learningStyle: LearningStyle): Promise<void> => {
  if (!isOnline()) {
    throw handleOfflineError('save learning style');
  }

  try {
    console.log('📝 Saving learning style for student:', studentId);
    const studentRef = doc(db, 'students', studentId);
    
    await updateDoc(studentRef, {
      learningStyle,
      updatedAt: new Date().toISOString()
    });

    // Update cache
    const cachedData = profileCache.get(`student_${studentId}`);
    if (cachedData) {
      profileCache.set(`student_${studentId}`, {
        ...cachedData,
        learningStyle,
        updatedAt: new Date().toISOString()
      });
    }
    
    console.log('✅ Learning style saved successfully');
  } catch (error) {
    console.error('❌ Error saving learning style:', error);
    throw error;
  }
};

// Listen for online/offline events to manage cache
window.addEventListener('online', () => {
  console.info('Back online. Syncing data...');
  // Could add sync logic here if needed
});

window.addEventListener('offline', () => {
  console.warn('Gone offline. Using cached data...');
});

export class ProfileService {
  async getUserProfile(userId: string): Promise<any> {
    // ...existing API call logic...
    // Example:
    const response = await fetch(`/api/profiles/${userId}`);
    return response.json();
  }
}
```

---

## /src/theme/index.tsx

```tsx
// File: /src/theme/index.ts
// Description: Custom theme including breakpoint helpers

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

interface CustomBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  large: string;
  keys: (number | Breakpoint)[];
  up: (key: number | Breakpoint) => string;
  down: (key: number | Breakpoint) => string;
  between: (start: number | Breakpoint, end: number | Breakpoint) => string;
  only: (key: number | Breakpoint) => string;
}

export const breakpoints: CustomBreakpoints = {
  mobile: "0px",
  tablet: "768px",
  desktop: "1024px",
  large: "1440px",
  keys: ["xs", "sm", "md", "lg", "xl"],
  up: (key: number | Breakpoint) => {
    // implement using a strategy that works for both numbers and defined breakpoints
    // For simplicity, if key is number then convert to string with px otherwise use a mapping.
    if (typeof key === "number") {
      return `${key}px`;
    }
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  },
  down: (key: number | Breakpoint) => {
    if (typeof key === "number") {
      return `${key}px`;
    }
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  },
  between: (start: number | Breakpoint, end: number | Breakpoint) => {
    const getValue = (v: number | Breakpoint): number =>
      typeof v === "number" ? v : ({ xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }[v]);
    return `${getValue(start)}px and ${getValue(end)}px`;
  },
  only: (key: number | Breakpoint) => {
    if (typeof key === "number") return `${key}px`;
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  }
};
```

---

## /src/theme/theme.js

```javascript
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
      dark: '#9E7D39', // Darker gold for hover states
      light: '#D4B673', // Lighter gold for accents
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
      dark: '#725640', // Darker accent for hover states
      light: '#A68B74', // Lighter accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
      secondary: '#666666', // Secondary text
    },
    error: {
      main: '#E74C3C',
      dark: '#C0392B',
    },
    warning: {
      main: '#F1C40F',
      dark: '#D4AC0D',
    },
    info: {
      main: '#3498DB',
      dark: '#2980B9',
    },
    success: {
      main: '#2ECC71',
      dark: '#27AE60',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 4, // This will multiply the spacing by 4px (MUI's default spacing unit)
});

// Create styled-components theme with the same values
export const styledTheme = {
  palette: {
    ...muiTheme.palette,
  },
  breakpoints: {
    ...muiTheme.breakpoints.values,
  },
  spacing: (factor) => `${0.25 * factor}rem`, // Keep rem units for styled-components
};
```

---

## /src/theme/theme.ts

```typescript
// File: /src/theme/theme.ts
// Description: Unified theme configuration for MUI and styled-components
// Author: GitHub Copilot
// Created: 2024-02-12

import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';

// Create the base MUI theme
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
      dark: '#9E7D39', // Darker gold for hover states
      light: '#D4B673', // Lighter gold for accents
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
      dark: '#725640', // Darker accent for hover states
      light: '#A68B74', // Lighter accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
      secondary: '#666666', // Secondary text
    },
    error: {
      main: '#E74C3C',
      dark: '#C0392B',
      light: '#F9EBEA',
    },
    warning: {
      main: '#F1C40F',
      dark: '#D4AC0D',
      light: '#FEF9E7',
    },
    info: {
      main: '#3498DB',
      dark: '#2980B9',
      light: '#EBF5FB',
    },
    success: {
      main: '#2ECC71',
      dark: '#27AE60',
      light: '#E8F8F5',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 4, // Base spacing unit (4px)
});

// Create spacing utility that returns rem values
const createSpacing = () => {
  const spacingFn = (value: number): string => `${0.25 * value}rem`;
  return Object.assign(spacingFn, {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
  });
};

// Create the styled-components theme that extends MUI theme
export const styledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px',
  },
  spacing: createSpacing(),
  colors: {
    border: '#e0e0e0',
    text: muiTheme.palette.text.primary,
    background: {
      hover: '#f5f5f5',
    },
    error: {
      main: muiTheme.palette.error.main,
      light: muiTheme.palette.error.light,
    },
  },
  borderRadius: {
    default: '4px',
  },
};
```

---

## /src/components/CourseCard.tsx

```tsx
import React from "react";
import { FaVideo, FaListAlt, FaBrain } from "react-icons/fa";
import Card from "./common/Card";
import styled from "styled-components";

interface CourseCardProps {
  title: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
}

const iconMap = {
  "Video Animated": <FaVideo style={{ color: "#9333ea" }} />,
  "Quiz": <FaListAlt style={{ color: "#eab308" }} />,
  "Mind Map": <FaBrain style={{ color: "#ec4899" }} />,
};

const StyledCard = styled(Card)`
  border-left: 4px solid ${props => props.theme.palette.primary.main};
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const IconWrapper = styled.div`
  font-size: 1.875rem;
`;

const CategoryText = styled.p`
  color: ${props => props.theme.palette.text.secondary};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const CourseCard: React.FC<CourseCardProps> = ({ title, type, category }) => {
  return (
    <StyledCard title={title} description={type}>
      <IconWrapper>{iconMap[type]}</IconWrapper>
      <CategoryText>{category}</CategoryText>
    </StyledCard>
  );
};

export default CourseCard;
```

---

## /src/components/GoogleLoginButton.test.tsx

```tsx
/** @jest-environment jsdom */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/testUtils';
import GoogleLoginButton from './GoogleLoginButton';

describe('GoogleLoginButton', () => {
  const mockHandleGoogleLogin = jest.fn();
  const mockDismissError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in button with correct accessibility', () => {
    renderWithProviders(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} />);
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    renderWithProviders(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} loading={true} />);
    const button = screen.getByRole('button', { name: /signing in/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Signing in...');
  });

  it('displays error message with dismiss button', () => {
    const errorMessage = 'Test error message';
    renderWithProviders(
      <GoogleLoginButton 
        handleGoogleLogin={mockHandleGoogleLogin} 
        error={errorMessage}
        onDismissError={mockDismissError} 
      />
    );
    
    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    expect(screen.getByRole('button', { name: /dismiss error/i })).toBeInTheDocument();
  });

  it('calls onDismissError when dismiss button is clicked', async () => {
    const errorMessage = 'Test error message';
    renderWithProviders(
      <GoogleLoginButton 
        handleGoogleLogin={mockHandleGoogleLogin} 
        error={errorMessage}
        onDismissError={mockDismissError} 
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /dismiss error/i }));
    await waitFor(() => {
      expect(mockDismissError).toHaveBeenCalledTimes(1);
    });
  });

  it('calls handleGoogleLogin when sign in button is clicked', async () => {
    renderWithProviders(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));
    await waitFor(() => {
      expect(mockHandleGoogleLogin).toHaveBeenCalled();
    });
  });
});
```

---

## /src/components/GoogleLoginButton.tsx

```tsx
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React from 'react';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';

interface GoogleLoginButtonProps {
  handleGoogleLogin: () => Promise<void>;
  loading?: boolean;
  error?: string;
  onDismissError?: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  handleGoogleLogin,
  loading = false,
  error,
  onDismissError
}): JSX.Element => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const handleClick = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, provider);
      await handleGoogleLogin();
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  return (
    <ButtonContainer>
      {error && (
        <ErrorMessage role="alert">
          <span>{error}</span>
          {onDismissError && (
            <DismissButton 
              onClick={onDismissError}
              aria-label="dismiss error"
            >
              ✕
            </DismissButton>
          )}
        </ErrorMessage>
      )}
      <LoginButton 
        onClick={handleClick}
        disabled={loading}
        aria-label={loading ? 'Signing in...' : 'Sign in with Google'}
      >
        <FcGoogle />
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </LoginButton>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 4px;
  background: white;
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.palette.action?.hover || '#f5f5f5'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.palette.error.light};
  color: ${({ theme }) => theme.palette.error.main};
  border-radius: 4px;
  font-size: 0.875rem;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  margin-left: ${({ theme }) => theme.spacing.sm};

  &:hover {
    opacity: 0.8;
  }
`;

export default GoogleLoginButton;
```

---

## /src/components/HomeContainer.js

```javascript
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    h2 { 
      font-size: 1.5rem; 
    }
  }
`;

export const StyledLink = styled(Link).attrs(({ disabled }) => ({
  role: 'button',
  'aria-disabled': disabled,
}))`
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-size: 1.1rem;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--secondary-color);
  }

  &:focus-visible {
    outline: 2px dashed var(--secondary-color);
    outline-offset: 4px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
```

---

## /src/components/Login.tsx

```tsx
import React, { useState } from 'react';
import { useLocation, Location, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';

interface LocationState {
  from?: {
    pathname: string;
  };
  error?: string;
}

const Login: React.FC = (): JSX.Element => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as Location & { state: LocationState };
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>Welcome Back</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {location.state?.error && (
          <ErrorMessage>{location.state.error}</ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input 
              type="password" 
              id="password" 
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </LoginButton>
        </Form>

        <Divider>or</Divider>

        <GoogleButton onClick={handleGoogleLogin} disabled={loading}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </LoginBox>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background);
  padding: 1rem;
`;

const LoginBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &:disabled {
    background-color: #f5f5f5;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
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

const Divider = styled.div`
  margin: 1.5rem 0;
  text-align: center;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background-color: #ddd;
  }
  
  &::before {
    left: 0;
  }
  
  &::after {
    right: 0;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f8f8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export default Login;
```

---

## /src/components/Message.tsx

```tsx
import React from 'react';
import styled from 'styled-components';

interface MessageProps {
  sender: 'user' | 'bot';
  children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ sender, children }) => {
  return (
    <MessageContainer $sender={sender}>
      {children}
    </MessageContainer>
  );
};

const MessageContainer = styled.div<{ $sender: 'user' | 'bot' }>`
  margin: var(--spacing-xs) 0;
  padding: var(--spacing-sm);
  max-width: 80%;
  background: ${({ $sender }) => ($sender === 'user' ? "var(--accent-color)" : "var(--white)")};
  color: ${({ $sender }) => ($sender === 'user' ? "var(--white)" : "var(--text-color)")};
  border-radius: var(--border-radius);
  align-self: ${({ $sender }) => ($sender === 'user' ? "flex-end" : "flex-start")};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export default Message;
```

---

## /src/components/Mission.tsx

```tsx
import styled from 'styled-components';
import React from 'react';

const MissionContainer = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const MissionText = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #444;
`;

interface MissionProps {
  text: string;
}

export const Mission: React.FC<MissionProps> = ({ text }) => {
  return (
    <MissionContainer>
      <MissionText>{text}</MissionText>
    </MissionContainer>
  );
};

export default Mission;
```

---

## /src/components/PrivateRoute.tsx

```tsx
// File: /src/components/PrivateRoute.tsx
// Description: A route component that protects routes from unauthorized access
// Author: GitHub Copilot

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }): JSX.Element => {
  const { currentUser, isAuthReady } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (!isAuthReady) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // If not authenticated, redirect to login with current location
  if (!currentUser && isAuthReady) {
    // Only redirect if we're not already on the login page
    if (location.pathname !== '/login') {
      return (
        <Navigate 
          to="/login" 
          state={{ 
            from: location,
            error: "Please sign in to access this page" 
          }} 
          replace 
        />
      );
    }
  }

  // If authenticated, render the protected route
  return <>{children}</>;
};

export default PrivateRoute;
```

---

## /src/components/UserProfileCard.tsx

```tsx
import React from 'react';
import Card from '../common/Card';

interface UserProfileCardProps {
  username: string;
  role: string;
  avatar?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ username, role, avatar }) => {
  return (
    <Card
      title="User Profile"
      icon={avatar}
      className="user-profile-card"
    >
      <div className="user-info">
        <label>Username:</label>
        <p>{username}</p>
      </div>
      <div className="user-info">
        <label>Role:</label>
        <p>{role}</p>
      </div>
    </Card>
  );
};

export default UserProfileCard;
```

---

## /src/components/layout/Footer.tsx

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './layout.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        <div className={styles['footer-column']}>
          <h3>About</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/curriculum">Curriculum</Link></li>
          </ul>
        </div>

        <div className={styles['footer-column']}>
          <h3>Learning</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/learning-styles">Learning Styles</Link></li>
            <li><Link to="/learning-plan">Learning Plan</Link></li>
            <li><Link to="/assessment">Assessment</Link></li>
          </ul>
        </div>

        <div className={styles['footer-column']}>
          <h3>Support</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><a href="mailto:support@geauxacademy.com">Email Support</a></li>
            <li><Link to="/help">Help Center</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

---

## /src/components/layout/Header.tsx

```tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import styles from './layout.module.css';

const Header = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  return (
    <header className={styles.header}>
      <div className={styles.navigation}>
        <Link to="/">
          <img src="/images/logo.svg" alt="Geaux Academy Logo" height="50" />
        </Link>
        
        <nav>
          <ul className={styles['navigation-list']}>
            <li>
              <Link to="/" className={location.pathname === '/' ? styles.active : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={location.pathname === '/about' ? styles.active : ''}>
                About
              </Link>
            </li>
            <li>
              <Link to="/features" className={location.pathname === '/features' ? styles.active : ''}>
                Features
              </Link>
            </li>
            <li>
              <Link to="/curriculum" className={location.pathname === '/curriculum' ? styles.active : ''}>
                Curriculum
              </Link>
            </li>
            <li>
              <Link to="/contact" className={location.pathname === '/contact' ? styles.active : ''}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="auth-buttons">
          {!currentUser ? (
            <>
              <Button to="/login" className="btn btn-secondary">Login</Button>
              <Button to="/signup" className="btn btn-primary">Sign Up</Button>
            </>
          ) : (
            <Button to="/dashboard" className="btn btn-primary">Dashboard</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

---

## /src/components/layout/Layout.tsx

```tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/global.css';

const Layout = () => {
  const { currentUser } = useAuth();

  return (
    <LayoutWrapper>
      <Header />
      <PageContainer>
        <Outlet />
      </PageContainer>
      <Footer />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: var(--header-height);
`;

const PageContainer = styled.main`
  flex: 1;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-lg);
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: var(--spacing-sm);
  }
`;

export default Layout;
```

---

## /src/components/layout/Navigation.tsx

```tsx
import React from "react";
import { Link } from "react-router-dom";
import './styles/Navigation.css';

const Navigation = () => {
  return (
    <nav className="flex space-x-6 text-lg font-medium">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/about" className="hover:underline">About Us</Link>
      <Link to="/curriculum" className="hover:underline">Curriculum</Link>
      <Link to="/learning-styles" className="hover:underline">Learning Styles</Link>
      <Link to="/contact" className="hover:underline">Contact Us</Link>
    </nav>
  );
};

export default Navigation;
```

---

## /src/components/layout/Sidebar.tsx

```tsx
// src/components/SomeComponent.tsx

import React from 'react';

const SomeComponent: React.FC = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
};

export default SomeComponent;
```

---

## /src/components/layout/layout.module.css

```css
/* Layout Components */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 1rem;
}

.navigation {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-md);
  height: 100%;
}

.navigation-list {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navigation-list a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: color 0.2s, background-color 0.2s;
}

.navigation-list a:hover {
  color: var(--primary-color);
  background-color: var(--light-bg);
}

.navigation-list a.active {
  color: var(--primary-color);
}

.auth-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.footer {
  background: var(--primary-color);
  color: var(--white);
  padding: var(--spacing-lg) 0;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.footer-column h3 {
  margin-bottom: var(--spacing-md);
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: var(--spacing-sm);
}

.footer-links a {
  color: var(--white);
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer-links a:hover {
  opacity: 0.8;
}

/* Mobile Navigation */
@media (max-width: 768px) {
  .navigation-list {
    display: none;
  }

  .navigation-list.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: var(--white);
    padding: var(--spacing-md);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--white);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  margin-bottom: var(--spacing-md);
}

/* Toast */
.toast {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  color: var(--white);
  animation: slideIn 0.3s ease-in-out;
  z-index: 1000;
}

.toast-info { background-color: var(--accent-color); }
.toast-success { background-color: #10b981; }
.toast-error { background-color: var(--secondary-color); }
.toast-warning { background-color: #f59e0b; }

/* Loading Spinner */
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Card Components */
.card {
  background: var(--white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  margin: var(--spacing-sm);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-icon {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
}

.card-description {
  color: var(--text-color);
  line-height: var(--line-height);
}

.card-list {
  list-style-position: inside;
  color: var(--text-color);
  line-height: var(--line-height);
}

.card-list li {
  margin-bottom: var(--spacing-xs);
}

@media (max-width: 768px) {
  .card {
    padding: var(--spacing-md);
  }
}

/* Student Card Styles */
.student-card {
  background: var(--white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-md);
}

.student-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.student-info {
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
}

.assessment-status {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
}

.status-complete {
  background-color: #10b981;
  color: var(--white);
}

.status-pending {
  background-color: #f59e0b;
  color: var(--white);
}

/* Animations */
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## /src/components/common/Button.tsx

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  $variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ to, children, $variant = 'primary', ...props }) => {
  const className = `btn btn-${$variant}`;
  
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <StyledButton className={className} {...props}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default Button;
```

---

## /src/components/common/Card.tsx

```tsx
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: IconProp | string;
  title?: string;
  description?: string | string[];
  className?: string;
  onClick?: () => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  icon,
  title,
  description,
  children,
  className,
  onClick,
  ...props
}, ref) => {
  const isImagePath = typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('http'));
  
  return (
    <StyledCard 
      ref={ref}
      className={className} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {icon && (
        <IconContainer>
          {isImagePath ? (
            <img 
              src={icon} 
              alt={title || 'Card icon'}
              crossOrigin={icon.startsWith('http') ? "anonymous" : undefined}
            />
          ) : (
            typeof icon === 'object' && <FontAwesomeIcon icon={icon} />
          )}
        </IconContainer>
      )}
      {title && <CardTitle>{title}</CardTitle>}
      {description && (
        Array.isArray(description) ? (
          <CardList>
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </CardList>
        ) : (
          <CardDescription>{description}</CardDescription>
        )
      )}
      {children}
    </StyledCard>
  );
});

Card.displayName = 'Card';

const StyledCard = styled.div`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    ${props => props.onClick && `
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    `}
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.palette.primary.main};
  
  img {
    max-width: 48px;
    height: auto;
  }
`;

const CardTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.palette.text.primary};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

export default Card;
```

---

## /src/components/common/LoadingSpinner.tsx

```tsx
import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

const SpinnerElement = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingSpinner: React.FC = () => {
  return (
    <LoadingContainer>
      <SpinnerElement />
    </LoadingContainer>
  );
};

export default LoadingSpinner;
```

---

## /src/components/common/Modal.tsx

```tsx
import React, { useEffect } from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        <Body>{children}</Body>
      </Content>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Content = styled.div`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.palette.text.secondary};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

const Body = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
`;

export default Modal;
```

---

## /src/components/common/StyledLink.tsx

```tsx
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export interface StyledLinkProps {
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const StyledLink = styled(Link).attrs<StyledLinkProps>(({ disabled }) => ({
  role: 'button',
  'aria-disabled': disabled,
}))<StyledLinkProps>`
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-lg);
  background: ${props => props.variant === 'secondary' ? 'var(--secondary-color)' : 'var(--primary-color)'};
  color: var(--white);
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  text-decoration: none;
  text-align: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.2s, transform 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not([aria-disabled="true"]) {
    background: ${props => props.variant === 'secondary' ? 'var(--primary-color)' : 'var(--secondary-color)'};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px dashed var(--secondary-color);
    outline-offset: 4px;
  }
`;

export default StyledLink;
```

---

## /src/components/common/Toast.tsx

```tsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <ToastContainer $type={type}>
      <p>{message}</p>
    </ToastContainer>
  );
};

const showToast = (props: ToastProps): void => {
  const toastElement = document.createElement('div');
  document.body.appendChild(toastElement);
  
  const onClose = () => {
    document.body.removeChild(toastElement);
    props.onClose?.();
  };
  
  const toastComponent = React.createElement(Toast, { ...props, onClose });
  ReactDOM.render(toastComponent, toastElement);
};

const getToastColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return css`
        background-color: ${({ theme }) => theme.palette.success?.main || '#2ECC71'};
        color: white;
      `;
    case 'warning':
      return css`
        background-color: ${({ theme }) => theme.palette.warning?.main || '#F1C40F'};
        color: white;
      `;
    case 'error':
      return css`
        background-color: ${({ theme }) => theme.palette.error?.main || '#E74C3C'};
        color: white;
      `;
    default:
      return css`
        background-color: ${({ theme }) => theme.palette.info?.main || '#3498DB'};
        color: white;
      `;
  }
};

const ToastContainer = styled.div<{ $type: ToastType }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  ${props => getToastColor(props.$type)}

  p {
    margin: 0;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export default Toast;
```

---

## /src/components/common/types/index.ts

```typescript
// src/components/SomeComponent.tsx

import React from 'react';

// Reusable component prop types
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

// Example component with proper types
export interface SomeComponentProps extends BaseComponentProps {
  title?: string;
}

// Use arrow function with explicit return for better type inference
export const SomeComponent: React.FC<SomeComponentProps> = ({ title = 'Hello, World!', className, id }): JSX.Element => {
  return React.createElement('div', { className, id },
    React.createElement('h1', null, title)
  );
};

// Example utility function with explicit return type
export const exampleFunction = (input: string): string => input.toUpperCase();
```

---

## /src/components/student/StudentCard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStudentProfile } from '../../services/profileService';
import Card from '../common/Card';

interface Student {
  name: string;
  grade: string;
  hasTakenAssessment: boolean;
}

interface StudentCardProps {
  studentId: string;
  onClick?: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ studentId, onClick }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentData = await getStudentProfile(studentId);
        setStudent(studentData);
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Could not load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) return <StyledCard onClick={onClick}>Loading student data...</StyledCard>;
  if (error) return <StyledCard onClick={onClick}>Error: {error}</StyledCard>;
  if (!student) return null;

  return (
    <StyledCard onClick={onClick}>
      <StudentName>{student.name}</StudentName>
      <StudentInfo>Grade: {student.grade}</StudentInfo>
      <AssessmentStatus $isComplete={student.hasTakenAssessment}>
        {student.hasTakenAssessment ? 'Assessment Complete' : 'Assessment Needed'}
      </AssessmentStatus>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StudentName = styled.h3`
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StudentInfo = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AssessmentStatus = styled.div<{ $isComplete: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  background-color: ${({ theme, $isComplete }) => 
    $isComplete ? theme.palette.success?.main || '#2ECC71' : theme.palette.warning?.main || '#F1C40F'};
  color: white;
  font-size: 0.875rem;
  text-align: center;
`;

export default StudentCard;
```

---

## /src/components/auth/AuthErrorDialog.tsx

```tsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '../../theme';
import styled from 'styled-components';

interface AuthError {
  message: string;
  retry?: boolean;
}

interface AuthErrorDialogProps {
  open: boolean;
  error: AuthError | null;
  onClose: () => void;
  onRetry?: () => Promise<void>;
}

const AuthErrorDialog: React.FC<AuthErrorDialogProps> = ({
  open,
  error,
  onClose,
  onRetry
}): JSX.Element | null => {
  if (!error) return null;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="auth-error-dialog-title"
    >
      <DialogTitle id="auth-error-dialog-title">
        Authentication Error
        <CloseIconButton
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </CloseIconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{error.message}</DialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        {error.retry && onRetry && (
          <Button 
            onClick={onRetry} 
            color="primary" 
            variant="contained" 
            autoFocus
          >
            Try Again
          </Button>
        )}
      </StyledDialogActions>
    </StyledDialog>
  );
};

interface StyledProps {
  theme: Theme;
}

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    padding: ${({ theme }: StyledProps) => theme.spacing.md};
  }
`;

const CloseIconButton = styled(IconButton)`
  position: absolute;
  right: ${({ theme }: StyledProps) => theme.spacing.sm};
  top: ${({ theme }: StyledProps) => theme.spacing.sm};
`;

const StyledDialogActions = styled(DialogActions)`
  padding: ${({ theme }: StyledProps) => theme.spacing.md} 0 0;
`;

export default AuthErrorDialog;
```

---

## /src/components/auth/AuthRoute.tsx

```tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (currentUser) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Allow access to auth pages if not authenticated
  return <>{children}</>;
};

export default AuthRoute;
```

---

## /src/components/auth/Login.css

```css
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f5f5;
}

.login-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.login-form h2 {
    text-align: center;
    color: #2C3E50;
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-color);
    font-weight: 500;
    font-size: 1rem;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group input::placeholder {
    color: #a0aec0;
}

.login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.login-button:hover {
    background-color: #4338ca;
}

.login-button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
}

.error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    text-align: center;
}

.login-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
}

.login-footer p {
    margin-bottom: 0.5rem;
    color: #4a5568;
}

.login-footer a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
}

.login-footer a:hover {
    text-decoration: underline;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
}

.divider span {
    padding: 0 10px;
    color: #64748b;
    font-size: 0.875rem;
}

.google-button {
    width: 100%;
    padding: 0.75rem;
    background-color: white;
    color: #333;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background-color 0.2s ease;
}

.google-button:hover {
    background-color: #f8fafc;
}

.google-button img {
    width: 18px;
    height: 18px;
}

@media (max-width: 480px) {
    .login-form {
        padding: 1.5rem;
    }
}
```

---

## /src/components/auth/LoginForm.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from '../GoogleLoginButton';
import './auth.css';

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
  color: #dc3545;
  &:hover {
    opacity: 0.7;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #357abd;
  }
`;

const LoginForm: React.FC = (): JSX.Element => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    try {
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin();
    }}>
      {/* ...existing form JSX... */}
    </form>
  );
};

export default LoginForm;
```

---

## /src/components/auth/SignUp.css

```css
.signup-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.error-alert {
  background: #ffebee;
  color: #c62828;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
}
```

---

## /src/components/auth/SignUp.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { CheshireService } from '../../services/cheshireService';
import Button from '../common/Button';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const createCheshireAccount = async (uid: string, email: string) => {
    try {
      await CheshireService.createCheshireUser(uid, email);
    } catch (error) {
      console.error('Error creating Cheshire account:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signup(formData.email, formData.password);
      
      if (userCredential?.user) {
        await createCheshireAccount(userCredential.user.uid, userCredential.user.email || '');
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
      console.error('Google signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <SignUpCard>
        <h2>Create an Account</h2>
        {error && (
          <ErrorMessage>
            <span>{error}</span>
            <DismissButton onClick={() => setError('')}>✕</DismissButton>
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <StyledButton type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </StyledButton>
        </Form>

        <Divider>
          <span>Or</span>
        </Divider>

        <GoogleButton onClick={handleGoogleSignup} disabled={loading}>
          <FcGoogle />
          <span>Sign up with Google</span>
        </GoogleButton>

        <LoginPrompt>
          Already have an account? <Link to="/login">Log In</Link>
        </LoginPrompt>
      </SignUpCard>
    </SignUpContainer>
  );
};

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--background);
`;

const SignUpCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &:disabled {
    background-color: #f5f5f5;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
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

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }

  span {
    padding: 0 0.5rem;
    color: #666;
    font-size: 0.875rem;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f8f8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoginPrompt = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-color);
`;

const Link = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default SignUp;
```

---

## /src/components/auth/auth.css

```css
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.auth-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: #fee2e2;
  color: #dc2626;
  font-size: 0.875rem;
}

.auth-error-dismiss {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.auth-error-dismiss:hover {
  opacity: 1;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s, border-color 0.2s;
  gap: 0.5rem;
}

.google-button:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.google-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 3rem);
  height: 1px;
  background-color: #e5e7eb;
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

.auth-divider span {
  background-color: #fff;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.btn.btn-secondary {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.2s;
  cursor: pointer;
}

.btn.btn-secondary:hover {
  background-color: #e5e7eb;
}
```

---

## /src/components/dashboard/Dashboard.tsx

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CreateStudent from '../../pages/profile/ParentProfile/CreateStudent';
import { ProfileService, getStudentProfile } from '../../services/profileService';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import type { Student, BaseProfile } from '../../types/profiles';

interface UserData {
  name: string;
  lastLogin: string;
}

interface ParentProfile {
  id?: string;
  students?: string[];
  name?: string;
  email?: string;
}

interface DashboardProps {
  onProfileUpdate?: (profile: BaseProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onProfileUpdate }): JSX.Element => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Retry data fetch when back online
      if (currentUser) fetchUserData();
    };
    
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser]);

  const fetchUserData = useCallback(async (): Promise<void> => {
    try {
      if (!currentUser?.uid) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError('');
      
      // Set basic user data immediately from auth
      setUserData({
        name: currentUser.displayName || currentUser.email || '',
        lastLogin: currentUser.metadata?.lastSignInTime || 'N/A',
      });

      // Fetch parent profile with retry mechanism
      const fetchProfileWithRetry = async () => {
        try {
          const profileService = new ProfileService();
          const profile = await profileService.getUserProfile(currentUser.uid);
          if (profile) {
            setParentProfile(profile);
            if (onProfileUpdate) {
              onProfileUpdate(profile);
            }
            return profile;
          }
          throw new Error('Profile not found');
        } catch (err) {
          if (retryCount < MAX_RETRIES && !isOffline) {
            setRetryCount(prev => prev + 1);
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            return fetchProfileWithRetry();
          }
          throw err;
        }
      };

      const profile = await fetchProfileWithRetry();

      // Fetch students data if profile exists
      if (profile?.students?.length) {
        const studentsData = await Promise.all(
          profile.students.map(async (studentId: string) => {
            try {
              const student = await getStudentProfile(studentId);
              return student;
            } catch (err) {
              console.error(`Error fetching student ${studentId}:`, err);
              return null;
            }
          })
        );
        
        // Filter out null values and cast to Student array
        setStudents(studentsData.filter((s): s is Student => s !== null && s.id !== undefined));
      }

      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      setError(isOffline ? 
        'You are currently offline. Some features may be limited.' :
        'Failed to fetch user data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser, navigate, onProfileUpdate, retryCount, isOffline]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleStudentSelect = (student: Student) => {
    if (isOffline) {
      setError('This action is not available while offline');
      return;
    }
    
    if (!student.hasTakenAssessment) {
      navigate(`/learning-style-chat/${student.id}`);
    } else {
      navigate(`/student-profile/${student.id}`);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <AnimatePresence>
        {isOffline && (
          <OfflineBanner
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            You are currently offline. Some features may be limited.
          </OfflineBanner>
        )}
      </AnimatePresence>

      <DashboardHeader>
        <h1>Welcome, {userData?.name}</h1>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </DashboardHeader>

      {error && (
        <ErrorMessage>
          {error}
          <RetryButton onClick={fetchUserData}>Retry</RetryButton>
        </ErrorMessage>
      )}

      <DashboardGrid>
        <ParentSection>
          <h2>Parent Dashboard</h2>
          {!isOffline && <CreateStudent />}
          <StudentsList>
            <h3>Your Students</h3>
            {students.length > 0 ? (
              <StudentGrid>
                {students.map((student) => (
                  <StudentCardWrapper 
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    disabled={isOffline}
                  >
                    <StudentName>{student.name}</StudentName>
                    <StudentInfo>Grade: {student.grade}</StudentInfo>
                    <AssessmentStatus $completed={student.hasTakenAssessment}>
                      {student.hasTakenAssessment ? 'Assessment Complete' : 'Take Assessment'}
                    </AssessmentStatus>
                  </StudentCardWrapper>
                ))}
              </StudentGrid>
            ) : (
              <EmptyState>
                No students found. {!isOffline && 'Add your first student to get started.'}
              </EmptyState>
            )}
          </StudentsList>
        </ParentSection>
      </DashboardGrid>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const ParentSection = styled.section`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StudentsList = styled.div`
  margin-top: 1rem;
`;

const StudentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StudentCardWrapper = styled.div<{ disabled?: boolean }>`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const StudentName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2d3748;
`;

const StudentInfo = styled.p`
  color: #4a5568;
  margin: 0 0 0.5rem 0;
`;

const AssessmentStatus = styled.div<{ $completed: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  background-color: ${props => props.$completed ? '#48BB78' : '#4299E1'};
  color: white;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  width: 100%;
  background-color: #3B82F6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  
  &:hover {
    background-color: #2563EB;
  }
`;

const EmptyState = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  text-align: center;
`;

const LogoutButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #dc2626;
  }
`;

const OfflineBanner = styled(motion.div)`
  background: #fff3cd;
  color: #856404;
  padding: 0.75rem;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RetryButton = styled.button`
  background: none;
  border: 1px solid currentColor;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

export default Dashboard;
```

---

## /src/components/home/Features.css

```css
.features-section {
  padding: 4rem 2rem;
  background-color: #f8f9fa;
}

.features-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2d3748;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  background-color: #e6b800; /* P920d */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* P920d */
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.feature-description {
  color: #4a5568;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .features-section {
    padding: 2rem 1rem;
  }

  .features-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## /src/components/home/Features.tsx

```tsx
import React from 'react';
import Card from '../common/Card';
import './Features.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faLightbulb, faChartLine, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

const Features = () => {
  const features = [
    {
      title: "Personalized Learning",
      description: "Tailored learning paths based on your unique style",
      icon: faBullseye
    },
    {
      title: "Interactive Content",
      description: "Engage with dynamic and interactive learning materials",
      icon: faLightbulb
    },
    {
      title: "Progress Tracking",
      description: "Monitor your growth with detailed analytics",
      icon: faChartLine
    },
    {
      title: "Expert Support",
      description: "Get help from experienced educators",
      icon: faChalkboardTeacher
    }
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">Why Choose Geaux Academy</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <Card key={index} className="feature-card" icon={feature.icon}>
            <div className="feature-icon"><FontAwesomeIcon icon={feature.icon} /></div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
```

---

## /src/components/home/Hero.css

```css
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #333;
}

.hero-content p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
}

.hero-cta .btn {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.hero-cta .btn:hover {
  background-color: #e6b800;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}
```

---

## /src/components/home/Hero.tsx

```tsx
import { Link } from 'react-router-dom';
import './Hero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Discover Your Learning Style</h1>
        <p>Personalized education tailored to how you learn best</p>
        <div className="hero-cta">
          <Link to="/assessment" className="btn btn-primary">
            <FontAwesomeIcon icon={faUser} /> Take Assessment
          </Link>
          <Link to="/about" className="btn btn-secondary">
            <FontAwesomeIcon icon={faUser} /> Learn More
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <img src="/images/hero-learning.svg" alt="Learning illustration" />
      </div>
    </section>
  );
};

export default Hero;
```

---

## /src/components/home/LearningStyles.css

```css
:root {
  --primary-color: #2C3E50;
  --text-color: #333;
  --background-alt: #f8f9fa;
}

body {
  margin: 0;
  padding: 0;
}

.learning-styles-section {
  padding: 4rem 2rem;
  background-color: var(--light-bg);
}

.learning-styles-section h2 {
  text-align: center;
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.styles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.style-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
}

.style-card:hover {
  transform: translateY(-5px);
  background-color: #e6b800; /* P4a73 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* P4a73 */
}

.style-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.style-card h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.style-card p {
  color: var(--text-color);
  line-height: 1.5;
}

.main-content {
  margin-left: 250px;
  padding: 2rem;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .styles-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .learning-styles-section {
    padding: 2rem 1rem;
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}
```

---

## /src/components/home/LearningStyles.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import InfoCard from '../common/InfoCard'; // Fixed path
import { motion } from 'framer-motion';
import Card from '../common/Card';
import './LearningStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEar, faBook, faRunning } from '@fortawesome/free-solid-svg-icons';

const LearningStyles = () => {
  const styles = [
    {
      title: 'Visual Learning',
      description: 'Learn through seeing and watching demonstrations',
      icon: faEye
    },
    {
      title: 'Auditory Learning',
      description: 'Learn through listening and discussion',
      icon: faEar
    },
    {
      title: 'Reading/Writing',
      description: 'Learn through reading and taking notes',
      icon: faBook
    },
    {
      title: 'Kinesthetic',
      description: 'Learn through doing and practicing',
      icon: faRunning
    }
  ];

  return (
    <section className="learning-styles-section">
      <div className="styles-grid">
        {styles.map((style, index) => (
          <Card key={index} className="style-card" icon={style.icon}>
            <div className="style-icon"><FontAwesomeIcon icon={style.icon} /></div>
            <h3>{style.title}</h3>
            <p>{style.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LearningStyles;
```

---

## /src/components/chat/ChatUI.css

```css
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
}

.message {
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  max-width: 80%;
}

.message.user {
  background-color: #e3f2fd;
  margin-left: auto;
  text-align: right;
}

.message.tutor {
  background-color: #f5f5f5;
  margin-right: auto;
}

.message.processing {
  background-color: #fafafa;
  opacity: 0.7;
  font-style: italic;
}

.input-container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
}

.input-container input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
}

.input-container button {
  padding: 0.75rem 1.5rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.input-container button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.input-container input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
```

---

## /src/components/chat/ChatUI.tsx

```tsx
import React, { useState } from 'react';
import { CheshireService } from '../../services/cheshireService';
import { useAuth } from '../../contexts/AuthContext';
import './ChatUI.css';

interface Message {
  sender: 'user' | 'tutor';
  text: string;
}

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();

  const handleSend = async () => {
    if (!inputText.trim() || !currentUser?.uid) return;
    
    const userMessage: Message = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const chatId = 'default';
      const response = await CheshireService.sendChatMessage(
        inputText,
        currentUser.uid,
        chatId
      );

      const tutorMessage: Message = {
        sender: 'tutor',
        text: response.data
      };
      setMessages(prev => [...prev, tutorMessage]);

      const memories = response.memories || [];
      if (memories.length > 0) {
        const learningStyleMemory = memories.find(
          memory => memory.metadata?.learning_style
        );
        if (learningStyleMemory?.metadata?.learning_style) {
          console.log('Learning style detected:', learningStyleMemory.metadata.learning_style);
        }
      }
    } catch (error) {
      const errorMessage = CheshireService.getErrorMessage(error);
      setMessages(prev => [...prev, { sender: 'tutor', text: errorMessage }]);
    } finally {
      setIsProcessing(false);
    }
    setInputText('');
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isProcessing && (
          <div className="message tutor processing">
            Thinking...
          </div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          placeholder="Type your message..."
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
          disabled={isProcessing}
        />
        <button 
          onClick={handleSend}
          disabled={isProcessing || !inputText.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
```

---

## /src/components/chat/LearningStyleChat.tsx

```tsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Message from '../Message';
import { saveLearningStyle, updateStudentAssessmentStatus } from '../../services/profileService';
import { CheshireService } from '../../services/cheshireService';
import { LearningStyle } from '../../types/profiles';

type ValidLearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

interface CheshireResponse {
  data: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

interface CheshireError {
  code?: string;
  message: string;
}

const isValidLearningStyle = (style: string): style is ValidLearningStyle => {
  return ['visual', 'auditory', 'kinesthetic', 'reading/writing'].includes(style);
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const LearningStyleChat: React.FC<{ studentId?: string }> = ({ studentId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Initialize chat with assessment start message
  useEffect(() => {
    setMessages([{ 
      text: "Hi! I'm here to help assess your learning style. Let's start with a few questions. How do you prefer to learn new things?", 
      sender: "bot" 
    }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check API connection on mount and set up periodic checks
  useEffect(() => {
    checkApiConnection();
    const intervalId = setInterval(checkApiConnection, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const checkApiConnection = async (): Promise<void> => {
    const isConnected = await CheshireService.checkConnection();
    setConnectionError(!isConnected);
  };

  const retryWithDelay = async (fn: () => Promise<void>, maxRetries = 3, delay = 1000): Promise<void> => {
    try {
      return await fn();
    } catch (error) {
      if (maxRetries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithDelay(fn, maxRetries - 1, delay);
      }
      throw error;
    }
  };

  const handleResponse = async (response: CheshireResponse): Promise<void> => {
    const rawLearningStyle = response?.memories?.find(m => m.metadata?.learning_style)?.metadata?.learning_style;
    if (rawLearningStyle && isValidLearningStyle(rawLearningStyle) && studentId) {
      const learningStyle: LearningStyle = {
        type: rawLearningStyle,
        strengths: [],
        recommendations: []
      };
      try {
        await saveLearningStyle(studentId, learningStyle);
        await updateStudentAssessmentStatus(studentId, "completed");
      } catch (error) {
        console.error('Error saving learning style:', error);
        setMessages(prev => [...prev, { 
          text: "There was an error saving your learning style. Please try again.", 
          sender: "bot" 
        }]);
      }
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    try {
      setLoading(true);
      const response = await CheshireService.sendChatMessage(
        userMessage,
        currentUser?.uid || 'anonymous',
        studentId || 'default'
      );

      if (response) {
        setMessages(prev => [...prev, { text: response.data, sender: 'bot' }]);
        await handleResponse(response);
      }
      
      setConnectionError(false);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      const errorMessage = CheshireService.getErrorMessage(error as CheshireError);
      setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
      setConnectionError(true);
      await checkApiConnection();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContainer className="card">
      <ChatHeader>
        🎓 Learning Style Assessment
        {connectionError && (
          <ConnectionError>
            ⚠️ Connection Error - Check if the chat service is running
          </ConnectionError>
        )}
      </ChatHeader>
      <ChatBody>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender}>{msg.text}</Message>
        ))}
        {loading && <Message sender="bot">Typing...</Message>}
        <div ref={chatEndRef} />
      </ChatBody>
      <ChatFooter>
        <ChatInput
          type="text"
          value={input}
          placeholder="Type your response..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="form-input"
        />
        <SendButton onClick={sendMessage} className="btn btn-primary">
          <FaPaperPlane />
        </SendButton>
      </ChatFooter>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  height: 500px;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid #eee;
  font-weight: bold;
`;

const ConnectionError = styled.div`
  color: var(--color-error);
  font-size: 0.8em;
  margin-top: 4px;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
`;

const ChatFooter = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid #eee;
`;

const ChatInput = styled.input`
  flex: 1;
`;

const SendButton = styled.button`
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default LearningStyleChat;
```

---

## /src/components/chat/TestChat.tsx

```tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CheshireService } from '../../services/cheshireService';
import { useAuth } from '../../contexts/AuthContext';

const TestChat: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...');
  const [testMessage, setTestMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { currentUser } = useAuth();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const isConnected = await CheshireService.checkConnection();
      setConnectionStatus(isConnected ? 'Connected ✅' : 'Not connected ❌');
    } catch (error) {
      setConnectionStatus('Connection failed ❌');
      setError(CheshireService.getErrorMessage(error));
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.trim() || !currentUser?.uid) return;

    try {
      setError('');
      const result = await CheshireService.sendChatMessage(
        testMessage,
        currentUser.uid,
        'test'
      );
      setResponse(result.data);
      if (result.memories?.length) {
        console.log('Memories received:', result.memories);
      }
    } catch (error) {
      setError(CheshireService.getErrorMessage(error));
    }
  };

  return (
    <TestContainer>
      <TestCard>
        <h2>Cheshire Service Test</h2>
        
        <StatusSection>
          <h3>Connection Status:</h3>
          <StatusText>{connectionStatus}</StatusText>
          <RefreshButton onClick={checkConnection}>
            Refresh Connection
          </RefreshButton>
        </StatusSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <TestSection>
          <h3>Send Test Message:</h3>
          <TestInput
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Type a test message..."
          />
          <SendButton 
            onClick={handleTestMessage}
            disabled={!testMessage.trim() || !currentUser}
          >
            Send Message
          </SendButton>
        </TestSection>

        {response && (
          <ResponseSection>
            <h3>Response:</h3>
            <ResponseText>{response}</ResponseText>
          </ResponseSection>
        )}
      </TestCard>
    </TestContainer>
  );
};

const TestContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--background);
`;

const TestCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }

  h3 {
    margin-bottom: 1rem;
    color: var(--text-color);
  }
`;

const StatusSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const StatusText = styled.div`
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const TestSection = styled.div`
  margin-bottom: 2rem;
`;

const TestInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ResponseSection = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const ResponseText = styled.div`
  white-space: pre-wrap;
  font-family: monospace;
  padding: 1rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const RefreshButton = styled(Button)`
  background-color: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background-color: #5a6268;
  }
`;

const SendButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export default TestChat;
```

---

## /src/components/shared/ErrorBoundary.tsx

```tsx
import React, { Component, ErrorInfo } from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOffline: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      isOffline: !navigator.onLine
    };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
  }

  handleOnlineStatus = () => {
    this.setState({ isOffline: !navigator.onLine });
    if (navigator.onLine && this.state.error?.message.includes('offline')) {
      // Clear offline-related errors when back online
      this.setState({ hasError: false, error: null });
    }
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isOffline: !navigator.onLine
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check if error is Firebase offline error
      const isFirebaseOffline = this.state.error?.message.includes('offline') || 
                               this.state.error?.message.includes('network');

      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorTitle>
              {this.state.isOffline ? '📡 You\'re Offline' : '❌ Something went wrong'}
            </ErrorTitle>
            
            <ErrorMessage>
              {this.state.isOffline || isFirebaseOffline ? (
                <>
                  <p>It looks like you're offline or having connection issues.</p>
                  <p>Some features may be limited until you're back online.</p>
                  <p>Your data will sync automatically when you reconnect.</p>
                </>
              ) : (
                <>
                  <p>An unexpected error occurred.</p>
                  <p>{this.state.error?.message}</p>
                </>
              )}
            </ErrorMessage>

            <RetryButton 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Try Again
            </RetryButton>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: rgba(0, 0, 0, 0.05);
`;

const ErrorCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: #e53e3e;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  color: #4a5568;
  margin-bottom: 1.5rem;
  
  p {
    margin: 0.5rem 0;
  }
`;

const RetryButton = styled.button`
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #3182ce;
  }
`;

export default ErrorBoundary;
```

---

## /src/components/shared/styles/Button.css

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background: transparent;
}

/* Authentication Components Styling */
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.auth-title {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--primary-color);
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: var(--spacing-md) 0;
  text-align: center;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.auth-divider span {
  padding: 0 var(--spacing-sm);
  color: #666;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm);
  background: var(--white);
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.2s;
}

.google-button:hover {
  background-color: #f5f5f5;
}

.auth-error {
  color: var(--secondary-color);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.auth-success {
  color: #4CAF50;
  text-align: center;
  margin-bottom: var(--spacing-md);
}

/* Form validation styling */
.auth-input.error {
  border-color: var(--secondary-color);
}

.error-message {
  color: var(--secondary-color);
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
}
```

---

## /src/components/features/vue/VueComponent.tsx

```tsx
/src/components/features/vue/VueComponent.tsx

import React from 'react';
import VueComponentWrapper from './VueComponentWrapper';

interface VueComponentProps {
  // Add any props if needed
}

const VueComponent: React.FC<VueComponentProps> = () => {
  return (
    <div>
      <h1>React + Vue Integration</h1>
      <VueComponentWrapper />
    </div>
  );
};

export default VueComponent;
```

---

## /src/components/features/vue/VueWrapper.tsx

```tsx
import React, { useEffect, useRef } from 'react';
import { createApp, App } from 'vue';

interface VueWrapperProps {
  component: any; // Vue component
  props?: Record<string, any>;
}

const VueWrapper: React.FC<VueWrapperProps> = ({ component, props = {} }) => {
  const vueRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);

  useEffect(() => {
    if (!vueRef.current || !component) return;

    if (!appRef.current) {
      appRef.current = createApp(component, props);
      appRef.current.mount(vueRef.current);
    }

    return () => {
      if (appRef.current) {
        appRef.current.unmount();
        appRef.current = null;
      }
    };
  }, [component, props]);

  return <div ref={vueRef} />;
};

export default VueWrapper;
```

---

## /src/components/features/learning/LearningStyleInsightsWrapper.tsx

```tsx
/src/components/features/learning/LearningStyleInsightsWrapper.tsx

import React from 'react';
import VueWrapper from '../vue/VueWrapper';
import LearningStyleInsights from './LearningStyleInsights.vue';

interface LearningStyleInsightsWrapperProps {
  studentData?: any; // Add proper typing based on your Vue component props
}

const LearningStyleInsightsWrapper: React.FC<LearningStyleInsightsWrapperProps> = ({ studentData }) => {
  return <VueWrapper component={LearningStyleInsights} props={{ studentData }} />;
};

export default LearningStyleInsightsWrapper;
```

---

## /src/components/styles/CoreValues.styles.ts

```typescript
import styled from 'styled-components';

export const CoreValuesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  text-align: center;
  padding: 1.5rem 0;
`;

export const CoreValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;
```

---

## /src/firebase/auth-service-worker.ts

```typescript
// File: /src/firebase/auth-service-worker.ts
// Description: Service worker initialization with enhanced security
// Author: GitHub Copilot
// Created: 2024-02-12

import { enableIndexedDbPersistence, type FirestoreSettings } from 'firebase/firestore';
import { db } from './config';

interface ServiceWorkerError extends Error {
  name: string;
  code?: string;
}

interface AuthServiceWorkerMessage {
  type: string;
  status?: number;
  ok?: boolean;
  fallbackToRedirect?: boolean;
  error?: string;
  secure?: boolean;
}

interface ServiceWorkerRegistrationResult {
  success: boolean;
  isSecure: boolean;
  supportsServiceWorker: boolean;
  error?: string;
}

const SW_TIMEOUT = Number(import.meta.env.VITE_SERVICE_WORKER_TIMEOUT) || 10000;
const MAX_RETRIES = Number(import.meta.env.VITE_MAX_AUTH_RETRIES) || 3;

const isSecureContext = (): boolean => {
  return window.isSecureContext && (
    window.location.protocol === 'https:' || 
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
};

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
let retryCount = 0;

const registerWithRetry = async (): Promise<ServiceWorkerRegistration> => {
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/__/auth',
      type: 'module',
      updateViaCache: 'none'
    });
    return registration;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return registerWithRetry();
    }
    throw error;
  }
};

export const registerAuthServiceWorker = async (): Promise<ServiceWorkerRegistrationResult> => {
  if (!('serviceWorker' in navigator)) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: false,
      error: 'Service workers are not supported in this browser'
    };
  }

  if (!isSecureContext()) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: true,
      error: 'Secure context required for authentication'
    };
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));

    serviceWorkerRegistration = await registerWithRetry();

    const activationPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Service worker activation timeout'));
      }, SW_TIMEOUT);

      if (serviceWorkerRegistration?.active) {
        clearTimeout(timeout);
        resolve();
        return;
      }

      serviceWorkerRegistration?.addEventListener('activate', () => {
        clearTimeout(timeout);
        resolve();
      });
    });

    await activationPromise;

    return {
      success: true,
      isSecure: isSecureContext(),
      supportsServiceWorker: true
    };

  } catch (error) {
    console.error('Service worker registration failed:', error);
    return {
      success: false,
      isSecure: isSecureContext(),
      supportsServiceWorker: true,
      error: error instanceof Error ? error.message : 'Service worker registration failed'
    };
  }
};

export const initAuthServiceWorker = async (): Promise<boolean> => {
  const result = await registerAuthServiceWorker();
  
  window.dispatchEvent(new CustomEvent('firebase-auth-worker-status', { 
    detail: result 
  }));

  if (!result.success) {
    console.warn('Auth service worker initialization failed:', result.error);
    return false;
  }

  // Initialize Firestore persistence after successful service worker registration
  try {
    const settings: FirestoreSettings = {
      cacheSizeBytes: 50000000, // 50 MB
    };
    
    await enableIndexedDbPersistence(db);
    
    return true;
  } catch (error) {
    console.error('Failed to enable persistence:', error);
    return false;
  }
};

function handleServiceWorkerMessage(event: MessageEvent<AuthServiceWorkerMessage>) {
  const { type, status, ok, fallbackToRedirect, error, secure } = event.data;

  const dispatch = (eventName: string, detail: any) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  };

  switch (type) {
    case 'FIREBASE_SERVICE_WORKER_READY':
      console.debug('Firebase auth service worker ready');
      dispatch('firebase-auth-worker-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_READY':
      console.debug('Firebase auth popup ready');
      dispatch('firebase-auth-popup-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_ERROR':
      if (fallbackToRedirect && import.meta.env.VITE_AUTH_POPUP_FALLBACK === 'true') {
        console.warn('Popup authentication failed, falling back to redirect method');
      }
      dispatch('firebase-auth-error', { error, fallbackToRedirect });
      break;
      
    case 'AUTH_RESPONSE':
      if (!ok) {
        console.error('Authentication response error:', status);
        dispatch('firebase-auth-error', { status, error });
      } else {
        dispatch('firebase-auth-success', { status });
      }
      break;
      
    case 'SECURE_CONTEXT_CHECK':
      if (!secure) {
        console.warn('Authentication requires a secure context (HTTPS)');
        dispatch('firebase-auth-security', { secure: false });
      }
      break;
  }
}

navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

export default initAuthServiceWorker;
```

---

## /src/firebase/auth-service.ts

```typescript
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, Auth } from "firebase/auth";
import { auth } from './config';

export class AuthService {
  private provider: GoogleAuthProvider;
  private initialized: boolean = false;
  private popupOpen: boolean = false;
  private _auth: Auth;

  constructor() {
    this.provider = new GoogleAuthProvider();
    this.provider.setCustomParameters({
      prompt: 'select_account',
      scope: 'email profile'
    });
    this._auth = auth;
  }

  get auth(): Auth {
    return this._auth;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await new Promise<void>((resolve) => {
        const unsubscribe = this._auth.onAuthStateChanged(() => {
          unsubscribe();
          this.initialized = true;
          resolve();
        });
      });
    }
  }

  async signInWithGoogle() {
    try {
      if (this.popupOpen) {
        throw new Error('Authentication popup is already open');
      }

      await this.ensureInitialized();
      this.popupOpen = true;

      const result = await signInWithPopup(this._auth, this.provider);
      return result;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled by user');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked. Please allow popups for this site');
      }
      throw new Error(error.message || 'Failed to sign in with Google');
    } finally {
      this.popupOpen = false;
    }
  }

  async signOut() {
    try {
      await this.ensureInitialized();
      await firebaseSignOut(this._auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }
}
```

---

## /src/firebase/config.ts

```typescript
// File: /src/firebase/config.ts
// Description: Firebase configuration with Firestore persistence setup

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  type Auth
} from 'firebase/auth';
import { 
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentSingleTabManager,
  type Firestore
} from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache settings
export const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({ forceOwnership: true }),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});

// Initialize Auth with persistence and popup support (preferred method)
export const auth: Auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

// Initialize Analytics
export const analytics: Analytics = getAnalytics(app);

// Export app instance for other Firebase services
export { app as firebase };
```

---

## /src/utils/animations.js

```javascript
export const pageTransitions = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, staggerChildren: 0.2 }
  },
};

export const containerVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20 
  }
};

export const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 }
};
```

---

## /src/contexts/AuthContext.tsx

```tsx
// File: /src/contexts/AuthContext.tsx
// Description: Context for authentication using Firebase
// Author: GitHub Copilot
// Created: 2024-02-12

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../firebase/auth-service';

export interface AuthContextProps {
  currentUser: User | null;
  isAuthReady: boolean;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const authService = new AuthService();

  useEffect(() => {
    const unsubscribe = authService.auth.onAuthStateChanged((firebaseUser: User | null) => {
      setCurrentUser(firebaseUser);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextProps = {
    currentUser,
    isAuthReady,
    loading,
    error,
    login,
    loginWithGoogle,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

## /src/contexts/ProfileContext.tsx

```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Profile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  learningStyle?: string;
  grade?: string;
}

interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (newProfile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
```

---

## /src/test/mockThemes.ts

```typescript
import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';
import type { Theme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#4791db'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350'
    },
    background: {
      paper: '#ffffff',
      default: '#f5f5f5'
    },
    text: {
      primary: '#000000',
      secondary: '#666666'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
});

export const mockMuiTheme = muiTheme;

const spacing = Object.assign(
  ((factor: number) => `${0.25 * factor}rem`) as Theme['spacing'],
  {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  }
);

export const mockStyledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px'
  },
  spacing,
  colors: {
    border: '#e0e0e0',
    text: '#000000',
    background: {
      hover: '#f5f5f5'
    },
    error: {
      main: '#d32f2f',
      light: '#ffebee'
    }
  },
  borderRadius: {
    default: '4px'
  }
};
```

---

## /src/test/setup.ts

```typescript
// File: /src/test/setup.ts
// Description: Jest setup file for testing environment configuration.

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Run cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Mock react-icons
jest.mock('react-icons/fc', () => ({
  FcGoogle: function MockGoogleIcon() {
    return React.createElement('span', { 'data-testid': 'google-icon' }, 'Google Icon');
  }
}));

// Mock Firebase Auth
jest.mock('firebase/auth');

// Mock Firebase Config
jest.mock('../firebase/config', () => ({
  auth: jest.fn(),
  googleProvider: {
    setCustomParameters: jest.fn()
  }
}));
```

---

## /src/test/testUtils.tsx

```tsx
import React from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext, type AuthContextProps } from "../contexts/AuthContext";
import '@testing-library/jest-dom';
import { mockMuiTheme, mockStyledTheme } from "./mockThemes";

// Enable React Router v7 future flags
const future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

export const mockLoginWithGoogle = jest.fn();

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
  mockAuthValue?: Partial<AuthContextProps>;
}

export const renderWithProviders = (
  ui: React.ReactNode,
  { withRouter = true, mockAuthValue = {}, ...options }: RenderWithProvidersOptions = {}
): RenderResult => {
  const defaultAuthValue: AuthContextProps = {
    currentUser: null,
    isAuthReady: true,
    loading: false,
    error: null,
    login: mockLoginWithGoogle,
    loginWithGoogle: mockLoginWithGoogle,
    logout: jest.fn(),
    clearError: jest.fn(),
    ...mockAuthValue
  };

  const Providers = ({ children }: { children: React.ReactNode }) => (
    <MUIThemeProvider theme={mockMuiTheme}>
      <StyledThemeProvider theme={mockStyledTheme}>
        <AuthContext.Provider value={defaultAuthValue}>
          {children}
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );

  if (withRouter) {
    const router = createMemoryRouter(
      [{ path: "*", element: <Providers>{ui}</Providers> }],
      { 
        initialEntries: ['/'],
        future
      }
    );
    return render(<RouterProvider router={router} future={future} />, options);
  }

  return render(<Providers>{ui}</Providers>, options);
};
```

---

## /src/styles/global.css

```css
:root {
  /* Colors */
  --primary-color: #2C3E50;
  --secondary-color: #E74C3C;
  --accent-color: #3498DB;
  --text-color: #333;
  --light-bg: #f8f9fa;
  --white: #ffffff;
  
  /* Layout */
  --header-height: 64px;
  --max-width: 1200px;
  --border-radius: 8px;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  
  /* Typography */
  --font-family: 'Arial', sans-serif;
  --line-height: 1.6;
}

/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  line-height: var(--line-height);
  color: var(--text-color);
}

/* Layout Components */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-lg);
  width: 100%;
}

.page-container {
  padding-top: var(--header-height);
}

/* Common Components */
.card {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: transform 0.2s;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--accent-color);
  color: var(--white);
  border: none;
}

.btn-secondary {
  background-color: var(--white);
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
}

.btn:hover {
  transform: translateY(-2px);
}

/* Forms */
.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-family: inherit;
}

/* Responsive Utilities */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-sm);
  }
}
```

---

## /src/styles/global.ts

```typescript
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
    line-height: 1.5;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font: inherit;
  }

  ul, ol {
    list-style: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    html {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle;
```

---

## /src/styles/theme.js

```javascript

```

---

## /src/styles/components/common.ts

```typescript
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

interface ButtonProps extends ThemeProps {
  $variant?: 'primary' | 'secondary';
}

export const Container = styled(m.div)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }: ThemeProps) => theme.spacing.md};
`;

export const Section = styled.section`
  padding: ${({ theme }: ThemeProps) => theme.spacing.xl} 0;
`;

export const Card = styled(m.div)`
  background: ${({ theme }: ThemeProps) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: ${({ theme }: ThemeProps) => theme.spacing.lg};
`;

export const Button = styled(m.button)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }: ThemeProps) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: 4px;
  font-weight: 600;
  background: ${({ theme, $variant }: ButtonProps) => 
    $variant === 'secondary' 
      ? theme.palette.secondary.main 
      : theme.palette.primary.main};
  color: white;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme, $variant }: ButtonProps) => 
      $variant === 'secondary' 
        ? theme.palette.secondary.dark 
        : theme.palette.primary.dark};
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StylesGrid = styled(m.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StyleCard = styled(m.div)`
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
```

---

## /.vscode/settings.json

```json
{
    "github.copilot.chat.followUps": "always",
    "github.copilot.chat.scopeSelection": true,
    "github.copilot.chat.edits.codesearch.enabled": true,
    "github.copilot.nextEditSuggestions.enabled": true,
    "github.copilot.chat.completionContext.typescript.mode": "on",
    "github.copilot.chat.editor.temporalContext.enabled": true,
    "github.copilot.chat.enableUserPreferences": true,
    "github.copilot.chat.generateTests.codeLens": true,
    "github.copilot.chat.languageContext.typescript.enabled": true,
    "github.copilot.chat.search.semanticTextResults": true,
    "files.autoSave": "afterDelay",
    "editor.wordWrap": "on",
    "github.copilot.chat.codeGeneration.useInstructionFiles": true,
    "github.copilot.chat.edits.temporalContext.enabled": true,

    "github.copilot.chat.testGeneration.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.test.tsx",
            "instructions": "Generate unit tests using Jest & React Testing Library. Cover both success and failure cases. Use Mock Service Worker (MSW) for API mocking."
        },
        {
            "file": "",
            "filePattern": "backend/tests/**/*.py",
            "instructions": "Use FastAPI TestClient and Pytest for backend tests. Ensure JWT authentication and RBAC security tests are included."
        },
        {
            "file": "",
            "filePattern": "src/pages/**/*.test.tsx",
            "instructions": "For integration tests, use Cypress with end-to-end scenarios covering user authentication, navigation, and API calls."
        }
    ],

    "github.copilot.chat.commitMessageGeneration.instructions": [
        {
            "file": "",
            "filePattern": "*",
            "instructions": "Format commit messages using Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`. Provide a short, clear summary in the present tense."
        }
    ],

    "github.copilot.chat.reviewSelection.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.tsx",
            "instructions": "Ensure TypeScript compliance, proper prop typing, and React best practices. Avoid inline styles; prefer Styled Components or Tailwind CSS."
        },
        {
            "file": "",
            "filePattern": "backend/**/*.py",
            "instructions": "Ensure FastAPI routes use Pydantic models for validation, JWT authentication, and RBAC. Implement proper error handling and response models."
        },
        {
            "file": "",
            "filePattern": ".github/workflows/*.yml",
            "instructions": "Validate CI/CD pipeline integrity. Ensure workflows include ESLint, Jest, Cypress, and dependency security scans."
        }
    ],

    "github.copilot.chat.codeReview.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.tsx",
            "instructions": "Check for performance optimizations, React hooks best practices, and clean code formatting. Ensure absolute imports are used."
        },
        {
            "file": "",
            "filePattern": "backend/**/*.py",
            "instructions": "Validate API endpoint security, response models, and authentication handling. Ensure database queries use ORM best practices."
        },
        {
            "file": "",
            "filePattern": "firestore.rules",
            "instructions": "Ensure Firestore security rules enforce RBAC. No public read/write access unless explicitly required."
        }
    ],
    "github-actions.workflows.pinned.workflows": []
}
```

---

## /dataconnect-generated/js/default-connector/README.md

```markdown
#  Generated TypeScript README
This README will guide you through the process of using the generated TypeScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@firebasegen/default-connector` as shown below. Both CommonJS and ESM imports are supported.
You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

# Accessing the connector
A connector is a collection of queries and mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

In order to call Data Connect queries and mutations, you need to create an instance of the connector in your application code.

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const connector: DataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```javascript
// add connectDataConnectEmulator to your imports 
import { connectDataConnectEmulator, getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const connector: DataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(connector, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK. 

# Queries
No queries were generated for the `default` connector.

If you want to learn more about how to use queries in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

# Mutations
No mutations were generated for the `default` connector.

If you want to learn more about how to use mutations in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).
```

---

## /dataconnect-generated/js/default-connector/index.cjs.js

```javascript
const connectorConfig = {
  connector: 'default',
  service: 'geaux-academy',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;
```

---

## /dataconnect-generated/js/default-connector/index.d.ts

```typescript
import { ConnectorConfig, DataConnect } from 'firebase/data-connect';
export const connectorConfig: ConnectorConfig;

export type TimestampString = string;

export type UUIDString = string;

export type Int64String = string;

export type DateString = string;
```

---

## /dataconnect-generated/js/default-connector/package.json

```json
{
  "name": "@firebasegen/default-connector",
  "version": "1.0.0",
  "author": "Firebase <firebase-support@google.com> (https://firebase.google.com/)",
  "description": "Generated SDK For default",
  "license": "Apache-2.0",
  "engines": {
    "node": " >=18.0"
  },
  "typings": "index.d.ts",
  "module": "esm/index.esm.js",
  "main": "index.cjs.js",
  "browser": "esm/index.esm.js",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "require": "./index.cjs.js",
      "default": "./esm/index.esm.js"
    },
    "./package.json": "./package.json"
  },
  "peerDependencies": {
    "firebase": "^10.14.0 || ^11.0.0"
  }
}
```

---

## /dataconnect-generated/js/default-connector/esm/index.esm.js

```javascript
export const connectorConfig = {
  connector: 'default',
  service: 'geaux-academy',
  location: 'us-central1'
};
```

---

## /dataconnect-generated/js/default-connector/esm/package.json

```json
{"type":"module"}
```

---

