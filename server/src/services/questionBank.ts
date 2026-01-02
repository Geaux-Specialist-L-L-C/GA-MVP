export type Modality = 'Visual' | 'Auditory' | 'Read/Write' | 'Kinesthetic';

export interface QuestionOption {
  modality: Modality;
  text: string;
}

export interface QuestionItem {
  id: string;
  gradeBand: 'K-2' | '3-5' | '6-8' | '9-12';
  prompt: string;
  options: QuestionOption[];
}

export const questionBank: QuestionItem[] = [
  {
    id: 'k2-1',
    gradeBand: 'K-2',
    prompt: "You're learning a new game. What helps most?",
    options: [
      { modality: 'Visual', text: 'See pictures that show the steps.' },
      { modality: 'Auditory', text: 'Hear someone tell me the steps.' },
      { modality: 'Read/Write', text: 'Look at simple words with a grown-up.' },
      { modality: 'Kinesthetic', text: 'Try it out while someone helps me.' }
    ]
  },
  {
    id: 'k2-2',
    gradeBand: 'K-2',
    prompt: 'You want to remember a short story.',
    options: [
      { modality: 'Visual', text: 'Look at pictures from the story.' },
      { modality: 'Auditory', text: 'Hear it read out loud again.' },
      { modality: 'Read/Write', text: 'Point to the words with a grown-up.' },
      { modality: 'Kinesthetic', text: 'Act it out with movement.' }
    ]
  },
  {
    id: 'k2-3',
    gradeBand: 'K-2',
    prompt: "You're learning about animals.",
    options: [
      { modality: 'Visual', text: 'Look at animal pictures.' },
      { modality: 'Auditory', text: 'Listen to someone talk about animals.' },
      { modality: 'Read/Write', text: 'Look at animal words with help.' },
      { modality: 'Kinesthetic', text: 'Pretend to be the animal.' }
    ]
  },
  {
    id: 'k2-4',
    gradeBand: 'K-2',
    prompt: 'You need to find your way to a room.',
    options: [
      { modality: 'Visual', text: 'See a picture map.' },
      { modality: 'Auditory', text: 'Listen to directions.' },
      { modality: 'Read/Write', text: 'Follow simple words with a grown-up.' },
      { modality: 'Kinesthetic', text: 'Walk the path once with someone.' }
    ]
  },
  {
    id: 'k2-5',
    gradeBand: 'K-2',
    prompt: "You're learning a new song.",
    options: [
      { modality: 'Visual', text: 'Watch someone show the hand motions.' },
      { modality: 'Auditory', text: 'Listen and sing it back.' },
      { modality: 'Read/Write', text: 'Look at the words with a grown-up.' },
      { modality: 'Kinesthetic', text: 'Do the motions while you sing.' }
    ]
  },
  {
    id: '35-1',
    gradeBand: '3-5',
    prompt: "You're learning about the solar system.",
    options: [
      { modality: 'Visual', text: 'Look at a poster with planets.' },
      { modality: 'Auditory', text: 'Listen to someone explain planets.' },
      { modality: 'Read/Write', text: 'Read a book about planets.' },
      { modality: 'Kinesthetic', text: 'Build a model of the planets.' }
    ]
  },
  {
    id: '35-2',
    gradeBand: '3-5',
    prompt: 'You need to remember a poem.',
    options: [
      { modality: 'Visual', text: 'Picture the poem in your head.' },
      { modality: 'Auditory', text: 'Hear it read out loud again.' },
      { modality: 'Read/Write', text: 'Read or write it a few times.' },
      { modality: 'Kinesthetic', text: 'Act it out with gestures.' }
    ]
  },
  {
    id: '35-3',
    gradeBand: '3-5',
    prompt: "You're learning a new sport skill.",
    options: [
      { modality: 'Visual', text: 'Watch a demo or video.' },
      { modality: 'Auditory', text: 'Listen to tips and coaching.' },
      { modality: 'Read/Write', text: 'Read the steps or rules.' },
      { modality: 'Kinesthetic', text: 'Try it yourself right away.' }
    ]
  },
  {
    id: '35-4',
    gradeBand: '3-5',
    prompt: "You're learning how to solve a puzzle.",
    options: [
      { modality: 'Visual', text: "Watch how it's solved." },
      { modality: 'Auditory', text: 'Talk through it with someone.' },
      { modality: 'Read/Write', text: 'Read a guide with steps.' },
      { modality: 'Kinesthetic', text: 'Keep trying until it works.' }
    ]
  },
  {
    id: '35-5',
    gradeBand: '3-5',
    prompt: "You're studying for a quiz.",
    options: [
      { modality: 'Visual', text: 'Use diagrams or charts.' },
      { modality: 'Auditory', text: 'Explain it out loud.' },
      { modality: 'Read/Write', text: 'Read notes or rewrite them.' },
      { modality: 'Kinesthetic', text: 'Do practice activities or problems.' }
    ]
  },
  {
    id: '68-1',
    gradeBand: '6-8',
    prompt: "You're preparing for a test.",
    options: [
      { modality: 'Visual', text: 'Make diagrams or mind maps.' },
      { modality: 'Auditory', text: 'Discuss the material out loud.' },
      { modality: 'Read/Write', text: 'Read and rewrite notes.' },
      { modality: 'Kinesthetic', text: 'Do practice activities or problems.' }
    ]
  },
  {
    id: '68-2',
    gradeBand: '6-8',
    prompt: "You're learning a science concept.",
    options: [
      { modality: 'Visual', text: 'Study a diagram or video.' },
      { modality: 'Auditory', text: 'Listen to an explanation.' },
      { modality: 'Read/Write', text: 'Read the textbook section.' },
      { modality: 'Kinesthetic', text: 'Try a hands-on experiment.' }
    ]
  },
  {
    id: '68-3',
    gradeBand: '6-8',
    prompt: "You're learning how something works.",
    options: [
      { modality: 'Visual', text: 'Watch a visual demo.' },
      { modality: 'Auditory', text: 'Talk it through with someone.' },
      { modality: 'Read/Write', text: 'Read a step-by-step guide.' },
      { modality: 'Kinesthetic', text: 'Take it apart or build it.' }
    ]
  },
  {
    id: '68-4',
    gradeBand: '6-8',
    prompt: "You're memorizing key facts.",
    options: [
      { modality: 'Visual', text: 'Use color-coded flashcards.' },
      { modality: 'Auditory', text: 'Say the facts out loud.' },
      { modality: 'Read/Write', text: 'Write the facts in your own words.' },
      { modality: 'Kinesthetic', text: 'Use movement or hands-on practice.' }
    ]
  },
  {
    id: '68-5',
    gradeBand: '6-8',
    prompt: "You want to learn a new skill (coding, art, music).",
    options: [
      { modality: 'Visual', text: 'Watch a tutorial or diagram.' },
      { modality: 'Auditory', text: 'Listen to a teacher explain.' },
      { modality: 'Read/Write', text: 'Read instructions or notes.' },
      { modality: 'Kinesthetic', text: 'Practice by doing the skill.' }
    ]
  },
  {
    id: '912-1',
    gradeBand: '9-12',
    prompt: 'You need to learn a new math concept.',
    options: [
      { modality: 'Visual', text: 'Study a diagram or worked example.' },
      { modality: 'Auditory', text: 'Listen to a teacher or tutor explain.' },
      { modality: 'Read/Write', text: 'Read the textbook and take notes.' },
      { modality: 'Kinesthetic', text: 'Work through problems yourself.' }
    ]
  },
  {
    id: '912-2',
    gradeBand: '9-12',
    prompt: "You're learning a historical event.",
    options: [
      { modality: 'Visual', text: 'Look at timelines or maps.' },
      { modality: 'Auditory', text: 'Listen to a lecture or podcast.' },
      { modality: 'Read/Write', text: 'Read and annotate a text.' },
      { modality: 'Kinesthetic', text: 'Do a simulation or project.' }
    ]
  },
  {
    id: '912-3',
    gradeBand: '9-12',
    prompt: "You're preparing for a presentation.",
    options: [
      { modality: 'Visual', text: 'Design slides or visuals first.' },
      { modality: 'Auditory', text: 'Practice speaking it out loud.' },
      { modality: 'Read/Write', text: 'Write a detailed outline.' },
      { modality: 'Kinesthetic', text: 'Rehearse while moving or using props.' }
    ]
  },
  {
    id: '912-4',
    gradeBand: '9-12',
    prompt: "You're learning a complex process in science.",
    options: [
      { modality: 'Visual', text: 'Watch a diagram or animation.' },
      { modality: 'Auditory', text: 'Listen to an explanation.' },
      { modality: 'Read/Write', text: 'Read a detailed guide and take notes.' },
      { modality: 'Kinesthetic', text: 'Use a model or lab activity.' }
    ]
  },
  {
    id: '912-5',
    gradeBand: '9-12',
    prompt: "You're studying for finals.",
    options: [
      { modality: 'Visual', text: 'Use charts, diagrams, or mind maps.' },
      { modality: 'Auditory', text: 'Teach it out loud or discuss.' },
      { modality: 'Read/Write', text: 'Read and rewrite notes.' },
      { modality: 'Kinesthetic', text: 'Practice with problems or labs.' }
    ]
  }
];
