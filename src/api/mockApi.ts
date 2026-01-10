import type { User, UserRole, Test, Question, TestResult, StudentAnswer, TestStatistics } from '@/types';
import { mockUsers, mockTests, mockQuestions, mockResults, mockStatistics, shuffleArray } from './mockData';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock token
const generateToken = () => `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// AUTH API
export const authApi = {
  login: async (email: string, password: string, role: UserRole): Promise<{ user: User; token: string }> => {
    await delay(800);
    
    // Find or create user based on role for demo
    let user = mockUsers.find(u => u.email === email && u.role === role);
    
    if (!user) {
      // For demo, accept any credentials and create a mock user
      user = {
        id: `user-${Date.now()}`,
        email,
        fullName: email.split('@')[0],
        role,
        school: role === 'student' ? "Demo maktab" : undefined,
        classCategory: role === 'student' ? '9-sinf' : undefined,
        createdAt: new Date().toISOString(),
      };
    }
    
    return { user, token: generateToken() };
  },

  register: async (data: {
    email: string;
    password: string;
    fullName: string;
    school: string;
    classCategory: string;
  }): Promise<{ user: User; token: string }> => {
    await delay(1000);
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: 'student',
      school: data.school,
      classCategory: data.classCategory,
      createdAt: new Date().toISOString(),
    };
    
    return { user: newUser, token: generateToken() };
  },

  logout: async (): Promise<void> => {
    await delay(300);
  },
};

// TESTS API
export const testsApi = {
  getTests: async (filter?: { classCategory?: string; status?: string }): Promise<Test[]> => {
    await delay(600);
    
    let tests = [...mockTests];
    
    if (filter?.classCategory) {
      tests = tests.filter(t => t.classCategory === filter.classCategory);
    }
    if (filter?.status) {
      tests = tests.filter(t => t.status === filter.status);
    }
    
    return tests;
  },

  getTestById: async (testId: string): Promise<Test | null> => {
    await delay(400);
    return mockTests.find(t => t.id === testId) || null;
  },

  getActiveTestForStudent: async (studentId: string, classCategory: string): Promise<Test | null> => {
    await delay(500);
    
    // Find tests that are either scheduled or active for the student's class
    const test = mockTests.find(t => 
      t.classCategory === classCategory && 
      (t.status === 'scheduled' || t.status === 'active') &&
      t.isActive
    );
    
    return test || null;
  },

  createTest: async (data: Omit<Test, 'id' | 'questionCount' | 'totalPoints'>): Promise<Test> => {
    await delay(800);
    
    const newTest: Test = {
      ...data,
      id: `test-${Date.now()}`,
      questionCount: 0,
      totalPoints: 0,
    };
    
    mockTests.push(newTest);
    return newTest;
  },

  updateTestStatus: async (testId: string, status: Test['status']): Promise<Test> => {
    await delay(500);
    
    const test = mockTests.find(t => t.id === testId);
    if (!test) throw new Error('Test topilmadi');
    
    test.status = status;
    test.isActive = status === 'active' || status === 'scheduled';
    
    return test;
  },
};

// QUESTIONS API
export const questionsApi = {
  getQuestionsByTestId: async (testId: string, forStudent: boolean = false): Promise<Question[]> => {
    await delay(500);
    
    let questions = mockQuestions.filter(q => q.testId === testId);
    
    // Shuffle questions for students
    if (forStudent) {
      questions = shuffleArray(questions);
      // Remove correct answer info for students
      questions = questions.map(q => ({
        ...q,
        options: shuffleArray(q.options.map(o => ({ id: o.id, text: o.text }))),
      }));
    }
    
    return questions;
  },

  createQuestion: async (data: Omit<Question, 'id'>): Promise<Question> => {
    await delay(600);
    
    const newQuestion: Question = {
      ...data,
      id: `q-${Date.now()}`,
    };
    
    mockQuestions.push(newQuestion);
    
    // Update test question count and points
    const test = mockTests.find(t => t.id === data.testId);
    if (test) {
      test.questionCount++;
      test.totalPoints += data.points;
    }
    
    return newQuestion;
  },
};

// TEST SUBMISSION API
export const submissionApi = {
  submitTest: async (
    testId: string, 
    studentId: string, 
    answers: StudentAnswer[],
    timeSpent: number
  ): Promise<TestResult> => {
    await delay(1500); // Simulate backend processing
    
    // In real app, server calculates score. Here we simulate.
    const questions = mockQuestions.filter(q => q.testId === testId);
    let score = 0;
    
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        const correctOption = question.options.find(o => o.isCorrect);
        if (correctOption && correctOption.id === answer.selectedOptionId) {
          score += question.points;
        }
      }
    });
    
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    
    const result: TestResult = {
      id: `result-${Date.now()}`,
      testId,
      studentId,
      score,
      totalPoints,
      percentage: Math.round((score / totalPoints) * 100),
      rank: Math.floor(Math.random() * 10) + 1, // Mock rank
      totalParticipants: Math.floor(Math.random() * 50) + 20,
      timeSpent,
      submittedAt: new Date().toISOString(),
    };
    
    mockResults.push(result);
    return result;
  },

  getResultForStudent: async (testId: string, studentId: string): Promise<TestResult | null> => {
    await delay(400);
    return mockResults.find(r => r.testId === testId && r.studentId === studentId) || null;
  },

  getResultsByTestId: async (testId: string): Promise<TestResult[]> => {
    await delay(500);
    return mockResults.filter(r => r.testId === testId);
  },
};

// STATISTICS API
export const statisticsApi = {
  getStatistics: async (filter?: { testId?: string; subject?: string }): Promise<TestStatistics[]> => {
    await delay(600);
    
    let stats = [...mockStatistics];
    
    if (filter?.testId) {
      stats = stats.filter(s => s.testId === filter.testId);
    }
    
    return stats;
  },

  getLeaderboard: async (testId: string): Promise<TestStatistics['rankings']> => {
    await delay(500);
    
    const stats = mockStatistics.find(s => s.testId === testId);
    return stats?.rankings || [];
  },
};
