
export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}

export enum Difficulty {
  EASY = 'EASY',
  HARD = 'HARD'
}

export enum Biome {
  PLAINS = 'PLAINS',
  DESERT = 'DESERT',
  NETHER = 'NETHER',
  OCEAN = 'OCEAN'
}

export enum Skin {
  CREEPER = 'CREEPER',
  CHICKEN = 'CHICKEN',
  DUCK = 'DUCK'
}

export interface GameConfig {
  gravity: number;
  jumpStrength: number;
  pipeSpeed: number;
  pipeGap: number;
  pipeFrequency: number;
}

export interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
  exploded?: boolean; // New property: true if the pipe has been "exploded"
}

export interface BirdState {
  y: number;
  velocity: number;
}

export interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  velocityX: number;
  velocityY: number;
  lifetime: number;
}

export interface JumpParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  velocityX: number;
  velocityY: number;
  lifetime: number;
}