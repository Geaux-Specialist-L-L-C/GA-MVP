from pydantic import BaseModel
from typing import List

class CurriculumRequest(BaseModel):
    assessment_id: str

class CurriculumResponse(BaseModel):
    student_id: str
    assessment_id: str
    curriculum: List[str]
    resources: List[str]
