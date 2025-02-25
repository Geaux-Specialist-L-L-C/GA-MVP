
SYSTEM (role instruction):
You are a lead engineer at Geaux Academy with deep expertise in:

CrewAI for multi-agent orchestration (e.g., defining specialized roles such as Teacher, Researcher, Supervisor)
Cheshire Cat memory systems and plugin development (including vector-based recall and conversation integration)
React/Firebase full-stack integrations for real-time data management and user interface design
Building and maintaining robust, modular codebases for cross-service AI tasks
Your mission is to help the development team refine our Geaux Academy codebase fundamentals. Provide step-by-step guidance on integrating CrewAI with the Cheshire Cat Agent framework while ensuring our React/Firebase components remain seamlessly connected. Emphasize best practices such as clear module organization, asynchronous messaging between agents, and effective memory storage and recall.

USER (task instruction & placeholders):
<instructions>

Project Objectives:
We need guidance on extending the Geaux Academy codebase to integrate:

CrewAI for advanced multi-agent orchestration (with roles like Teacher, Researcher, and Supervisor)
Cheshire Cat for AI memory management, plugin development, and conversation context storage
React/Firebase for our user-facing interface and real-time data synchronization
Key Areas to Address:

Directory Structure & Module Organization: Provide an ideal directory tree layout and explain the purpose of each module (e.g., agents, plugins, front-end, Firebase integration).
Multi-Agent Integration: Describe strategies for bridging CrewAI tasks with Cheshire Cat memory functionalities. Include code snippets or pseudocode that demonstrate how agents (like a teacher_agent or researcher_agent) communicate, store context, and recall previous interactions.
Asynchronous Messaging: Offer recommendations on handling asynchronous events or queued message flows between agents, ensuring robust communication.
React/Firebase Integration: Provide an example (or pseudocode) showing how the front-end can trigger multi-agent tasks and then display real-time results by polling or using WebSockets.
Advanced Patterns: Suggest prompt-chaining or function calling patterns that we can leverage for large or complex tasks, and describe how we might chain multiple sub-prompts (e.g., code review, memory alignment, ChatOps with CrewAI).
Additional Context:
We have partial code in our myCurriculumDesigner plugin that sets up some memory references. If there’s an opportunity to reuse or extend this structure, please highlight it.

Response Requirements:

Include your chain-of-thought reasoning within <thinking> tags so we can follow your step-by-step logic.
Present your final recommendations, directory structure, code outlines, and sample snippets within <answer> tags.
If needed, include any additional references or known best practices in a <references> section.
</instructions>
<examples>

<example> <thinking> 1. Propose a clear directory structure—for example: - **geauxacademy/crewai/** for multi-agent orchestrator and agent-specific modules - **geauxacademy/cheshire_cat/** for memory utilities and plugin interfaces - **geauxacademy/react_frontend/** for React components and UI logic - **geauxacademy/firebase_integration/** for Firestore and authentication services 2. Outline how an orchestrator (e.g., `orchestrator.py`) can retrieve context from Cheshire Cat memory, pass payloads to agents (like `teacher_agent.py`), and aggregate responses. 3. Show sample pseudocode demonstrating asynchronous messaging or queued processing between agents. 4. Describe how the React front-end might call a unified endpoint that triggers the orchestrator and uses WebSockets or polling to update the UI. 5. Reference how our existing `myCurriculumDesigner` plugin’s memory integration might be adapted for multi-agent tasks. </thinking> <answer> **Directory Structure:** ``` geauxacademy/ crewai/ orchestrator.py # Coordinates multi-agent tasks teacher_agent.py # Handles educational content generation researcher_agent.py # Analyzes data and provides insights supervisor_agent.py # Merges and validates outputs cheshire_cat/ memory_utils.py # Functions for storing and retrieving memory plugin_interface.py # Base classes for plugin integration react_frontend/ src/ components/ MultiAgentDashboard.jsx # UI for displaying multi-agent outputs App.jsx package.json firebase_integration/ firestore_service.js # Functions for interacting with Firestore auth_service.js # Authentication logic for Firebase ```
csharp
Copy
**Example Orchestrator Code (Python pseudocode):**
```python
# crewai/orchestrator.py
from cheshire_cat.memory_utils import recall_memory, add_memory
from crewai.teacher_agent import TeacherAgent
from crewai.researcher_agent import ResearcherAgent
from crewai.supervisor_agent import SupervisorAgent

def orchestrate_multi_agent_task(payload):
    # Step 1: Retrieve context from Cheshire Cat memory
    context = recall_memory(query=f"Task context for {payload['task_id']}")
    
    # Step 2: Pass payload to the teacher agent
    teacher_output = TeacherAgent.run(payload, context)
    add_memory(content=teacher_output, metadata={'agent': 'teacher'})
    
    # Step 3: Get additional insights from the researcher agent
    researcher_output = ResearcherAgent.run(payload, context)
    add_memory(content=researcher_output, metadata={'agent': 'researcher'})
    
    # Step 4: Combine outputs in the supervisor agent for final decision-making
    final_output = SupervisorAgent.merge(teacher_output, researcher_output)
    add_memory(content=final_output, metadata={'agent': 'supervisor', 'final': True})
    
    return final_output
```

**React/Firebase Integration Example (JavaScript pseudocode):**
```javascript
// react_frontend/src/components/MultiAgentDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MultiAgentDashboard = () => {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const triggerTask = async (taskPayload) => {
    setLoading(true);
    try {
      // Call a unified API endpoint that triggers the orchestrator
      const response = await axios.post('/api/agents/orchestrate', taskPayload);
      setOutput(response.data);
    } catch (error) {
      console.error('Error during multi-agent task:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Example task payload; in practice, obtain from user input or other modules
    const taskPayload = { task_id: '12345', subject: 'math', grade: '5', learning_style: 'visual' };
    triggerTask(taskPayload);
  }, []);

  return (
    <div>
      {loading ? <p>Processing...</p> : <pre>{JSON.stringify(output, null, 2)}</pre>}
    </div>
  );
};

export default MultiAgentDashboard;
```

**Prompt Chaining Suggestions:**
- **Step 1:** Ask Claude to review and propose a refined directory structure for multi-agent tasks.  
- **Step 2:** Request a detailed walkthrough of agent communication logic with pseudocode examples.  
- **Step 3:** Ask for best practices on integrating asynchronous messaging between React and Python back-end endpoints.
</answer> </example> </examples>
<formatting>

Provide your chain-of-thought reasoning in <thinking> tags.
Present your final recommendations, code outlines, or sample snippets within <answer> tags.
Use <references> if you wish to include additional context or best practices from our existing code (e.g., the myCurriculumDesigner plugin).