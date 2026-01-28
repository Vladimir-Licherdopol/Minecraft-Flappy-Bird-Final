
import { Difficulty, Biome, Skin } from './types';

// Dimensions
export const LANDSCAPE_WIDTH = 1200;
export const LANDSCAPE_HEIGHT = 750;
export const PORTRAIT_WIDTH = 400;
export const PORTRAIT_HEIGHT = 600;

export const BIRD_SIZE = 34;
export const PIPE_WIDTH = 60;
export const GROUND_HEIGHT = 100;

export const DIFFICULTY_SETTINGS = {
  [Difficulty.EASY]: {
    gravity: 0.25,
    jumpStrength: -5,
    pipeSpeed: 2.5,
    pipeGap: 180,
    pipeFrequency: 100,
  },
  [Difficulty.HARD]: {
    gravity: 0.35,
    jumpStrength: -6,
    pipeSpeed: 4,
    pipeGap: 140,
    pipeFrequency: 75,
  },
};

export const BIOME_THEMES = {
  [Biome.PLAINS]: {
    background: '#70c5ce',
    ground: '#7cfc00',
    groundDark: '#55a630',
    pipeColor: '#2ecc71',
    pipeBorder: '#27ae60',
  },
  [Biome.DESERT]: {
    background: '#f4a460',
    ground: '#edc9af',
    groundDark: '#c2b280',
    pipeColor: '#f1c40f',
    pipeBorder: '#d4ac0d',
  },
  [Biome.NETHER]: {
    background: '#4a0e0e',
    ground: '#8b0000',
    groundDark: '#5c0000',
    pipeColor: '#e67e22',
    pipeBorder: '#d35400',
  },
  [Biome.OCEAN]: {
    background: '#005f73',
    ground: '#00d2ff',
    groundDark: '#0077be',
    pipeColor: '#3498db',
    pipeBorder: '#2980b9',
  },
};

export const SKIN_COLORS = {
  [Skin.CREEPER]: { body: '#45a049', head: '#000000', detail: '#000000' },
  [Skin.CHICKEN]: { body: '#FFFFFF', head: '#FFFFFF', detail: '#FF0000' },
  [Skin.DUCK]: { body: '#FFFF00', head: '#FFFF00', detail: '#FFA500' },
};

export const STEAK_COLORS = {
  body: '#8B4513',
  detail: '#CD5C5C',
};

export const PARTICLE_GRAVITY = 0.1;

export const JUMP_PARTICLE_COUNT = 5;
export const JUMP_PARTICLE_LIFETIME = 15;
export const JUMP_PARTICLE_VELOCITY_Y_MIN = -2;
export const JUMP_PARTICLE_VELOCITY_Y_MAX = -0.5;
