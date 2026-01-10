import { create } from 'zustand';
import type { StudentAnswer, TestSession } from '@/types';

interface TestSessionStore {
  activeSession: TestSession | null;
  currentQuestionIndex: number;
  timeRemaining: number; // in seconds
  answers: Map<string, string>; // questionId -> optionId
  
  // Actions
  startSession: (session: TestSession) => void;
  endSession: () => void;
  setAnswer: (questionId: string, optionId: string) => void;
  setCurrentQuestion: (index: number) => void;
  setTimeRemaining: (time: number) => void;
  decrementTime: () => void;
  getAnswers: () => StudentAnswer[];
  clearSession: () => void;
}

export const useTestStore = create<TestSessionStore>((set, get) => ({
  activeSession: null,
  currentQuestionIndex: 0,
  timeRemaining: 0,
  answers: new Map(),

  startSession: (session) =>
    set({
      activeSession: session,
      currentQuestionIndex: 0,
      answers: new Map(),
    }),

  endSession: () => {
    const state = get();
    if (state.activeSession) {
      set({
        activeSession: {
          ...state.activeSession,
          endedAt: new Date().toISOString(),
          isSubmitted: true,
        },
      });
    }
  },

  setAnswer: (questionId, optionId) =>
    set((state) => {
      const newAnswers = new Map(state.answers);
      newAnswers.set(questionId, optionId);
      return { answers: newAnswers };
    }),

  setCurrentQuestion: (index) =>
    set({ currentQuestionIndex: index }),

  setTimeRemaining: (time) =>
    set({ timeRemaining: time }),

  decrementTime: () =>
    set((state) => ({
      timeRemaining: Math.max(0, state.timeRemaining - 1),
    })),

  getAnswers: () => {
    const answers = get().answers;
    const result: StudentAnswer[] = [];
    answers.forEach((optionId, questionId) => {
      result.push({
        questionId,
        selectedOptionId: optionId,
        answeredAt: new Date().toISOString(),
      });
    });
    return result;
  },

  clearSession: () =>
    set({
      activeSession: null,
      currentQuestionIndex: 0,
      timeRemaining: 0,
      answers: new Map(),
    }),
}));
