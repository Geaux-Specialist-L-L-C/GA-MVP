export interface VertexConfig {
  project: string;
  location: string;
  model: string;
  temperature: number;
  maxOutputTokens: number;
  timeoutMs: number;
}

const DEFAULT_MODEL = 'gemini-1.5-flash';
const DEFAULT_TEMPERATURE = 0.2;
const DEFAULT_MAX_OUTPUT_TOKENS = 512;
const DEFAULT_TIMEOUT_MS = 20000;

let cachedConfig: VertexConfig | null | undefined;
let logged = false;

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const logConfigOnce = (config: VertexConfig | null) => {
  if (logged) return;
  logged = true;

  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (!config) {
    console.info('[ga-assessment-service] Vertex disabled, using stub provider.');
    return;
  }

  console.info(
    `[ga-assessment-service] Vertex enabled (project=${config.project}, location=${config.location}, model=${config.model}).`
  );
};

export const getVertexConfig = (): VertexConfig | null => {
  if (cachedConfig !== undefined) {
    return cachedConfig;
  }

  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.VERTEX_REGION ?? process.env.VERTEX_LOCATION;

  if (!project || !location) {
    cachedConfig = null;
    logConfigOnce(cachedConfig);
    return cachedConfig;
  }

  cachedConfig = {
    project,
    location,
    model: process.env.VERTEX_MODEL ?? DEFAULT_MODEL,
    temperature: parseNumber(process.env.VERTEX_TEMPERATURE, DEFAULT_TEMPERATURE),
    maxOutputTokens: parseNumber(process.env.VERTEX_MAX_TOKENS, DEFAULT_MAX_OUTPUT_TOKENS),
    timeoutMs: parseNumber(process.env.VERTEX_TIMEOUT_MS, DEFAULT_TIMEOUT_MS)
  };

  logConfigOnce(cachedConfig);
  return cachedConfig;
};

export const resetVertexConfigCache = () => {
  cachedConfig = undefined;
  logged = false;
};
