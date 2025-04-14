'use client';

import { Box, TextField, useTheme } from '@mui/material';
import { useState } from 'react';

interface SudokuGridProps {
  initialGrid: (number | null)[][];
  onCellChange: (row: number, col: number, value: number | null) => void;
}

export const SudokuGrid = ({ initialGrid, onCellChange }: SudokuGridProps) => {
  const theme = useTheme();
  const [grid, setGrid] = useState(initialGrid);

  const handleChange = (row: number, col: number, value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    if (numValue === null || (numValue >= 1 && numValue <= 9)) {
      const newGrid = grid.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? numValue : c))
      );
      setGrid(newGrid);
      onCellChange(row, col, numValue);
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)',
        gap: 0.5,
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        '& > div': {
          aspectRatio: '1/1',
        },
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <TextField
            key={`${rowIndex}-${colIndex}`}
            value={cell || ''}
            onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
            inputProps={{
              maxLength: 1,
              style: {
                padding: 0,
                textAlign: 'center',
                fontSize: '1.2rem',
                height: '100%',
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '100%',
                backgroundColor: theme.palette.background.paper,
                borderRadius: 0,
                borderRight: (colIndex + 1) % 3 === 0 ? 2 : 1,
                borderBottom: (rowIndex + 1) % 3 === 0 ? 2 : 1,
                borderColor: theme.palette.divider,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        ))
      )}
    </Box>
  );
}; 