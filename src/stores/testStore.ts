import { create } from 'zustand';
import type { UserQuizAnswer, UserQuiz } from '@/types';

interface TestSessionStore {
  activeSession: UserQuiz | null;
  currentQuestionIndex: number;
  timeRemaining: number; // in seconds
  answers: Map<string, string>; // questionId -> optionId
  
  // Actions
  startSession: (session: UserQuiz) => void;
  endSession: () => void;
  setAnswer: (questionId: string, optionId: string) => void;
  setCurrentQuestion: (index: number) => void;
  setTimeRemaining: (time: number) => void;
  decrementTime: () => void;
  getAnswers: () => UserQuizAnswer[];
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
          ended_at: new Date().toISOString(),
          status: 'submitted',
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
    const result: UserQuizAnswer[] = [];
    answers.forEach((optionId, questionId) => {
      result.push({
        question_id: parseInt(questionId),
        selected_option_id: parseInt(optionId),
        answered_at: new Date().toISOString(),
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
