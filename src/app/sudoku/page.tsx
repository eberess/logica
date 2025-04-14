'use client';

import { Box, Container, Typography, Button, useTheme, ButtonGroup, Alert, Snackbar } from '@mui/material';
import { SudokuGrid } from '@/components/games/sudoku/SudokuGrid';
import { Timer } from '@/components/games/sudoku/Timer';
import { generateSudoku, validateGrid, isGridComplete } from '@/components/games/sudoku/sudokuLogic';
import { useState, useCallback, useEffect } from 'react';

interface GameState {
  grid: (number | null)[][];
  difficulty: 'easy' | 'medium' | 'hard';
  isPlaying: boolean;
  score: number;
  bestScores: Record<string, number>;
}

const DIFFICULTY_MULTIPLIER = {
  easy: 1,
  medium: 2,
  hard: 3,
};

const calculateScore = (difficulty: 'easy' | 'medium' | 'hard', timeInSeconds: number): number => {
  const baseScore = 1000;
  const timeMultiplier = Math.max(0, 1 - timeInSeconds / 3600); // 1 heure max
  return Math.round(baseScore * DIFFICULTY_MULTIPLIER[difficulty] * timeMultiplier);
};

export default function SudokuPage() {
  const theme = useTheme();
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem('sudokuGameState');
    const savedBestScores = localStorage.getItem('sudokuBestScores');
    
    return {
      grid: generateSudoku('easy'),
      difficulty: 'easy',
      isPlaying: false,
      score: 0,
      bestScores: savedBestScores ? JSON.parse(savedBestScores) : { easy: 0, medium: 0, hard: 0 },
    };
  });

  const [message, setMessage] = useState<{ text: string; severity: 'success' | 'error' | 'info' }>({ text: '', severity: 'info' });

  useEffect(() => {
    localStorage.setItem('sudokuBestScores', JSON.stringify(gameState.bestScores));
  }, [gameState.bestScores]);

  const handleCellChange = (row: number, col: number, value: number | null) => {
    const newGrid = gameState.grid.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? value : c))
    );

    setGameState(prev => ({ ...prev, grid: newGrid }));

    if (isGridComplete(newGrid)) {
      handleGameComplete();
    }
  };

  const handleGameComplete = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    setMessage({ text: 'Félicitations ! Vous avez terminé le Sudoku !', severity: 'success' });
  };

  const handleNewGame = useCallback((newDifficulty: GameState['difficulty']) => {
    setGameState(prev => ({
      ...prev,
      grid: generateSudoku(newDifficulty),
      difficulty: newDifficulty,
      isPlaying: true,
      score: 0,
    }));
    setMessage({ text: `Nouvelle partie en difficulté ${newDifficulty}`, severity: 'info' });
  }, []);

  const handleCheck = () => {
    if (validateGrid(gameState.grid)) {
      setMessage({ text: 'La grille est valide, continuez !', severity: 'success' });
    } else {
      setMessage({ text: 'Il y a des erreurs dans la grille', severity: 'error' });
    }
  };

  const handleTimeUpdate = (seconds: number) => {
    const currentScore = calculateScore(gameState.difficulty, seconds);
    setGameState(prev => ({ ...prev, score: currentScore }));
  };

  const updateBestScore = useCallback((score: number) => {
    setGameState(prev => ({
      ...prev,
      bestScores: {
        ...prev.bestScores,
        [prev.difficulty]: Math.max(score, prev.bestScores[prev.difficulty] || 0),
      },
    }));
  }, []);

  useEffect(() => {
    if (!gameState.isPlaying && gameState.score > 0) {
      updateBestScore(gameState.score);
    }
  }, [gameState.isPlaying, gameState.score, updateBestScore]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography
          component="h1"
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 4,
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Sudoku
        </Typography>

        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Timer isRunning={gameState.isPlaying} onTimeUpdate={handleTimeUpdate} />
              <Typography variant="h6">
                Score: {gameState.score}
              </Typography>
            </Box>
            <Typography variant="subtitle1" textAlign="center" color="text.secondary">
              Meilleur score ({gameState.difficulty}): {gameState.bestScores[gameState.difficulty] || 0}
            </Typography>
          </Box>

          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <ButtonGroup variant="outlined">
              <Button
                onClick={() => handleNewGame('easy')}
                variant={gameState.difficulty === 'easy' ? 'contained' : 'outlined'}
              >
                Facile
              </Button>
              <Button
                onClick={() => handleNewGame('medium')}
                variant={gameState.difficulty === 'medium' ? 'contained' : 'outlined'}
              >
                Moyen
              </Button>
              <Button
                onClick={() => handleNewGame('hard')}
                variant={gameState.difficulty === 'hard' ? 'contained' : 'outlined'}
              >
                Difficile
              </Button>
            </ButtonGroup>
          </Box>

          <SudokuGrid
            initialGrid={gameState.grid}
            onCellChange={handleCellChange}
          />
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleNewGame(gameState.difficulty)}
            >
              Nouvelle Partie
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCheck}
            >
              Vérifier
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={!!message.text}
        autoHideDuration={3000}
        onClose={() => setMessage({ text: '', severity: 'info' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={message.severity} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
} 