
export type GameStatus = 'MENU' | 'PLAYING' | 'LEVEL_WON' | 'GAME_OVER' | 'FINAL_STATS';

export interface GuessRecord {
  guess: string;
  correctCount: number;
}

export interface LevelStats {
  level: number; // 2, 3, 4, 5, 6 digits
  attempts: number;
  timeSpent: number; // seconds
}

export interface PlayerHistory {
  totalLevels: number;
  levels: LevelStats[];
  totalAttempts: number;
}
