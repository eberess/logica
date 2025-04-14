type Grid = (number | null)[][];

// Vérifie si un nombre peut être placé dans une cellule
const isValid = (grid: Grid, row: number, col: number, num: number): boolean => {
  // Vérifie la ligne
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Vérifie la colonne
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Vérifie le bloc 3x3
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

// Résout une grille de Sudoku
const solveSudoku = (grid: Grid): boolean => {
  let row = 0;
  let col = 0;
  let isEmpty = false;

  // Trouve une cellule vide
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === null) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }

  // Si toutes les cellules sont remplies, la grille est résolue
  if (!isEmpty) return true;

  // Essaie les chiffres 1-9
  for (let num = 1; num <= 9; num++) {
    if (isValid(grid, row, col, num)) {
      grid[row][col] = num;
      if (solveSudoku(grid)) return true;
      grid[row][col] = null;
    }
  }

  return false;
};

// Génère une nouvelle grille de Sudoku
export const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard'): Grid => {
  // Crée une grille vide
  const grid: Grid = Array(9).fill(null).map(() => Array(9).fill(null));

  // Remplit quelques cellules aléatoirement
  for (let i = 0; i < 3; i++) {
    const num = Math.floor(Math.random() * 9) + 1;
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (isValid(grid, row, col, num)) {
      grid[row][col] = num;
    }
  }

  // Résout la grille
  solveSudoku(grid);

  // Détermine le nombre de cellules à retirer selon la difficulté
  const cellsToRemove = {
    easy: 40,
    medium: 50,
    hard: 60,
  }[difficulty];

  // Retire des cellules aléatoirement
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (grid[row][col] !== null) {
      grid[row][col] = null;
      removed++;
    }
  }

  return grid;
};

// Vérifie si la grille est valide
export const validateGrid = (grid: Grid): boolean => {
  // Vérifie chaque ligne
  for (let row = 0; row < 9; row++) {
    const nums = new Set();
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];
      if (num !== null) {
        if (nums.has(num)) return false;
        nums.add(num);
      }
    }
  }

  // Vérifie chaque colonne
  for (let col = 0; col < 9; col++) {
    const nums = new Set();
    for (let row = 0; row < 9; row++) {
      const num = grid[row][col];
      if (num !== null) {
        if (nums.has(num)) return false;
        nums.add(num);
      }
    }
  }

  // Vérifie chaque bloc 3x3
  for (let block = 0; block < 9; block++) {
    const nums = new Set();
    const startRow = Math.floor(block / 3) * 3;
    const startCol = (block % 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const num = grid[startRow + i][startCol + j];
        if (num !== null) {
          if (nums.has(num)) return false;
          nums.add(num);
        }
      }
    }
  }

  return true;
};

// Vérifie si la grille est complète
export const isGridComplete = (grid: Grid): boolean => {
  return grid.every(row => row.every(cell => cell !== null)) && validateGrid(grid);
}; 