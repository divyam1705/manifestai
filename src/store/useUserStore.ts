import { create } from "zustand";

interface UserPreferences {
  chronotype: "morning" | "night" | null;
  focusTime: string | null;
  workStyle: "strict" | "flexible" | null;
  breakPreferences: number | null;
  distractions: string[] | null;
  workMode: "deep" | "pomodoro" | "time-blocking" | null;
  includeExercise: boolean;
  includeMeditation: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

interface UserState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  preferences: UserPreferences;
  goals: Goal[];
  currentGoal: Goal | null;

  // Actions
  setAuthenticated: (
    isAuthenticated: boolean,
    userId?: string | null,
    email?: string | null
  ) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  addGoal: (goal: Goal) => void;
  setCurrentGoal: (goalId: string) => void;
}

const defaultPreferences: UserPreferences = {
  chronotype: null,
  focusTime: null,
  workStyle: null,
  breakPreferences: null,
  distractions: null,
  workMode: null,
  includeExercise: false,
  includeMeditation: false,
};

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  userId: null,
  email: null,
  preferences: defaultPreferences,
  goals: [],
  currentGoal: null,

  setAuthenticated: (isAuthenticated, userId = null, email = null) =>
    set({ isAuthenticated, userId, email }),

  setPreferences: (preferences) =>
    set((state) => ({
      preferences: { ...state.preferences, ...preferences },
    })),

  addGoal: (goal) =>
    set((state) => ({
      goals: [...state.goals, goal],
      currentGoal: state.goals.length === 0 ? goal : state.currentGoal,
    })),

  setCurrentGoal: (goalId) =>
    set((state) => ({
      currentGoal: state.goals.find((goal) => goal.id === goalId) || null,
    })),
}));
