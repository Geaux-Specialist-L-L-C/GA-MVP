from .config.agents import researcher, compiler
from .config.tasks import research_task, compilation_task
from crewai import Crew, Process

# Define the crew
education_crew = Crew(
    agents=[researcher, compiler],
    tasks=[research_task, compilation_task],
    process=Process.sequential,
)
  ## ya