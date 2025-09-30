export interface CrosswordCell {
  letter: string;
  number?: number;
  isBlack: boolean;
  userInput: string;
  isCorrect?: boolean;
}

export interface CrosswordClue {
  number: number;
  direction: 'horizontal' | 'vertical';
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
  length: number;
}

export interface CrosswordGrid {
  id: string;
  name: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  size: { rows: number; cols: number };
  cells: CrosswordCell[][];
  clues: CrosswordClue[];
}

export interface GameProgress {
  gridId: string;
  cells: CrosswordCell[][];
  completedAt?: Date;
  timeSpent: number;
  hintsUsed: number;
}