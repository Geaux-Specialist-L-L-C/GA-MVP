import { Agent, Task, CrewAIClient } from 'crewai';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot,
  writeBatch 
} from 'firebase/firestore';
import { AgentMessage, AgentRole, TaskPriority } from '../types/agents';

interface AgentContext {
  role: AgentRole;
  knowledge: string[];
  capabilities: Set<string>;
  taskHistory: TaskResult[];
  performance: AgentPerformance;
}

interface TaskResult {
  taskId: string;
  success: boolean;
  confidence: number;
  duration: number;
  outputs: any[];
}

class AdvancedAgentSystem {
  private readonly agents: Map<string, Agent>;
  private readonly contexts: Map<string, AgentContext>;
  private readonly messageQueue: Subject<AgentMessage>;
  private readonly taskResults: BehaviorSubject<TaskResult[]>;
  private readonly firestore: FirebaseFirestore.Firestore;

  constructor(
    firestore: FirebaseFirestore.Firestore,
    crewAI: CrewAIClient
  ) {
    this.firestore = firestore;
    this.agents = new Map();
    this.contexts = new Map();
    this.messageQueue = new Subject<AgentMessage>();
    this.taskResults = new BehaviorSubject<TaskResult[]>([]);

    // Initialize core agents
    this.initializeAgents(crewAI);
    this.setupMessageHandling();
    this.setupPerformanceMonitoring();
  }

  private initializeAgents(crewAI: CrewAIClient): void {
    // Content Strategy Agent
    const strategist = new Agent({
      name: 'ContentStrategist',
      role: AgentRole.STRATEGIST,
      goal: 'Design optimal learning pathways and content strategies',
      backstory: 'Expert in educational design and content strategy',
      allowDelegation: true,
      verbose: true,
      tools: [
        'pathwayDesign',
        'contentPlanning',
        'strategyOptimization'
      ]
    });

    // Adaptation Specialist
    const adapter = new Agent({
      name: 'AdaptationSpecialist',
      role: AgentRole.ADAPTER,
      goal: 'Adapt and personalize learning content',
      backstory: 'Specialist in content adaptation and personalization',
      allowDelegation: true,
      verbose: true,
      tools: [
        'contentAdaptation',
        'personalizationEngine',
        'difficultyAdjustment'
      ]
    });

    // Learning Analyst
    const analyst = new Agent({
      name: 'LearningAnalyst',
      role: AgentRole.ANALYST,
      goal: 'Analyze learning patterns and optimize outcomes',
      backstory: 'Expert in learning analytics and pattern recognition',
      allowDelegation: true,
      verbose: true,
      tools: [
        'performanceAnalysis',
        'patternRecognition',
        'predictiveModeling'
      ]
    });

    // Quality Assurance Agent
    const validator = new Agent({
      name: 'QualityAssurance',
      role: AgentRole.VALIDATOR,
      goal: 'Ensure content quality and standards compliance',
      backstory: 'Expert in educational standards and quality control',
      allowDelegation: true,
      verbose: true,
      tools: [
        'contentValidation',
        'standardsCompliance',
        'accessibilityChecking'
      ]
    });

    // Add agents to system
    this.agents.set('strategist', strategist);
    this.agents.set('adapter', adapter);
    this.agents.set('analyst', analyst);
    this.agents.set('validator', validator);

    // Initialize contexts
    this.initializeContexts();
  }

  private initializeContexts(): void {
    this.agents.forEach((agent, id) => {
      this.contexts.set(id, {
        role: agent.role,
        knowledge: [],
        capabilities: new Set(),
        taskHistory: [],
        performance: {
          successRate: 0,
          avgConfidence: 0,
          avgDuration: 0
        }
      });
    });
  }

  private setupMessageHandling(): void {
    this.messageQueue.pipe(
      filter(msg => this.validateMessage(msg)),
      mergeMap(msg => this.processMessage(msg))
    ).subscribe(
      result => this.handleTaskResult(result),
      error => console.error('Message processing error:', error)
    );
  }

  private setupPerformanceMonitoring(): void {
    // Monitor agent performance metrics
    setInterval(() => {
      this.contexts.forEach((context, agentId) => {
        this.updateAgentPerformance(agentId);
      });
    }, 60000); // Update every minute
  }

  /**
   * Execute a complex task using multiple agents
   * @param task Initial task description
   * @param priority Task priority level
   */
  public async executeComplexTask(
    task: Task,
    priority: TaskPriority = TaskPriority.NORMAL
  ): Promise<TaskResult[]> {
    try {
      // Initialize task context
      const taskContext = {
        id: `task_${Date.now()}`,
        priority,
        startTime: Date.now(),
        involvedAgents: new Set<string>()
      };

      // Analyze task requirements
      const requirements = await this.analyzeTaskRequirements(task);

      // Select primary agent
      const primaryAgent = this.selectPrimaryAgent(requirements);
      taskContext.involvedAgents.add(primaryAgent);

      // Create subtasks
      const subtasks = await this.createSubtasks(task, requirements);

      // Execute subtasks with appropriate agents
      const results = await Promise.all(
        subtasks.map(subtask => 
          this.executeSubtask(subtask, taskContext)
        )
      );

      // Validate results
      const validationResult = await this.validateResults(results);

      // Store task results
      await this.storeTaskResults(taskContext.id, results);

      return results;
    } catch (error) {
      console.error('Complex task execution failed:', error);
      throw error;
    }
  }

