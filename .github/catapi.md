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