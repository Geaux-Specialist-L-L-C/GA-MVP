// File: functions/src/config/agentConfig.ts
import { Agent } from 'crewai-ts';

export const AGENT_CONFIGS = {
  PATTERN_DETECTOR: {
    role: "Pattern Detective",
    goal: "Identify recurring patterns in learning interactions",
    backstory: "Expert in behavioral pattern recognition with focus on educational interactions",
    allowDelegation: true,
    verbose: true,
    modelConfig: {
      model: "gpt-4-turbo",
      temperature: 0.7,
      maxTokens: 2000
    }
  },
  STYLE_ANALYZER: {
    role: "Learning Style Analyst",
    goal: "Determine optimal learning style based on interaction patterns",
    backstory: "Specialist in VARK learning style assessment and educational psychology",
    allowDelegation: true,
    verbose: true,
    modelConfig: {
      model: "gpt-4-turbo",
      temperature: 0.5,
      maxTokens: 2000
    }
  },
  CONFIDENCE_EVALUATOR: {
    role: "Confidence Assessor",
    goal: "Evaluate confidence levels in learning style predictions",
    backstory: "Expert in statistical analysis and confidence scoring",
    allowDelegation: true,
    verbose: true,
    modelConfig: {
      model: "gpt-4-turbo",
      temperature: 0.3,
      maxTokens: 2000
    }
  },
  CURRICULUM_CREATOR: {
    role: "Curriculum Creator",
    goal: "Generate comprehensive curriculum content",
    backstory: "Expert educator with experience in curriculum development",
    allowDelegation: true,
    verbose: true,
    modelConfig: {
      model: "gpt-4-turbo",
      temperature: 0.7,
      maxTokens: 4000
    }
  },
  CONTENT_ADAPTER: {
    role: "Content Adapter",
    goal: "Adapt curriculum content for specific learning styles",
    backstory: "Specialist in personalized learning and content adaptation",
    allowDelegation: true,
    verbose: true,
    modelConfig: {
      model: "gpt-4-turbo",
      temperature: 0.6,
      maxTokens: 3000
    }
  },
  QUALITY_ASSESSOR: {
    role: "Quality Controller",
    goal: "Ensure curriculum meets educational standards and effectiveness",
    backstory: "Educational quality assurance expert",
    allowDelegation: true,
    verbose: true,
    modelConfig: {
      model: "gpt-4-turbo",
      temperature: 0.4,
      maxTokens: 2000
    }
  }
} as const;

export type AgentType = keyof typeof AGENT_CONFIGS;

// File: functions/src/factories/agentFactory.ts
import { Agent } from 'crewai-ts';
import { logger } from "firebase-functions";
import { AGENT_CONFIGS, AgentType } from '../config/agentConfig';

export class AgentFactory {
  private static instance: AgentFactory;
  private agentCache: Map<AgentType, Agent>;

  private constructor() {
    this.agentCache = new Map();
  }

  public static getInstance(): AgentFactory {
    if (!AgentFactory.instance) {
      AgentFactory.instance = new AgentFactory();
    }
    return AgentFactory.instance;
  }

  public createAgent(type: AgentType): Agent {
    // Check cache first
    if (this.agentCache.has(type)) {
      return this.agentCache.get(type)!;
    }

    try {
      const config = AGENT_CONFIGS[type];
      const agent = new Agent(config);
      
      // Cache the agent
      this.agentCache.set(type, agent);
      
      logger.info(`Created agent: ${type}`);
      return agent;
    } catch (error) {
      logger.error(`Failed to create agent ${type}:`, error);
      throw error;
    }
  }

  public getOrCreateAgent(type: AgentType): Agent {
    return this.agentCache.get(type) || this.createAgent(type);
  }

  public clearCache(): void {
    this.agentCache.clear();
  }
}

// File: functions/src/services/agentManager.ts
import { Agent } from 'crewai-ts';
import { logger } from "firebase-functions";
import { AgentFactory } from '../factories/agentFactory';
import { AgentType } from '../config/agentConfig';
import { cheshireService } from './cheshire';

export class AgentManager {
  private factory: AgentFactory;
  private activeAgents: Map<string, Agent>;

  constructor() {
    this.factory = AgentFactory.getInstance();
    this.activeAgents = new Map();
  }

  async initializeAgent(
    type: AgentType,
    context?: Record<string, any>
  ): Promise<Agent> {
    try {
      const agent = this.factory.getOrCreateAgent(type);
      
      // Initialize agent context if provided
      if (context) {
        await this.initializeAgentContext(agent, context);
      }

      this.activeAgents.set(type, agent);
      return agent;
    } catch (error) {
      logger.error(`Failed to initialize agent ${type}:`, error);
      throw error;
    }
  }

  private async initializeAgentContext(
    agent: Agent,
    context: Record<string, any>
  ): Promise<void> {
    try {
      // Store context in Cheshire Cat memory
      await cheshireService.storeDeclarativeMemory(
        JSON.stringify(context),
        {
          agentId: agent.role,
          type: 'agent_context',
          timestamp: new Date().toISOString()
        }
      );

      logger.info(`Initialized context for agent: ${agent.role}`);
    } catch (error) {
      logger.error(`Failed to initialize agent context:`, error);
      throw error;
    }
  }

  getAgent(type: AgentType): Agent | undefined {
    return this.activeAgents.get(type);
  }

  shutdown(): void {
    this.activeAgents.clear();
    this.factory.clearCache();
  }
}