  /**
   * Add knowledge to agent context
   * @param agentId Agent identifier
   * @param knowledge New knowledge to add
   */
  public async enhanceAgentKnowledge(
    agentId: string,
    knowledge: string[]
  ): Promise<void> {
    const context = this.contexts.get(agentId);
    if (!context) throw new Error(`Agent ${agentId} not found`);

    context.knowledge.push(...knowledge);
    await this.updateAgentContext(agentId, context);
  }

  /**
   * Get agent performance metrics
   * @param agentId Agent identifier
   */
  public getAgentPerformance(
    agentId: string
  ): Observable<AgentPerformance> {
    return new Observable(subscriber => {
      const unsubscribe = onSnapshot(
        doc(this.firestore, 'agentPerformance', agentId),
        (snapshot) => {
          if (snapshot.exists()) {
            subscriber.next(snapshot.data() as AgentPerformance);
          }
        },
        error => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }

  private async analyzeTaskRequirements(
    task: Task
  ): Promise<TaskRequirements> {
    const analyst = this.agents.get('analyst');
    if (!analyst) throw new Error('Analyst agent not found');

    const analysisTask = new Task({
      description: 'Analyze task requirements and complexity',
      parameters: {
        task,
        context: this.getGlobalContext()
      }
    });

    return await analyst.execute(analysisTask);
  }

  private selectPrimaryAgent(
    requirements: TaskRequirements
  ): string {
    // Select agent based on requirements and performance history
    let bestMatch: { agentId: string; score: number } = {
      agentId: '',
      score: 0
    };

    this.contexts.forEach((context, agentId) => {
      const score = this.calculateAgentScore(context, requirements);
      if (score > bestMatch.score) {
        bestMatch = { agentId, score };
      }
    });

    return bestMatch.agentId;
  }

  private async createSubtasks(
    task: Task,
    requirements: TaskRequirements
  ): Promise<Task[]> {
    const strategist = this.agents.get('strategist');
    if (!strategist) throw new Error('Strategist agent not found');

    const planningTask = new Task({
      description: 'Create optimal subtask breakdown',
      parameters: {
        task,
        requirements,
        constraints: this.getSystemConstraints()
      }
    });

    return await strategist.execute(planningTask);
  }

  private async executeSubtask(
    subtask: Task,
    taskContext: TaskContext
  ): Promise<TaskResult> {
    const agent = this.agents.get(this.selectAgentForSubtask(subtask));
    if (!agent) throw new Error('No suitable agent found for subtask');

    // Add to task context
    taskContext.involvedAgents.add(agent.name);

    // Execute subtask
    const result = await agent.execute(subtask);

    // Validate result
    const validator = this.agents.get('validator');
    if (validator) {
      const validationTask = new Task({
        description: 'Validate subtask result',
        parameters: {
          result,
          requirements: subtask.requirements
        }
      });
      await validator.execute(validationTask);
    }

    return {
      taskId: subtask.id,
      success: true,
      confidence: result.confidence,
      duration: Date.now() - taskContext.startTime,
      outputs: result.outputs
    };
  }

  private async validateResults(
    results: TaskResult[]
  ): Promise<ValidationResult> {
    const validator = this.agents.get('validator');
    if (!validator) throw new Error('Validator agent not found');

    const validationTask = new Task({
      description: 'Validate overall task results',
      parameters: {
        results,
        requirements: this.getValidationRequirements()
      }
    });

    return await validator.execute(validationTask);
  }

  private async updateAgentPerformance(agentId: string): Promise<void> {
    const context = this.contexts.get(agentId);
    if (!context) return;

    const recentTasks = context.taskHistory.slice(-10);
    const performance = {
      successRate: recentTasks.filter(t => t.success).length / recentTasks.length,
      avgConfidence: recentTasks.reduce((sum, t) => sum + t.confidence, 0) / recentTasks.length,
      avgDuration: recentTasks.reduce((sum, t) => sum + t.duration, 0) / recentTasks.length
    };

    await setDoc(
      doc(this.firestore, 'agentPerformance', agentId),
      performance
    );
  }

  private async storeTaskResults(
    taskId: string,
    results: TaskResult[]
  ): Promise<void> {
    const batch = writeBatch(this.firestore);
    
    results.forEach(result => {
      const resultRef = doc(
        collection(this.firestore, 'taskResults'),
        `${taskId}_${result.taskId}`
      );
      batch.set(resultRef, {
        ...result,
        timestamp: Date.now()
      });
    });

    await batch.commit();
  }
}

// React hook for advanced agent interactions
export const useAdvancedAgents = (
  firestore: FirebaseFirestore.Firestore,
  crewAI: CrewAIClient
) => {
  const system = useMemo(
    () => new AdvancedAgentSystem(firestore, crewAI),
    [firestore, crewAI]
  );

  const executeComplexTask = useCallback(async (
    task: Task,
    priority?: TaskPriority
  ) => {
    return await system.executeComplexTask(task, priority);
  }, [system]);

  const enhanceAgentKnowledge = useCallback(async (
    agentId: string,
    knowledge: string[]
  ) => {
    await system.enhanceAgentKnowledge(agentId, knowledge);
  }, [system]);

  const getAgentPerformance = useCallback((
    agentId: string
  ) => {
    return system.getAgentPerformance(agentId);
  }, [system]);

  return {
    executeComplexTask,
    enhanceAgentKnowledge,
    getAgentPerformance
  };
};
