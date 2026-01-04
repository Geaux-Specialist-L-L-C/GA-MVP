import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Message from '../Message';
import { assessLearningStyle, checkAssessmentHealth } from '../../services/assessmentService';
import Button from '../common/Button';
import { questionBank, type QuestionItem, type QuestionOption } from '../../services/assessmentQuestionBank';
import { getStudentProfile, updateStudentAssessmentTone } from '../../services/profileService';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

type Tone = 'playful' | 'calm' | 'funny';

const TONE_LABELS: Record<Tone, string> = {
  playful: 'Playful',
  calm: 'Calm',
  funny: 'Funny'
};

const ACKS_BY_TONE: Record<Tone, string[]> = {
  playful: [
    'Nice pick! ✅',
    'Got it! You’re doing awesome.',
    'Sweet! That helps a lot.',
    'Great choice — you’re crushing this.',
    'Boom. Next question coming up!'
  ],
  calm: [
    'Thanks for sharing.',
    'Got it. You are doing great.',
    'Thanks. That helps a lot.',
    'Good choice. Let us keep going.',
    'Thanks. Ready for the next one.'
  ],
  funny: [
    'Nice pick. Brain high five.',
    'Got it. Your brain is cooking.',
    'Sweet. That helps a bunch.',
    'Great choice. Nailed it.',
    'Boom. Next question inbound.'
  ]
};

const MODALITY_ACKS_BY_TONE: Record<Tone, Record<QuestionOption['modality'], string[]>> = {
  playful: {
    Visual: [
      'Nice choice — your eyes are doing the work!',
      'Great pick! Visuals can be super helpful.',
      'Love it. Pictures and charts can be magic.'
    ],
    Auditory: [
      'Awesome — your ears are on point!',
      'Great pick! Listening can really stick.',
      'Nice! Talking it out helps a lot.'
    ],
    'Read/Write': [
      'Nice! Your notes-brain is strong.',
      'Great pick — reading and writing can lock it in.',
      'Love it. Words for the win!'
    ],
    Kinesthetic: [
      'Love it — hands-on power!',
      'Great pick! Doing it helps it stick.',
      'Nice! Learning by doing is a superpower.'
    ],
    NotSure: [
      'Totally okay — thanks for being honest.',
      'No worries at all. We’ll figure it out together.',
      'That’s okay! We can try another question.'
    ]
  },
  calm: {
    Visual: [
      'Thanks. Visuals can be helpful.',
      'Got it. Seeing it makes sense.',
      'Nice. Pictures can make it clear.'
    ],
    Auditory: [
      'Thanks. Listening can really help.',
      'Got it. Talking it out can stick.',
      'Nice. Hearing it can make it clear.'
    ],
    'Read/Write': [
      'Thanks. Reading and writing can help.',
      'Got it. Notes can lock it in.',
      'Nice. Words can make it clear.'
    ],
    Kinesthetic: [
      'Thanks. Hands-on practice can help.',
      'Got it. Doing it can make it stick.',
      'Nice. Learning by doing can work well.'
    ],
    NotSure: [
      'Thanks for sharing. We can try another question.',
      'No worries. We will figure it out together.',
      'That is okay. Let us keep going.'
    ]
  },
  funny: {
    Visual: [
      'Nice. Your eyes are on the case.',
      'Great pick. Visuals for the win.',
      'Love it. Pictures doing the heavy lifting.'
    ],
    Auditory: [
      'Nice. Your ears are on the job.',
      'Great pick. Listening power activated.',
      'Love it. Talk it out, brain it out.'
    ],
    'Read/Write': [
      'Nice. Notes for the win.',
      'Great pick. Words are your sidekick.',
      'Love it. Pens and pages, yes please.'
    ],
    Kinesthetic: [
      'Nice. Hands-on hero mode.',
      'Great pick. Do it to learn it.',
      'Love it. Movement makes it stick.'
    ],
    NotSure: [
      'All good. Even superheroes pause.',
      'No worries. We can try another one.',
      'Totally fine. We will figure it out.'
    ]
  }
};

