export const GRADE_BANDS = ["K-2", "3-5", "6-8", "9-12"] as const;
export type GradeBand = (typeof GRADE_BANDS)[number];

export type VarkModality = "V" | "A" | "R" | "K";
export interface VarkScores {
  v: number;
  a: number;
  r: number;
  k: number;
}
const MODALITIES: readonly VarkModality[] = ["V", "A", "R", "K"];
export interface VarkOption {
  key: "A" | "B" | "C" | "D";
  text: string;
  mapsTo: VarkModality;
}
export interface VarkQuestion {
  id: string;
  text: string;
  options: VarkOption[];
  target: VarkModality;
}

export type VarkSessionStatus = "in_progress" | "complete";
export interface VarkSession {
  sessionId: string;
  studentId: string;
  gradeBand?: GradeBand;
  status: VarkSessionStatus;
  step: number;
  scores: VarkScores;
  askedCounts: VarkScores;
  questionHistory: { id: string; target: VarkModality; answeredAt?: string }[];
  currentQuestion: VarkQuestion | null;
  createdAt: string;
  updatedAt: string;
}

interface QuestionTemplate {
  target: VarkModality;
  text: string;
  options: VarkOption[];
}

const QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    target: "V",
    text: "When learning about a new topic, I prefer to start with:",
    options: [
      { key: "A", text: "A diagram, chart, or picture", mapsTo: "V" },
      { key: "B", text: "Someone explaining it aloud", mapsTo: "A" },
      { key: "C", text: "A short reading or handout", mapsTo: "R" },
      { key: "D", text: "Trying it hands-on", mapsTo: "K" },
    ],
  },
  {
    target: "A",
    text: "If I need to remember instructions, I do best when I:",
    options: [
      { key: "A", text: "See steps listed or shown", mapsTo: "V" },
      { key: "B", text: "Hear someone say the steps", mapsTo: "A" },
      { key: "C", text: "Read the steps myself", mapsTo: "R" },
      { key: "D", text: "Practice the steps", mapsTo: "K" },
    ],
  },
  {
    target: "R",
    text: "When learning vocabulary, I prefer to:",
    options: [
      { key: "A", text: "Match words to pictures", mapsTo: "V" },
      { key: "B", text: "Say the words out loud", mapsTo: "A" },
      { key: "C", text: "Read and write the words", mapsTo: "R" },
      { key: "D", text: "Act out the words", mapsTo: "K" },
    ],
  },
  {
    target: "K",
    text: "In class, I learn best when I can:",
    options: [
      { key: "A", text: "Watch a demonstration", mapsTo: "V" },
      { key: "B", text: "Join a discussion", mapsTo: "A" },
      { key: "C", text: "Use notes or a worksheet", mapsTo: "R" },
      { key: "D", text: "Build or move something", mapsTo: "K" },
    ],
  },
  {
    target: "V",
    text: "To understand how something works, I like to:",
    options: [
      { key: "A", text: "See a diagram or model", mapsTo: "V" },
      { key: "B", text: "Listen to a clear explanation", mapsTo: "A" },
      { key: "C", text: "Read a short description", mapsTo: "R" },
      { key: "D", text: "Try it out myself", mapsTo: "K" },
    ],
  },
  {
    target: "A",
    text: "When I'm learning something new, I most enjoy:",
    options: [
      { key: "A", text: "Looking at examples or pictures", mapsTo: "V" },
      { key: "B", text: "Talking about it", mapsTo: "A" },
      { key: "C", text: "Reading about it", mapsTo: "R" },
      { key: "D", text: "Doing an activity", mapsTo: "K" },
    ],
  },
  {
    target: "R",
    text: "If I need to review, I usually:",
    options: [
      { key: "A", text: "Review diagrams or slides", mapsTo: "V" },
      { key: "B", text: "Replay or recall the lecture", mapsTo: "A" },
      { key: "C", text: "Read notes or a summary", mapsTo: "R" },
      { key: "D", text: "Practice with exercises", mapsTo: "K" },
    ],
  },
  {
    target: "K",
    text: "When solving a problem, I prefer to:",
    options: [
      { key: "A", text: "Sketch it out", mapsTo: "V" },
      { key: "B", text: "Explain it out loud", mapsTo: "A" },
      { key: "C", text: "Write steps on paper", mapsTo: "R" },
      { key: "D", text: "Try different solutions", mapsTo: "K" },
    ],
  },
];

const CLARIFYING_TEMPLATE: QuestionTemplate = {
  target: "V",
  text: "If you could choose one way to learn today, which sounds best?",
  options: [
    { key: "A", text: "See it in a picture or video", mapsTo: "V" },
    { key: "B", text: "Hear someone explain it", mapsTo: "A" },
    { key: "C", text: "Read about it", mapsTo: "R" },
    { key: "D", text: "Try it with my hands", mapsTo: "K" },
  ],
};

