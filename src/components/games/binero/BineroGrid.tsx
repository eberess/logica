'use client';

import { Box, Paper, Typography, useTheme, Theme } from '@mui/material';
import { memo, useCallback, useMemo } from 'react';

type CellValue = 0 | 1 | null;
type Grid = CellValue[][];

interface BineroGridProps {
  grid: Grid;
  onCellClick: (row: number, col: number) => void;
  showHints?: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Composant de cellule mémorisé pour éviter les re-rendus inutiles
const BineroCell = memo(({ 
  value, 
  isConflict, 
  showHints, 
  onClick, 
  theme 
}: { 
  value: CellValue; 
  isConflict: boolean; 
  showHints: boolean; 
  onClick: () => void; 
  theme: Theme;
}) => (
  <Box
    onClick={onClick}
    sx={{
      width: { xs: 32, sm: 40 },
      height: { xs: 32, sm: 40 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${theme.palette.divider}`,
      cursor: 'pointer',
      backgroundColor: value === null
        ? theme.palette.background.default
        : isConflict && showHints
          ? theme.palette.error.light
          : theme.palette.background.paper,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontSize: { xs: '1rem', sm: '1.25rem' },
        color: value === null
          ? 'transparent'
          : isConflict && showHints
            ? theme.palette.error.main
            : theme.palette.text.primary,
      }}
    >
      {value === null ? '·' : value}
    </Typography>
  </Box>
));

BineroCell.displayName = 'BineroCell';

export const BineroGrid = memo(({ grid, onCellClick, showHints = false, difficulty }: BineroGridProps) => {
  const theme = useTheme();
  const size = grid.length;

  // Vérifie si une cellule est en conflit avec les règles
  const isCellInConflict = useCallback((row: number, col: number): boolean => {
    if (grid[row][col] === null) return false;

    const value = grid[row][col];
    const rowValues = grid[row];
    const colValues = grid.map((r: CellValue[]) => r[col]);

    // Vérifier les chiffres consécutifs horizontalement
    if (col >= 2 && rowValues[col - 1] === value && rowValues[col - 2] === value) return true;
    if (col <= size - 3 && rowValues[col + 1] === value && rowValues[col + 2] === value) return true;
    if (col > 0 && col < size - 1 && rowValues[col - 1] === value && rowValues[col + 1] === value) return true;

    // Vérifier les chiffres consécutifs verticalement
    if (row >= 2 && colValues[row - 1] === value && colValues[row - 2] === value) return true;
    if (row <= size - 3 && colValues[row + 1] === value && colValues[row + 2] === value) return true;
    if (row > 0 && row < size - 1 && colValues[row - 1] === value && colValues[row + 1] === value) return true;

    // Vérifier le nombre de 0 et 1 dans la ligne
    const rowZeros = rowValues.filter((cell: CellValue) => cell === 0).length;
    const rowOnes = rowValues.filter((cell: CellValue) => cell === 1).length;
    const maxAllowed = Math.ceil(size / 2);
    if (rowZeros > maxAllowed || rowOnes > maxAllowed) return true;

    // Vérifier le nombre de 0 et 1 dans la colonne
    const colZeros = colValues.filter((cell: CellValue) => cell === 0).length;
    const colOnes = colValues.filter((cell: CellValue) => cell === 1).length;
    if (colZeros > maxAllowed || colOnes > maxAllowed) return true;

    // Vérifier les lignes/colonnes identiques uniquement en mode difficile
    if (difficulty === 'hard') {
      const rowStr = rowValues.join(',');
      const colStr = colValues.join(',');
      
      // Vérifier si cette ligne est identique à une autre ligne
      for (let i = 0; i < size; i++) {
        if (i !== row) {
          const otherRowStr = grid[i].join(',');
          if (rowStr === otherRowStr) return true;
        }
      }
      
      // Vérifier si cette colonne est identique à une autre colonne
      for (let i = 0; i < size; i++) {
        if (i !== col) {
          const otherColStr = grid.map((r: CellValue[]) => r[i]).join(',');
          if (colStr === otherColStr) return true;
        }
      }
    }

    return false;
  }, [grid, size, difficulty]);

  // Mémoriser la grille pour éviter les recalculs inutiles
  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${size}, 1fr)`,
    gap: 1,
    justifyContent: 'center',
  }), [size]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 1, sm: 2 },
        display: 'inline-block',
        backgroundColor: theme.palette.background.paper,
        margin: '0 auto',
        maxWidth: '100%',
        overflow: 'auto',
      }}
    >
      <Box sx={gridStyle}>
        {grid.map((row: CellValue[], rowIndex: number) =>
          row.map((cell: CellValue, colIndex: number) => (
            <BineroCell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              isConflict={isCellInConflict(rowIndex, colIndex)}
              showHints={showHints}
              onClick={() => onCellClick(rowIndex, colIndex)}
              theme={theme}
            />
          ))
        )}
      </Box>
    </Paper>
  );
});

BineroGrid.displayName = 'BineroGrid'; 