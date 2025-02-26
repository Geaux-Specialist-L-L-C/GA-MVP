from crewai import Agent
from crewai_tools import SerperDevTool

# Define the search tool
search_tool = SerperDevTool()

# Educational Researcher Agent
researcher = Agent(
    role="Educational Researcher",
    goal="Gather grade-appropriate curriculum materials for the student.",
    verbose=True,
    memory=True,
    backstory=(
        "You have a deep understanding of educational resources and know how to find the best "
        "materials suited to a student's grade level."
    ),
    tools=[search_tool],
)

# Curriculum Developer Agent
compiler = Agent(
    role="Curriculum Developer",
    goal="Organize the researched materials into a comprehensive study program for the student.",
    verbose=True,
    memory=True,
    backstory=(
        "You excel at organizing educational content into structured programs that students can easily follow."
    ),
)
