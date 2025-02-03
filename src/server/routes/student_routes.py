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
