export type LocationType = 'city' | 'town';

export interface SpawnPoint {
  id: string;
  location: LocationType;
  x: number; // percentage (0-100) within its half
  y: number; // percentage (0-100) within container
  spotName: string;
  spotNameEn: string;
  hint: string;
}

export type GameDifficulty = 'easy' | 'normal' | 'challenge';

export interface DifficultyConfig {
  name: string;
  durationMs: number;
  label: string;
  description: string;
  speedTag: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  accuracy: number;
  stars: number;
  date: string;
  badge: string;
}

export interface WordInfo {
  word: string;
  phonetic: string;
  meaning: string;
  chinese: string;
  rhymeKey?: string;
  exampleSentence: string;
  audioText: string;
  visualHint: string;
  funFact: string;
}
