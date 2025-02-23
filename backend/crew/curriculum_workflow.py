from crewai import Crew, Agent, Task
from config.agents import agents
from config.tasks import tasks

# Define agents
assessment_analyzer = Agent(**agents["assessment-analyzer"])
curriculum_designer = Agent(**agents["curriculum-designer"])
content_recommender = Agent(**agents["content-recommender"])

# Define tasks
assessment_task = Task(**tasks["assessment-analysis-task"], agent=assessment_analyzer)
curriculum_task = Task(**tasks["curriculum-generation-task"], agent=curriculum_designer)
resource_task = Task(**tasks["resource-recommendation-task"], agent=content_recommender)

# Assemble Crew Workflow
curriculum_crew = Crew(
    id="curriculum-crew",
    name="AI-Powered Curriculum Generator",
    agents=[assessment_analyzer, curriculum_designer, content_recommender],
    tasks=[assessment_task, curriculum_task, resource_task],
    workflow="sequential"
)

# Function to execute the curriculum generation workflow
def generate_curriculum(assessment_id):
    result = curriculum_crew.run({"assessment_id": assessment_id})
    return result
