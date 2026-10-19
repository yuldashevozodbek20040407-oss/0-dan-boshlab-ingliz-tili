export type QuestionType = 'multiple-choice' | 'sentence-order' | 'fill-blank' | 'listening';

export interface Question {
  id: string;
  type: QuestionType;
  promptUz: string;
  promptEn?: string;
  options?: string[]; // For multiple-choice & fill-blank
  correctAnswer: string; // The correct text or combined words
  sentencePieces?: string[]; // For sentence-order
  explanationUz: string;
  audioPrompt?: string; // Audio text to speak for listening tests
}

export interface VocabularyItem {
  id: string;
  english: string;
  uzbek: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'phrase' | 'number';
  exampleEn: string;
  exampleUz: string;
  levelId: number;
}

export interface GrammarRuleBlock {
  title: string;
  content: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
  examples: {
    en: string;
    uz: string;
    note?: string;
  }[];
}

export interface GrammarSection {
  title: string;
  uzbekExplanation: string;
  ruleBlocks: GrammarRuleBlock[];
}

export interface Lesson {
  id: string;
  levelId: number;
  order: number;
  title: string;
  uzbekTitle: string;
  description: string;
  durationMinutes: number;
  xpReward: number;
  topics: string[];
  grammar: GrammarSection;
  vocabulary: VocabularyItem[];
  practiceQuestions: Question[];
}

export interface QuizTest {
  id: string;
  levelId: number;
  title: string;
  uzbekTitle: string;
  description: string;
  passingPercentage: number;
  xpReward: number;
  questions: Question[];
}

export interface Level {
  id: number;
  code: string;
  cefr: string;
  title: string;
  uzbekTitle: string;
  badgeTitle: string;
  description: string;
  targetAudience: string;
  lessons: Lesson[];
  finalTest: QuizTest;
}

export interface MistakeItem {
  id: string;
  questionId: string;
  levelId: number;
  lessonTitle: string;
  promptUz: string;
  promptEn?: string;
  userAnswer: string;
  correctAnswer: string;
  explanationUz: string;
  date: string;
}

export interface TestResultRecord {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  date: string;
}

export interface UserProgress {
  userName: string;
  avatarSeed: string;
  currentLevelId: number;
  completedLessonIds: string[];
  completedTestScores: Record<string, TestResultRecord>;
  totalXp: number;
  streakDays: number;
  lastActiveDate: string;
  mistakes: MistakeItem[];
  unlockedBadgeIds: string[];
  bookmarkedWordIds: string[];
}

export interface BadgeDefinition {
  id: string;
  title: string;
  uzbekTitle: string;
  description: string;
  icon: string;
}
