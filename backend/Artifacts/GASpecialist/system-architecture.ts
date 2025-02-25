// Core types and interfaces for the Geaux product suite

// Shared authentication and user management
interface BaseUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

enum UserRole {
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  EDUCATOR = 'EDUCATOR',
  ADMIN = 'ADMIN',
  CAREGIVER = 'CAREGIVER'
}

// Geaux Academy specific types
interface LearningProfile {
  userId: string;
  learningStyle: LearningStyle[];
  preferences: UserPreferences;
  assessmentResults: AssessmentResult[];
}

interface LearningStyle {
  type: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing';
  strength: number; // 0-100
  recommendations: string[];
}

// Geaux HelpED specific types
interface HealthcareProfile {
  patientId: string;
  caregiverId: string;
  medicalHistory: MedicalRecord[];
  appointments: Appointment[];
  medications: Medication[];
  tasks: CareTask[];
}

interface CareTask {
  id: string;
  patientId: string;
  type: TaskType;
  dueDate: Date;
  priority: Priority;
  status: TaskStatus;
  notes?: string;
}

// ReanimatED Echos specific types
interface VoiceProfile {
  id: string;
  userId: string;
  originalAudioUrl: string;
  voiceFeatures: VoiceFeatures;
  consentVerified: boolean;
  createdAt: Date;
}

interface VoiceFeatures {
  pitch: number;
  tempo: number;
  timbre: number[];
  characteristics: string[];
}

// Geaux Emporium specific types
interface Product {
  id: string;
  type: ProductType;
  title: string;
  description: string;
  price: number;
  creatorId: string;
  relatedCourseIds?: string[];
}

// Base service interface for all products
abstract class BaseService<T> {
  abstract create(data: Partial<T>): Promise<T>;
  abstract get(id: string): Promise<T>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<void>;
  abstract list(filters?: FilterOptions): Promise<T[]>;
}

// Security middleware
class SecurityMiddleware {
  constructor(private authService: AuthenticationService) {}

  async authenticate(req: Request): Promise<BaseUser> {
    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedError('Invalid token');
    }

    return user;
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

// Base error handling
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Database connection management
class DatabaseManager {
  private static instance: DatabaseManager;
  private connections: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async getConnection(service: string) {
    if (!this.connections.has(service)) {
      // Initialize connection based on service
      const connection = await this.initializeConnection(service);
      this.connections.set(service, connection);
    }
    return this.connections.get(service);
  }

  private async initializeConnection(service: string) {
    // Implementation varies based on service requirements
    switch (service) {
      case 'academy':
        return this.initPostgres(process.env.ACADEMY_DB_URL);
      case 'helped':
        return this.initMongo(process.env.HELPED_DB_URL);
      // Add other services as needed
      default:
        throw new Error(`Unknown service: ${service}`);
    }
  }
}

// Telemetry and monitoring
class TelemetryService {
  private metrics: Map<string, number> = new Map();

  recordMetric(name: string, value: number) {
    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, current + value);
  }

  async flush() {
    // Implementation to send metrics to monitoring service
    const metrics = Array.from(this.metrics.entries());
    await this.sendToMonitoring(metrics);
    this.metrics.clear();
  }

  private async sendToMonitoring(metrics: [string, number][]) {
    // Implementation depends on monitoring solution (e.g., Prometheus)
  }
}
