export type Modality = 'Visual' | 'Auditory' | 'Read/Write' | 'Kinesthetic' | 'NotSure';

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
    prompt: "You're memorizing key facts.",
    options: [
      { modality: 'Visual', text: 'Use color-coded flashcards.' },
      { modality: 'Auditory', text: 'Say the facts out loud.' },
      { modality: 'Read/Write', text: 'Write the facts in your own words.' },
      { modality: 'Kinesthetic', text: 'Use movement or hands-on practice.' }
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
  }
];
