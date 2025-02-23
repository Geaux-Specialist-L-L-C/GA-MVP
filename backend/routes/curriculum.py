from fastapi import APIRouter, Depends, HTTPException
from auth.jwt import get_current_user, role_required
from models.assessment import Assessment
from schemas.curriculum import CurriculumRequest, CurriculumResponse
from crew.curriculum_workflow import generate_curriculum

router = APIRouter(prefix="/api/curriculum", tags=["curriculum"])

@router.post("/generate", dependencies=[Depends(role_required("parent"))])
async def generate_personalized_curriculum(
    request: CurriculumRequest,
    current_user: dict = Depends(get_current_user)
) -> CurriculumResponse:
    """Generate a personalized curriculum based on a student's assessment."""
    
    assessment = Assessment.get(request.assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    if assessment.student.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Unauthorized to generate curriculum")

    curriculum_result = generate_curriculum(request.assessment_id)
    
    return CurriculumResponse(
        student_id=assessment.student_id,
        assessment_id=request.assessment_id,
        curriculum=curriculum_result["curriculum_plan"],
        resources=curriculum_result["learning_resources"]
    )
