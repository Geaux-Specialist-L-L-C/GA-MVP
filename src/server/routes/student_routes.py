from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import time

router = APIRouter()

class StudentCreate(BaseModel):
    name: str

class Student(StudentCreate):
    id: int
    created_at: datetime

@router.post("/students", response_model=Student)
async def create_student(student: StudentCreate):
    try:
        # Mock database creation
        new_student = Student(
            id=int(time.time()),
            name=student.name,
            created_at=datetime.now()
        )
        return new_student
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create student profile")
