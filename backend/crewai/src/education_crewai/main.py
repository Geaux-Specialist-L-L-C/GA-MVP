from dotenv import load_dotenv
import os
from src.education_crewai.crew import education_crew  # This import should be here

# Load environment variables from .env file
load_dotenv()

# Verify that the API key is loaded
assert os.getenv("OPENAI_API_KEY") is not None, "OPENAI_API_KEY is not set"
assert os.getenv("SERPER_API_KEY") is not None, "SERPER_API_KEY is not set"

if __name__ == "__main__":
    # Kickoff the crew with inputs
    result = education_crew.kickoff(inputs={"grade_level": "5th Grade"})
    print(result)

    # Save the result to a file (optional)
    with open("structured_educational_program.txt", "w") as file:
        file.write(result)
