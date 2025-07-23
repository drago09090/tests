import { create } from 'zustand';
import { SpeedTestResult, DetailedNetworkInfo } from '../types/speed';

interface SpeedStore {
  currentTest: SpeedTestResult | null;
  isLoading: boolean;
  history: SpeedTestResult[];
  networkInfo: DetailedNetworkInfo;
  error: string | null;
  setCurrentTest: (test: SpeedTestResult) => void;
  setIsLoading: (loading: boolean) => void;
  addToHistory: (test: SpeedTestResult) => void;
  setNetworkInfo: (info: DetailedNetworkInfo) => void;
  setError: (error: string | null) => void;
  clearHistory: () => void;
}

export const useSpeedStore = create<SpeedStore>((set) => ({
  currentTest: null,
  isLoading: false,
  history: [],
  networkInfo: { type: 'unknown' },
  error: null,
  setCurrentTest: (test) => set({ currentTest: test }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  addToHistory: (test) => set((state) => ({ history: [...state.history, test] })),
  setNetworkInfo: (info) => set({ networkInfo: info }),
  setError: (error) => set({ error }),
  clearHistory: () => set({ history: [] }),
}));