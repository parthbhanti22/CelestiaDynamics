export enum ViewState {
  HOME = 'HOME',
  COSMOS = 'COSMOS',
  SIM_BLACKHOLE = 'SIM_BLACKHOLE',
  SIM_PROJECTILE = 'SIM_PROJECTILE',
  SIM_ATOMIC = 'SIM_ATOMIC',
  SIM_THERMAL = 'SIM_THERMAL',
  SIM_PENROSE = 'SIM_PENROSE',
  THEORY = 'THEORY',
  BLOG = 'BLOG',
  ABOUT = 'ABOUT',
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
  MAINTENANCE = 'MAINTENANCE'
}

export interface SimulationConfig {
  // Black Hole
  mass: number;
  spin: number;
  accretionDisk: boolean;
  
  // Projectile
  velocity: number;
  angle: number;
  gravity: number;
  
  // Atomic
  atomicNumber: number; // 1 for Hydrogen
  excitedState: number; // n level
  
  // Thermal
  temperature: number;
  materialConductivity: number;
}

export interface TheoryItem {
  id: string;
  title: string;
  latex: string;
  description: string;
  derivation: string[];
}

export interface AIExplanationRequest {
  topic: string;
  level: 'beginner' | 'advanced';
}