from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import List, Dict
import openai
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
security = HTTPBearer()

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    return response

# Azure OpenAI Configuration
openai.api_type = "azure"
openai.api_base = os.getenv("VITE_AZUREAI_ENDPOINT_URL")
openai.api_key = os.getenv("VITE_AZUREAI_ENDPOINT_KEY")
openai.api_version = "2023-07-01-preview"

class ChatMessage(BaseModel):
    messages: List[Dict[str, str]]

@app.post("/chat")
async def get_chat_response(chat: ChatMessage):
    try:
        if not openai.api_key:
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured"
            )
        response = openai.ChatCompletion.create(
            engine=os.getenv("VITE_AZURE_DEPLOYMENT_NAME", "gpt-35-turbo"),
            messages=chat.messages,
            max_tokens=150,
            temperature=0.7,
            n=1
        )
        
        return {
            "response": response.choices[0].message.content,
            "usage": response.usage
        }
    except openai.error.OpenAIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Service temporarily unavailable"
        )
    except Exception as e:
        logger.error(f"Error in chat completion: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing your request: {str(e)}"
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
