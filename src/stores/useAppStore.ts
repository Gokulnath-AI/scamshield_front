import { create } from "zustand";

interface AppState {
  scrollProgress: number;
  currentScene: number;
  sceneProgress: number;
  gpuTier: number;
  reducedMotion: boolean;
  cursorPosition: { x: number; y: number };
  isLoaded: boolean;
  demoActive: boolean;
  analysisOpen: boolean;

  setScrollProgress: (progress: number) => void;
  setCursorPosition: (x: number, y: number) => void;
  setGpuTier: (tier: number) => void;
  setReducedMotion: (v: boolean) => void;
  setIsLoaded: (v: boolean) => void;
  setDemoActive: (v: boolean) => void;
  setAnalysisOpen: (v: boolean) => void;
}

const SCENE_COUNT = 7;

export const useAppStore = create<AppState>((set) => ({
  scrollProgress: 0,
  currentScene: 0,
  sceneProgress: 0,
  gpuTier: 2,
  reducedMotion: false,
  cursorPosition: { x: 0, y: 0 },
  isLoaded: false,
  demoActive: false,
  analysisOpen: false,

  setScrollProgress: (progress: number) => {
    const sceneFloat = progress * SCENE_COUNT;
    const currentScene = Math.min(Math.floor(sceneFloat), SCENE_COUNT - 1);
    const sceneProgress = sceneFloat - currentScene;
    set({ scrollProgress: progress, currentScene, sceneProgress });
  },
  setCursorPosition: (x: number, y: number) => set({ cursorPosition: { x, y } }),
  setGpuTier: (tier: number) => set({ gpuTier: tier }),
  setReducedMotion: (v: boolean) => set({ reducedMotion: v }),
  setIsLoaded: (v: boolean) => set({ isLoaded: v }),
  setDemoActive: (v: boolean) => set({ demoActive: v }),
  setAnalysisOpen: (v: boolean) => set({ analysisOpen: v }),
}));
