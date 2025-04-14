type CellValue = 0 | 1 | null;
type Grid = CellValue[][];

interface GridSize {
  rows: number;
  cols: number;
}

// Vérifie si une ligne ou colonne a un nombre égal de 0 et 1
const hasEqualZerosAndOnes = (line: CellValue[]): boolean => {
  // Ne vérifier que si la ligne est complète
  if (line.some(cell => cell === null)) {
    return true; // Si la ligne n'est pas complète, on considère qu'elle est valide
  }
  
  const zeros = line.filter(cell => cell === 0).length;
  const ones = line.filter(cell => cell === 1).length;
  return zeros === ones;
};

// Vérifie s'il y a plus de deux chiffres identiques consécutifs
const hasMoreThanTwoConsecutive = (line: CellValue[]): boolean => {
  // Ne vérifier que si la ligne est complète
  if (line.some(cell => cell === null)) {
    return false; // Si la ligne n'est pas complète, on ne vérifie pas cette règle
  }
  
  for (let i = 0; i < line.length - 2; i++) {
    // Vérifier trois cellules consécutives
    if (line[i] !== null && line[i] === line[i + 1] && line[i] === line[i + 2]) {
      return true;
    }
  }
  return false;
};

// Vérifie si deux lignes ou colonnes sont identiques
const hasDuplicateLines = (grid: Grid): boolean => {
  // Ne vérifier que si la grille est complète
  if (grid.some(row => row.some(cell => cell === null))) {
    return false; // Si la grille n'est pas complète, on ne vérifie pas cette règle
  }
  
  // Convertir les lignes et colonnes en chaînes de caractères pour la comparaison
  const rows = grid.map(row => row.join(','));
  const cols = grid[0].map((_, colIndex) => 
    grid.map(row => row[colIndex]).join(',')
  );

  // Vérifier si le nombre de lignes/colonnes uniques est égal au nombre total
  // Si ce n'est pas le cas, il y a des doublons
  return new Set(rows).size !== rows.length || new Set(cols).size !== cols.length;
};

// Génère une grille valide selon le niveau de difficulté
export const generateBinero = (size: number, difficulty: 'easy' | 'medium' | 'hard'): Grid => {
  const grid: Grid = Array(size).fill(null).map(() => Array(size).fill(null));
  
  // Nombre de cases pré-remplies selon la difficulté
  const filledCells = {
    easy: Math.floor(size * size * 0.3),
    medium: Math.floor(size * size * 0.2),
    hard: Math.floor(size * size * 0.1),
  }[difficulty];

  // Fonction pour vérifier si une valeur peut être placée
  const canPlaceValue = (row: number, col: number, value: 0 | 1): boolean => {
    // Vérifier les chiffres consécutifs horizontalement
    if (col >= 2 && grid[row][col - 1] === value && grid[row][col - 2] === value) return false;
    if (col <= size - 3 && grid[row][col + 1] === value && grid[row][col + 2] === value) return false;
    if (col > 0 && col < size - 1 && grid[row][col - 1] === value && grid[row][col + 1] === value) return false;

    // Vérifier les chiffres consécutifs verticalement
    if (row >= 2 && grid[row - 1][col] === value && grid[row - 2][col] === value) return false;
    if (row <= size - 3 && grid[row + 1][col] === value && grid[row + 2][col] === value) return false;
    if (row > 0 && row < size - 1 && grid[row - 1][col] === value && grid[row + 1][col] === value) return false;

    // Vérifier le nombre de 0 et 1 dans la ligne
    const rowZeros = grid[row].filter(cell => cell === 0).length + (value === 0 ? 1 : 0);
    const rowOnes = grid[row].filter(cell => cell === 1).length + (value === 1 ? 1 : 0);
    if (rowZeros > size / 2 || rowOnes > size / 2) return false;

    // Vérifier le nombre de 0 et 1 dans la colonne
    const colZeros = grid.map(r => r[col]).filter(cell => cell === 0).length + (value === 0 ? 1 : 0);
    const colOnes = grid.map(r => r[col]).filter(cell => cell === 1).length + (value === 1 ? 1 : 0);
    if (colZeros > size / 2 || colOnes > size / 2) return false;

    return true;
  };

  // Fonction pour résoudre la grille
  const solve = (row: number = 0, col: number = 0): boolean => {
    if (col === size) {
      col = 0;
      row++;
    }
    if (row === size) return true;

    if (grid[row][col] !== null) {
      return solve(row, col + 1);
    }

    const values: (0 | 1)[] = Math.random() < 0.5 ? [0, 1] : [1, 0];
    for (const value of values) {
      if (canPlaceValue(row, col, value)) {
        grid[row][col] = value;
        if (solve(row, col + 1)) return true;
        grid[row][col] = null;
      }
    }

    return false;
  };

  // Générer une solution valide
  solve();

  // Retirer des cellules aléatoirement selon la difficulté
  let removed = 0;

  while (removed < filledCells) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    if (grid[row][col] !== null) {
      grid[row][col] = null;
      removed++;
    }
  }

  return grid;
};

// Vérifie si la grille est valide selon toutes les règles
export const validateGrid = (grid: Grid, difficulty: 'easy' | 'medium' | 'hard'): boolean => {
  // Vérifier si la grille est complète
  if (!isGridComplete(grid)) {
    return false;
  }
  
  // Vérifier chaque ligne et colonne
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    const col = grid.map(r => r[i]);

    // Vérifier le nombre égal de 0 et 1
    if (!hasEqualZerosAndOnes(row) || !hasEqualZerosAndOnes(col)) {
      return false;
    }

    // Vérifier les chiffres consécutifs
    if (hasMoreThanTwoConsecutive(row) || hasMoreThanTwoConsecutive(col)) {
      return false;
    }
  }

  // Vérifier les lignes/colonnes identiques uniquement en mode difficile
  if (difficulty === 'hard' && hasDuplicateLines(grid)) {
    return false;
  }

  return true;
};

// Vérifie si la grille est complète
export const isGridComplete = (grid: Grid): boolean => {
  return grid.every(row => row.every(cell => cell !== null));
};

// Calcule le score en fonction du temps et des erreurs
export const calculateScore = (
  difficulty: 'easy' | 'medium' | 'hard',
  timeInSeconds: number,
  mistakes: number,
  gridSize: GridSize
): number => {
  const baseScore = 1000;
  const sizeMultiplier = (gridSize.rows * gridSize.cols) / 64; // 8x8 comme référence
  const timeMultiplier = Math.max(0, 1 - timeInSeconds / 1800); // 30 minutes max
  const mistakePenalty = Math.max(0, 1 - (mistakes * 0.1)); // -10% par erreur
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  }[difficulty];

  return Math.round(
    baseScore * 
    sizeMultiplier * 
    difficultyMultiplier * 
    timeMultiplier * 
    mistakePenalty
  );
}; 