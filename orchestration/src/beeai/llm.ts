import { z } from "zod";
import { ChatModel } from "beeai-framework/backend/chat";
import { SystemMessage, UserMessage } from "beeai-framework/backend/message";

const classifierSchema = z.object({
  scores: z.object({
    v: z.number(),
    a: z.number(),
    r: z.number(),
    k: z.number(),
  }),
  confidence: z.number(),
});

export type VarkClassifierResult = z.infer<typeof classifierSchema>;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

export async function probeLLM(): Promise<{
  provider: "vertex";
  model: string;
  text: string;
}> {
  const modelName = requiredEnv("LLM_CHAT_MODEL_NAME");

  const model = await ChatModel.fromName(modelName as any);
  const output = await model.create({
    messages: [new UserMessage('Reply with exactly "OK". Do not add any other text.')],
  });

  const text = output.getTextContent().trim();
  if (text !== "OK") {
    throw new Error(`unexpected LLM response: ${text}`);
  }

  return { provider: "vertex", model: modelName, text };
}

export async function classifyVarkResponse(input: string): Promise<VarkClassifierResult> {
  const modelName = requiredEnv("LLM_CHAT_MODEL_NAME");

  const model = await ChatModel.fromName(modelName as any);
  const { object } = await model.createStructure({
    messages: [
      new SystemMessage(
        [
          "You are a classifier for VARK learning preferences.",
          "Return JSON with numeric scores for v, a, r, k between 0 and 1 and a confidence between 0 and 1.",
          "Scores should sum to 1. Output only JSON that matches the schema.",
        ].join(" "),
      ),
      new UserMessage(
        [
          "Student response:",
          input,
          "",
          'Return JSON: {"scores":{"v":0,"a":0,"r":0,"k":0},"confidence":0}',
        ].join("\n"),
      ),
    ],
    schema: classifierSchema,
  });

  // ✅ Narrow unknown -> VarkClassifierResult (and validate at runtime)
  return classifierSchema.parse(object);
}

export function logLlmProbeError(
  error: unknown,
  context: { model: string; projectId: string; region: string },
): void {
  const err = error as { message?: string; name?: string; code?: string };
  console.error("probe_llm_failed", {
    model: context.model,
    projectId: context.projectId,
    region: context.region,
    message: err?.message ?? "unknown error",
    name: err?.name ?? "Error",
    code: err?.code ?? "unknown",
  });
}
