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

class StudentCreate(BaseModel):
    name: str

class StudentUpdate(BaseModel):
    name: str

class Student(StudentCreate):
    id: int

students_db = {}

@app.post("/students", response_model=Student)
async def create_student(student: StudentCreate):
    new_id = len(students_db) + 1
    new_student = Student(id=new_id, name=student.name)
    students_db[new_id] = new_student
    return new_student

@app.get("/students/{student_id}", response_model=Student)
async def get_student(student_id: int):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: int, student_update: StudentUpdate):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    updated_student = Student(id=student_id, name=student_update.name)
    students_db[student_id] = updated_student
    return updated_student

@app.delete("/students/{student_id}")
async def delete_student(student_id: int):
    student = students_db.pop(student_id, None)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"detail": "Student deleted successfully"}
