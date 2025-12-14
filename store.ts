import { create } from 'zustand';
import { ViewState, SimulationConfig } from './types';

interface AppState {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  
  simConfig: SimulationConfig;
  updateSimConfig: (config: Partial<SimulationConfig>) => void;

  universeScale: number; // 0 (Solar System) to 100 (Cosmic Web)
  setUniverseScale: (scale: number) => void;
}

export const useStore = create<AppState>((set) => ({
  currentView: ViewState.HOME,
  setView: (view) => set({ currentView: view }),

  simConfig: {
    // Defaults
    mass: 10,
    spin: 0,
    accretionDisk: true,
    velocity: 50,
    angle: 45,
    gravity: 9.81,
    atomicNumber: 1,
    excitedState: 1,
    temperature: 300,
    materialConductivity: 0.5,
  },
  updateSimConfig: (config) => 
    set((state) => ({ simConfig: { ...state.simConfig, ...config } })),

  universeScale: 0,
  setUniverseScale: (scale) => set({ universeScale: scale }),
}));