export const MAX_QUESTIONS = 6;

export function createEmptyScores(): VarkScores {
  return { v: 0, a: 0, r: 0, k: 0 };
}

export function pickWeakestModality(askedCounts: VarkScores, scores: VarkScores): VarkModality {
  const modalities: { key: VarkModality; asked: number; score: number }[] = [
    { key: "V", asked: askedCounts.v, score: scores.v },
    { key: "A", asked: askedCounts.a, score: scores.a },
    { key: "R", asked: askedCounts.r, score: scores.r },
    { key: "K", asked: askedCounts.k, score: scores.k },
  ];

  modalities.sort((a, b) => {
    if (a.asked !== b.asked) {
      return a.asked - b.asked;
    }
    return a.score - b.score;
  });

  return modalities[0]?.key ?? "V";
}

export function buildQuestion(step: number, target?: VarkModality): VarkQuestion {
  const templates = target
    ? QUESTION_TEMPLATES.filter((q) => q.target === target)
    : QUESTION_TEMPLATES;
  const index = Math.max(0, step - 1) % templates.length;
  const template = templates[index] ?? QUESTION_TEMPLATES[0];
  return {
    id: `Q${step}`,
    text: template.text,
    options: template.options,
    target: template.target,
  };
}

export function buildClarifyingQuestion(step: number): VarkQuestion {
  return {
    id: `Q${step}`,
    text: CLARIFYING_TEMPLATE.text,
    options: CLARIFYING_TEMPLATE.options,
    target: CLARIFYING_TEMPLATE.target,
  };
}

export function mapOptionToScore(option: VarkModality): VarkScores {
  return {
    v: option === "V" ? 1 : 0,
    a: option === "A" ? 1 : 0,
    r: option === "R" ? 1 : 0,
    k: option === "K" ? 1 : 0,
  };
}

export function addScores(base: VarkScores, delta: VarkScores): VarkScores {
  return {
    v: base.v + delta.v,
    a: base.a + delta.a,
    r: base.r + delta.r,
    k: base.k + delta.k,
  };
}

export function clampScores(scores: VarkScores): VarkScores {
  return {
    v: Number.isFinite(scores.v) ? Math.max(0, scores.v) : 0,
    a: Number.isFinite(scores.a) ? Math.max(0, scores.a) : 0,
    r: Number.isFinite(scores.r) ? Math.max(0, scores.r) : 0,
    k: Number.isFinite(scores.k) ? Math.max(0, scores.k) : 0,
  };
}

export function summarizeProfile(scores: VarkScores): {
  primary: "V" | "A" | "R" | "K" | "Multi";
  summary: string;
  recommendations: string[];
} {
  const entries: { key: VarkModality; score: number }[] = MODALITIES.map((key) => {
    switch (key) {
      case "V":
        return { key, score: scores.v };
      case "A":
        return { key, score: scores.a };
      case "R":
        return { key, score: scores.r };
      case "K":
        return { key, score: scores.k };
      default:
        return { key, score: 0 };
    }
  }).sort((a, b) => b.score - a.score);

  const top = entries[0];
  const second = entries[1];
  const primary =
    !top || !second || top.score === second.score || top.score - second.score < 1
      ? "Multi"
      : top.key;

  const summaryByPrimary: Record<string, string> = {
    V: "You seem to like learning with pictures, videos, and seeing how things look.",
    A: "You seem to like learning by listening and talking things through.",
    R: "You seem to like learning by reading and writing about ideas.",
    K: "You seem to like learning by doing and trying things out.",
    Multi: "You like learning in more than one way, which is a great strength and not a label.",
  };

  const recommendationsByPrimary: Record<string, string[]> = {
    V: [
      "Use diagrams, charts, or labeled pictures to study.",
      "Highlight key ideas with color or visuals.",
      "Watch a short video before practicing.",
    ],
    A: [
      "Explain ideas out loud or teach them to someone else.",
      "Listen to short summaries or recordings.",
      "Join a small group discussion.",
    ],
    R: [
      "Read short summaries and underline key words.",
      "Write a few sentences explaining what you learned.",
      "Make a simple list of steps or notes.",
    ],
    K: [
      "Use hands-on activities or practice problems.",
      "Build a model or act out the concept.",
      "Take short movement breaks while studying.",
    ],
    Multi: [
      "Mix visuals, talking, and short readings when you study.",
      "Try a quick hands-on activity after learning.",
      "Switch methods if you get stuck.",
    ],
  };

  return {
    primary,
    summary: summaryByPrimary[primary],
    recommendations: recommendationsByPrimary[primary],
  };
}