const MORE_DATA_BY_TONE: Record<Tone, string> = {
  playful: "You're doing great — let's do one more question!",
  calm: 'Thanks. Let us try one more question.',
  funny: 'Nice. One more and we are in business.'
};

const FINAL_PREFIX_BY_TONE: Record<Tone, string> = {
  playful: 'All done',
  calm: 'Finished',
  funny: 'We did it'
};

const LearningStyleChat: React.FC<{ studentId?: string }> = ({ studentId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [questionQueue, setQuestionQueue] = useState<QuestionItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<QuestionOption[]>([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [gradeBand, setGradeBand] = useState<QuestionItem['gradeBand']>('3-5');
  const [totalQuestions, setTotalQuestions] = useState(30);
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [tone, setTone] = useState<Tone>('playful');
  const [celebrationEnabled, setCelebrationEnabled] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [rephraseCount, setRephraseCount] = useState(0);
  const [autoSimplify, setAutoSimplify] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const manualGradeBandRef = useRef(false);
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const { currentUser } = useAuth();

  const notSureOption: QuestionOption = { modality: 'NotSure', text: 'Not sure yet.' };

  const initializeAssessment = () => {
    const storedAutoSimplify = getStoredAutoSimplify(studentId);
    setAutoSimplify(storedAutoSimplify);
    const questionSet = buildQuestionSet(gradeBand);
    const orderedQuestions = getQuestionOrder(questionSet, studentId);
    const [firstQuestion, ...rest] = orderedQuestions;
    const nameLabel = studentName.trim();
    const firstPrompt = firstQuestion ? getDisplayPrompt(firstQuestion.prompt, storedAutoSimplify) : '';
    setTotalQuestions(questionSet.length);
    setQuestionQueue(rest);
    setCurrentQuestion(firstQuestion ?? null);
    setSelectedOptions([]);
    setAnsweredCount(0);
    setMessages([
      {
        text:
          'Parent note: Please let your child answer on their own. There are no right or wrong answers.',
        sender: 'bot'
      },
      {
        text: `Hi${nameLabel ? ` ${nameLabel}` : ''}! I'm here to help assess your learning style. Let's start with one question.`,
        sender: 'bot'
      },
      ...(firstQuestion ? [{ text: firstPrompt, sender: 'bot' as const }] : [])
    ]);
  };

  // Initialize chat with assessment start message
  useEffect(() => {
    initializeAssessment();
  }, [studentId, gradeBand]);

  useEffect(() => {
    let isActive = true;
    if (!studentId) return;

    getStudentProfile(studentId)
      .then((profile) => {
        if (!profile || !isActive) return;
        const name = profile.name ?? '';
        const grade = profile.grade ?? '';
        const storedTone = (profile as { assessmentTone?: Tone }).assessmentTone;
        setStudentName(name);
        setStudentGrade(grade);
        if (storedTone && storedTone in TONE_LABELS) {
          setTone(storedTone);
          localStorage.setItem(getToneStorageKey(studentId), storedTone);
        }
        if (!manualGradeBandRef.current) {
          const inferredBand = inferGradeBand(grade);
          if (inferredBand && inferredBand !== gradeBand) {
            setGradeBand(inferredBand);
          }
        }
      })
      .catch(() => {
        // Ignore missing profile to keep chat usable.
      });

    return () => {
      isActive = false;
    };
  }, [studentId, gradeBand]);

  useEffect(() => {
    const toneKey = getToneStorageKey(studentId);
    const storedTone = localStorage.getItem(toneKey) as Tone | null;
    if (storedTone && storedTone in TONE_LABELS) {
      setTone(storedTone);
    }
  }, [studentId]);

  useEffect(() => {
    const celebrationKey = getCelebrationStorageKey(studentId);
    const storedCelebration = localStorage.getItem(celebrationKey);
    if (storedCelebration !== null) {
      setCelebrationEnabled(storedCelebration === 'true');
    }
    const rephraseKey = getRephraseStorageKey(studentId);
    const storedRephrase = localStorage.getItem(rephraseKey);
    if (storedRephrase) {
      const count = Number(storedRephrase);
      if (!Number.isNaN(count)) {
        setRephraseCount(count);
        setAutoSimplify(count >= REPHRASE_THRESHOLD);
      }
    }
  }, [studentId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check API connection on mount and set up periodic checks
  useEffect(() => {
    checkApiConnection();
    const intervalId = setInterval(checkApiConnection, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const checkApiConnection = async (): Promise<void> => {
    const isConnected = await checkAssessmentHealth();
    setConnectionError(!isConnected);
  };

  const formatAssessmentResponse = (result: {
    learningStyle: string;
    explanation: string;
    nextSteps: string[];
    decision?: 'final' | 'needs_more_data';
    questions?: string[];
    missingEvidence?: string[];
  }) => {
    if (result.decision === 'needs_more_data') {
      return [
        `${studentName.trim() ? `${studentName}, ` : ''}I need just a little more detail before I can lock in your learning style.`,
        MORE_DATA_BY_TONE[tone] ?? MORE_DATA_BY_TONE.playful
      ].join('\n');
    }

    const steps = result.nextSteps.map((step) => `- ${step}`).join('\n');
    return [
      `${FINAL_PREFIX_BY_TONE[tone] ?? FINAL_PREFIX_BY_TONE.playful}${studentName.trim() ? `, ${studentName}` : ''}! Your learning style is ${result.learningStyle}.`,
      result.explanation,
      'Here’s how to use this superpower:',
      steps
    ].join('\n');
  };

  const formatSelectionMessage = (options: QuestionOption[]) => {
    const list = options.map((option) => option.text).join('; ');
    return `I would choose: ${list}.`;
  };

  const advanceQuestion = (followUps?: string[]) => {
    let nextQuestion: QuestionItem | null = null;
    setQuestionQueue((prev) => {
      if (prev.length > 0) {
        const [next, ...rest] = prev;
        nextQuestion = next ?? null;
        return rest;
      }

      if (followUps?.length) {
        const followUpItems = followUps.map((prompt) => getQuestionItem(prompt));
        const [next, ...rest] = followUpItems;
        nextQuestion = next ?? null;
        return rest;
      }

      return prev;
    });
    setCurrentQuestion(nextQuestion);
    return nextQuestion;
  };

  const handleOptionSelect = (option: QuestionOption) => {
    if (loading) return;
    setSelectedOptions([option]);
    void sendMessage([option]);
  };

  const getFunAck = () => {
    const list = ACKS_BY_TONE[tone] ?? ACKS_BY_TONE.playful;
    return list[Math.floor(Math.random() * list.length)];
  };
  const getAckForOptions = (options: QuestionOption[]) => {
    const firstOption = options[0];
    if (!firstOption) return getFunAck();
    const ackList =
      MODALITY_ACKS_BY_TONE[tone]?.[firstOption.modality] ??
      MODALITY_ACKS_BY_TONE.playful[firstOption.modality] ??
      ACKS_BY_TONE.playful;
    return attachName(ackList[Math.floor(Math.random() * ackList.length)], studentName);
  };

  const sendMessage = async (optionsOverride?: QuestionOption[]): Promise<void> => {
    const activeOptions = optionsOverride ?? selectedOptions;
    if (!input.trim() && activeOptions.length === 0) return;
    if (loading) return;

    const userMessage =
      activeOptions.length > 0 ? formatSelectionMessage(activeOptions) : input.trim();
    setInput('');
    setSelectedOptions([]);
    const ackMessage =
      activeOptions.length > 0 ? getAckForOptions(activeOptions) : attachName(getFunAck(), studentName);
    setMessages(prev => [
      ...prev,
      { text: userMessage, sender: 'user' },
      { text: ackMessage, sender: 'bot' }
    ]);

    try {
      if (!currentUser) {
        setMessages((prev) => [
          ...prev,
          { text: 'Please sign in to continue the assessment.', sender: 'bot' }
        ]);
        return;
      }
      if (!studentId) {
        setMessages((prev) => [
          ...prev,
          { text: 'Missing student information. Please try again.', sender: 'bot' }
        ]);
        return;
      }

      setLoading(true);
      const token = await currentUser.getIdToken(true);
      const apiMessages = [...messages, { text: userMessage, sender: 'user' }].map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const result = await assessLearningStyle({
        parentId: currentUser.uid,
        studentId,
        messages: apiMessages,
        token
      });

      if (result.decision === 'needs_more_data') {
        const nextQuestion = advanceQuestion(result.questions);
        const nextPrompt = nextQuestion ? getDisplayPrompt(nextQuestion.prompt, autoSimplify) : '';
        setMessages((prev) => [
          ...prev,
          { text: formatAssessmentResponse(result), sender: 'bot' },
          ...(nextQuestion ? [{ text: nextPrompt, sender: 'bot' }] : [])
        ]);
        setAnsweredCount((count) => count + 1);
      } else {
        const willContinue = answeredCount + 1 < totalQuestions;
        const nextQuestion = willContinue ? advanceQuestion() : null;
        const nextPrompt = nextQuestion ? getDisplayPrompt(nextQuestion.prompt, autoSimplify) : '';
        setMessages((prev) => [
          ...prev,
          { text: formatAssessmentResponse(result), sender: 'bot' },
          ...(nextQuestion ? [{ text: nextPrompt, sender: 'bot' }] : [])
        ]);
        setAnsweredCount((count) => count + 1);
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
        } else {
          setCurrentQuestion(null);
          triggerCelebration();
        }
      }
      setConnectionError(false);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      const message = getFriendlyErrorMessage(error);
      setMessages((prev) => [...prev, { text: message, sender: 'bot' }]);
      setConnectionError(true);
      await checkApiConnection();
    } finally {
      setLoading(false);
    }
  };

  const handleGradeBandChange = (nextBand: QuestionItem['gradeBand']) => {
    if (nextBand === gradeBand) return;
    if (answeredCount > 0 || messages.length > 0) {
      const confirmReset = window.confirm(
        'Changing the grade band will restart this assessment. Continue?'
      );
      if (!confirmReset) return;
    }
    manualGradeBandRef.current = true;
    setGradeBand(nextBand);
  };

  const handleToneChange = (nextTone: Tone) => {
    setTone(nextTone);
    localStorage.setItem(getToneStorageKey(studentId), nextTone);
    if (studentId) {
      updateStudentAssessmentTone(studentId, nextTone).catch(() => {
        // Ignore failures to keep chat usable.
      });
    }
  };

  const handleRephrase = () => {
    if (!currentQuestion) return;
    const rephrased = rephrasePrompt(currentQuestion.prompt);
    const nextCount = rephraseCount + 1;
    setRephraseCount(nextCount);
    localStorage.setItem(getRephraseStorageKey(studentId), String(nextCount));
    if (nextCount >= REPHRASE_THRESHOLD) {
      setAutoSimplify(true);
    }
    setMessages((prev) => [
      ...prev,
      { text: `Another way to ask: ${rephrased}`, sender: 'bot' }
    ]);
  };

  const triggerCelebration = () => {
    if (!celebrationEnabled) return;
    setShowCelebration(true);
    playCelebrationSound();
    window.setTimeout(() => setShowCelebration(false), 2200);
  };

  const progressValue = totalQuestions > 0
    ? Math.min(Math.round((answeredCount / totalQuestions) * 100), 100)
    : 0;
  const progressLabel = getProgressLabel(answeredCount, totalQuestions);

  return (
    <ChatContainer className="card">
      {showCelebration ? (
        <ConfettiOverlay aria-hidden="true">
          {getConfettiPieces(confettiRef).map((piece, index) => (
            <ConfettiPiece
              key={`${piece.left}-${index}`}
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}ms`,
                animationDuration: `${piece.duration}ms`,
                width: `${piece.size}px`,
                height: `${piece.size * 1.4}px`
              }}
            />
          ))}
        </ConfettiOverlay>
      ) : null}
      <ChatHeader>
        🎓 Learning Style Assessment
        <GradeRow>
          <label htmlFor="grade-band-select">Grade band:</label>
          <GradeSelect
            id="grade-band-select"
            value={gradeBand}
            onChange={(event) => handleGradeBandChange(event.target.value as QuestionItem['gradeBand'])}
          >
            <option value="K-2">K–2</option>
            <option value="3-5">3–5</option>
            <option value="6-8">6–8</option>
            <option value="9-12">9–12</option>
          </GradeSelect>
          {studentGrade.trim() ? (
            <GradeHint>Detected: {studentGrade}</GradeHint>
          ) : null}
          <ToneSelect
            aria-label="Tone"
            value={tone}
            onChange={(event) => handleToneChange(event.target.value as Tone)}
          >
            {Object.entries(TONE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label} tone
              </option>
            ))}
          </ToneSelect>
          <CelebrateToggle>
            <input
              type="checkbox"
              checked={celebrationEnabled}
              onChange={(event) => {
                const enabled = event.target.checked;
                setCelebrationEnabled(enabled);
                localStorage.setItem(
                  getCelebrationStorageKey(studentId),
                  String(enabled)
                );
              }}
            />
            Celebrate
          </CelebrateToggle>
        </GradeRow>
        <ProgressBar>
          <ProgressFill style={{ width: `${progressValue}%` }} />
        </ProgressBar>
        <ProgressText>
          Question {Math.min(answeredCount + 1, totalQuestions)} of {totalQuestions}
        </ProgressText>
        {progressLabel ? <ProgressMilestone>{progressLabel}</ProgressMilestone> : null}
        {connectionError && (
          <ConnectionError>⚠️ Connection Error - Check if the assessment service is running</ConnectionError>
        )}
      </ChatHeader>
      <ChatBody>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender}>{msg.text}</Message>
        ))}
        {loading && <Message sender="bot">Typing...</Message>}
        <div ref={chatEndRef} />
      </ChatBody>
      <ChatFooter>
        {currentQuestion?.options?.length ? (
          <OptionList>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptions.some(
                (selected) => selected.text === option.text
              );
              return (
                  <OptionButton
                    key={option.text}
                    type="button"
                    $selected={isSelected}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.text}
                  </OptionButton>
                );
              })}
            <OptionButton
              type="button"
              $selected={selectedOptions.some((option) => option.text === notSureOption.text)}
              onClick={() => handleOptionSelect(notSureOption)}
            >
              {notSureOption.text}
            </OptionButton>
          </OptionList>
        ) : null}
        {currentQuestion ? (
          <RephraseButton type="button" onClick={handleRephrase}>
            Rephrase this question
          </RephraseButton>
        ) : null}
        <InputRow>
          <ChatInput
            type="text"
            value={input}
            placeholder="Type your response or choose an option..."
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="form-input"
          />
          <Button onClick={sendMessage} $variant="primary">
            <FaPaperPlane />
          </Button>
        </InputRow>
      </ChatFooter>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  height: 500px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ChatHeader = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid #eee;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ConnectionError = styled.div`
  color: var(--color-error);
  font-size: 0.8em;
  margin-top: 4px;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
`;

const ChatFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid #eee;
`;

const ChatInput = styled.input`
  flex: 1;
`;

const ProgressText = styled.div`
  font-size: 0.85em;
  color: #666;
`;

const ProgressMilestone = styled.div`
  font-size: 0.8em;
  color: #4a4a4a;
`;

const GradeRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.85em;
  color: #444;
`;

const GradeSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

const GradeHint = styled.span`
  color: #666;
  font-size: 0.85em;
`;

const ToneSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

const CelebrateToggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85em;
  color: #555;
`;

const ConfettiOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 2;
`;

const ConfettiPiece = styled.span`
  position: absolute;
  top: -10px;
  border-radius: 2px;
  animation-name: confetti-fall;
  animation-timing-function: ease-in;
  animation-fill-mode: forwards;

  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(520px) rotate(260deg);
      opacity: 0;
    }
  }
`;

const ProgressBar = styled.div`
  position: relative;
  height: 8px;
  background: #eee;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg, #5aa6ff, #5ad4ff);
  transition: width 200ms ease;
`;

const OptionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const RephraseButton = styled.button`
  align-self: flex-start;
  border: none;
  background: none;
  color: var(--primary-color);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
`;

const InputRow = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const OptionButton = styled.button<{ $selected?: boolean }>`
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  border: 1px solid ${({ $selected }) => ($selected ? 'var(--primary-color)' : '#ddd')};
  background: ${({ $selected }) => ($selected ? 'rgba(0, 119, 255, 0.1)' : '#fff')};
  cursor: pointer;
  font-size: 0.9rem;
`;

export default LearningStyleChat;

const getFriendlyErrorMessage = (error: unknown) => {
  const status = (error as { status?: number }).status;
  if (status === 401) {
    return 'Please sign in again to continue your assessment.';
  }
  if (status === 403) {
    return 'You do not have access to this student.';
  }
  if (status === 404) {
    return 'We could not find that student record. Please try again.';
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
};

const getQuestionItem = (prompt: string): QuestionItem => {
  const matched = questionBank.find((question) => question.prompt === prompt);
  return (
    matched ?? {
      id: `followup-${prompt.slice(0, 20)}`,
      gradeBand: '6-8',
      prompt,
      options: []
    }
  );
};

const attachName = (message: string, name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return message;
  if (message.endsWith('!')) {
    return message.slice(0, -1) + `, ${trimmed}!`;
  }
  if (message.endsWith('.')) {
    return message.slice(0, -1) + `, ${trimmed}.`;
  }
  return `${message} ${trimmed}`;
};

const getToneStorageKey = (studentId?: string) =>
  `ga-assessment-tone:${studentId ?? 'guest'}`;

const getCelebrationStorageKey = (studentId?: string) =>
  `ga-assessment-celebrate:${studentId ?? 'guest'}`;

const getRephraseStorageKey = (studentId?: string) =>
  `ga-assessment-rephrase:${studentId ?? 'guest'}`;

const REPHRASE_THRESHOLD = 2;

const CONFETTI_COLORS = ['#5aa6ff', '#ffd166', '#ef476f', '#06d6a0', '#8338ec'];

type ConfettiPiece = {
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
};

const getConfettiPieces = (ref: React.MutableRefObject<ConfettiPiece[]>) => {
  if (ref.current.length) return ref.current;
  const pieces = Array.from({ length: 24 }).map(() => ({
    left: Math.random() * 100,
    delay: Math.random() * 400,
    duration: 1400 + Math.random() * 800,
    size: 6 + Math.random() * 6,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
  }));
  ref.current = pieces;
  return pieces;
};

const playCelebrationSound = () => {
  try {
    const AudioContext =
      window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.12, context.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + index * 0.08 + 0.2);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(context.currentTime + index * 0.08);
      oscillator.stop(context.currentTime + index * 0.08 + 0.22);
    });
  } catch {
    // Ignore audio errors to avoid blocking the UI.
  }
};

const getStoredAutoSimplify = (studentId?: string) => {
  const stored = localStorage.getItem(getRephraseStorageKey(studentId));
  if (!stored) return false;
  const count = Number(stored);
  if (Number.isNaN(count)) return false;
  return count >= REPHRASE_THRESHOLD;
};

const getProgressLabel = (answered: number, total: number) => {
  if (!total) return '';
  const ratio = answered / total;
  if (ratio >= 1) return 'All done!';
  if (ratio >= 0.9) return 'Almost there!';
  if (ratio >= 0.6) return 'You are past halfway!';
  if (ratio >= 0.3) return 'Nice start!';
  if (answered > 0) return 'Keep going!';
  return '';
};

const rephrasePrompt = (prompt: string) => {
  const trimmed = prompt.trim();
  if (!trimmed) return prompt;
  if (trimmed.startsWith("You're")) {
    return `Imagine you are${trimmed.slice(5)}`;
  }
  if (trimmed.startsWith('You are')) {
    return `Imagine you are${trimmed.slice(7)}`;
  }
  if (trimmed.startsWith('You need to')) {
    return `Suppose you need to${trimmed.slice(10)}`;
  }
  if (trimmed.startsWith('You want to')) {
    return `Suppose you want to${trimmed.slice(10)}`;
  }
  if (trimmed.startsWith('You')) {
    return `Imagine${trimmed.slice(3)}`;
  }
  return `Think about this: ${trimmed}`;
};

const getDisplayPrompt = (prompt: string, autoSimplify: boolean) =>
  autoSimplify ? rephrasePrompt(prompt) : prompt;

const inferGradeBand = (grade: string): QuestionItem['gradeBand'] | null => {
  if (!grade) return null;
  const normalized = grade.trim().toLowerCase();
  if (normalized.startsWith('k')) return 'K-2';
  const match = normalized.match(/\d+/);
  if (!match) return null;
  const value = Number(match[0]);
  if (Number.isNaN(value)) return null;
  if (value <= 2) return 'K-2';
  if (value <= 5) return '3-5';
  if (value <= 8) return '6-8';
  return '9-12';
};

const getOrderStorageKey = (gradeBand: QuestionItem['gradeBand'], studentId?: string) =>
  `ga-assessment-order:${studentId ?? 'guest'}:${gradeBand}`;

const getQuestionOrder = (questions: QuestionItem[], studentId?: string) => {
  const [sample] = questions;
  if (!sample) return [];
  const storageKey = getOrderStorageKey(sample.gradeBand, studentId);
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      const ids = JSON.parse(stored) as string[];
      const map = new Map(questions.map((question) => [question.id, question]));
      const ordered = ids.map((id) => map.get(id)).filter(Boolean) as QuestionItem[];
      if (ordered.length === questions.length) {
        return ordered;
      }
    } catch {
      // Ignore invalid stored data and reshuffle below.
    }
  }
  const shuffled = shuffleQuestions(questions);
  localStorage.setItem(
    storageKey,
    JSON.stringify(shuffled.map((question) => question.id))
  );
  return shuffled;
};

const shuffleQuestions = (questions: QuestionItem[]) => {
  const items = [...questions];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

const buildQuestionSet = (gradeBand: QuestionItem['gradeBand']): QuestionItem[] => {
  const primary = questionBank.filter((q) => q.gradeBand === gradeBand);
  const secondary = questionBank.filter((q) => q.gradeBand !== gradeBand);
  const result: QuestionItem[] = [];
  let idxPrimary = 0;
  let idxSecondary = 0;
  while (result.length < 30) {
    if (idxPrimary < primary.length) {
      result.push(primary[idxPrimary]);
      idxPrimary += 1;
    } else if (secondary.length) {
      result.push(secondary[idxSecondary % secondary.length]);
      idxSecondary += 1;
    } else {
      // In case the bank is tiny, repeat from start.
      result.push(primary[idxPrimary % primary.length]);
      idxPrimary += 1;
    }
  }
  return shuffleQuestions(result);
};
