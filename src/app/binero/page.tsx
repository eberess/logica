'use client';

import { Box, Container, Typography, Button, useTheme, ButtonGroup, Alert, Snackbar, IconButton, Tooltip, Paper, Divider, Dialog, DialogTitle, DialogContent, LinearProgress } from '@mui/material';
import { BineroGrid } from '@/components/games/binero/BineroGrid';
import { Timer } from '@/components/games/sudoku/Timer';
import { generateBinero, validateGrid, isGridComplete, calculateScore } from '@/components/games/binero/bineroLogic';
import { BineroRules } from '@/components/games/binero/BineroRules';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Help, Refresh, CheckCircle, Timer as TimerIcon, EmojiEvents, Undo, Settings } from '@mui/icons-material';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type CellValue = 0 | 1 | null;
type Grid = CellValue[][];

interface GameState {
  grid: Grid;
  difficulty: 'easy' | 'medium' | 'hard';
  isPlaying: boolean;
  score: number;
  size: number;
  mistakes: number;
  gridSize: { rows: number; cols: number };
}

const GRID_SIZES = [
  { rows: 6, cols: 6, label: '6×6' },
  { rows: 8, cols: 8, label: '8×8' },
  { rows: 10, cols: 10, label: '10×10' },
  { rows: 12, cols: 12, label: '12×12' },
  { rows: 14, cols: 14, label: '14×14' },
];

export default function BineroPage() {
  const theme = useTheme();
  const [showRules, setShowRules] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saveCounter, setSaveCounter] = useState(0);
  const [bestScores, setBestScores] = useLocalStorage<Record<string, number>>('bineroBestScores', {
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [savedGames, setSavedGames] = useLocalStorage<Record<string, GameState>>('bineroSavedGames', {});
  const [history, setHistory] = useState<Grid[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [gameState, setGameState] = useState<GameState>(() => ({
    grid: generateBinero(8, 'easy'),
    difficulty: 'easy',
    isPlaying: false,
    score: 0,
    size: 8,
    mistakes: 0,
    gridSize: { rows: 8, cols: 8 },
  }));

  const [message, setMessage] = useState<{ text: string; severity: 'success' | 'error' | 'info' }>({
    text: '',
    severity: 'info',
  });

  const memoizedGrid = useMemo(() => gameState.grid, [gameState.grid]);

  const gridCompletion = useMemo(() => {
    const totalCells = gameState.grid.length * gameState.grid.length;
    const filledCells = gameState.grid.flat().filter(cell => cell !== null).length;
    return Math.round((filledCells / totalCells) * 100);
  }, [gameState.grid]);

  const updateBestScore = useCallback((score: number) => {
    setBestScores(prev => ({
      ...prev,
      [gameState.difficulty]: Math.max(score, prev[gameState.difficulty] || 0),
    }));
  }, [gameState.difficulty, setBestScores]);

  useEffect(() => {
    if (!gameState.isPlaying && gameState.score > 0) {
      updateBestScore(gameState.score);
    }
  }, [gameState.isPlaying, gameState.score, updateBestScore]);

  const handleCellChange = useCallback((row: number, col: number, value: 0 | 1 | null) => {
    setGameState(prev => {
      const newGrid = prev.grid.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? value : c))
      );
      
      setHistory(prevHistory => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(newGrid)));
        return newHistory;
      });
      setHistoryIndex(prev => prev + 1);
      
      return { ...prev, grid: newGrid };
    });
  }, [historyIndex]);

  const handleGameComplete = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    setMessage({ text: 'Félicitations ! Vous avez terminé le Binero !', severity: 'success' });
  }, []);

  const handleNewGame = useCallback((newDifficulty: GameState['difficulty'], newSize?: { rows: number; cols: number }) => {
    const size = newSize || gameState.gridSize;
    
    setTimeout(() => {
      const newGrid = generateBinero(size.rows, newDifficulty);
      
      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        difficulty: newDifficulty,
        isPlaying: true,
        score: 0,
        mistakes: 0,
        gridSize: size,
      }));
      
      setMessage({ text: `Nouvelle partie en difficulté ${newDifficulty} (${size.rows}×${size.cols})`, severity: 'info' });
    }, 0);
  }, [gameState.gridSize]);

  const handleCheck = useCallback(() => {
    const isComplete = isGridComplete(gameState.grid);
    
    if (!isComplete) {
      setMessage({ 
        text: 'La grille n\'est pas complète. Continuez à remplir les cases vides.', 
        severity: 'info' 
      });
      return;
    }
    
    // Vérifier les règles une par une pour donner des messages plus précis
    let errorMessage = '';
    
    // Vérifier le nombre égal de 0 et 1 dans chaque ligne et colonne
    for (let i = 0; i < gameState.grid.length; i++) {
      const row = gameState.grid[i];
      const col = gameState.grid.map(r => r[i]);
      
      const rowZeros = row.filter(cell => cell === 0).length;
      const rowOnes = row.filter(cell => cell === 1).length;
      const colZeros = col.filter(cell => cell === 0).length;
      const colOnes = col.filter(cell => cell === 1).length;
      
      if (rowZeros !== rowOnes) {
        errorMessage = `La ligne ${i+1} n'a pas un nombre égal de 0 et de 1.`;
        break;
      }
      
      if (colZeros !== colOnes) {
        errorMessage = `La colonne ${i+1} n'a pas un nombre égal de 0 et de 1.`;
        break;
      }
    }
    
    // Vérifier les chiffres consécutifs
    if (!errorMessage) {
      for (let i = 0; i < gameState.grid.length; i++) {
        const row = gameState.grid[i];
        const col = gameState.grid.map(r => r[i]);
        
        for (let j = 0; j < gameState.grid.length - 2; j++) {
          if (row[j] !== null && row[j] === row[j+1] && row[j] === row[j+2]) {
            errorMessage = `La ligne ${i+1} contient trois ${row[j]} consécutifs.`;
            break;
          }
          
          if (col[j] !== null && col[j] === col[j+1] && col[j] === col[j+2]) {
            errorMessage = `La colonne ${i+1} contient trois ${col[j]} consécutifs.`;
            break;
          }
        }
        
        if (errorMessage) break;
      }
    }
    
    // Vérifier les lignes/colonnes identiques uniquement en mode difficile
    if (!errorMessage && gameState.difficulty === 'hard') {
      const rows = gameState.grid.map(row => row.join(','));
      const cols = gameState.grid[0].map((_, colIndex) => 
        gameState.grid.map(row => row[colIndex]).join(',')
      );
      
      // Vérifier les lignes identiques
      for (let i = 0; i < rows.length; i++) {
        for (let j = i + 1; j < rows.length; j++) {
          if (rows[i] === rows[j]) {
            errorMessage = `Les lignes ${i+1} et ${j+1} sont identiques.`;
            break;
          }
        }
        if (errorMessage) break;
      }
      
      // Vérifier les colonnes identiques
      if (!errorMessage) {
        for (let i = 0; i < cols.length; i++) {
          for (let j = i + 1; j < cols.length; j++) {
            if (cols[i] === cols[j]) {
              errorMessage = `Les colonnes ${i+1} et ${j+1} sont identiques.`;
              break;
            }
          }
          if (errorMessage) break;
        }
      }
    }
    
    if (errorMessage) {
      setGameState(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
      setMessage({ 
        text: `Erreur : ${errorMessage}`, 
        severity: 'error' 
      });
    } else {
      setMessage({ 
        text: 'Félicitations ! Votre grille est valide et complète.', 
        severity: 'success' 
      });
      handleGameComplete();
    }
  }, [gameState.grid, gameState.difficulty, handleGameComplete]);

  const handleTimeUpdate = useCallback((seconds: number) => {
    if (!gameState.isPlaying) return;
    
    const currentScore = calculateScore(
      gameState.difficulty,
      seconds,
      gameState.mistakes,
      gameState.gridSize
    );
    
    setGameState(prev => ({ ...prev, score: currentScore }));
  }, [gameState.difficulty, gameState.mistakes, gameState.gridSize, gameState.isPlaying]);

  const handleCellClick = useCallback((row: number, col: number) => {
    const currentValue = gameState.grid[row][col];
    let newValue: 0 | 1 | null = null;
    
    if (currentValue === null) {
      newValue = 0;
    } else if (currentValue === 0) {
      newValue = 1;
    }
    
    handleCellChange(row, col, newValue);
  }, [gameState.grid, handleCellChange]);

  useEffect(() => {
    if (isGridComplete(gameState.grid) && validateGrid(gameState.grid, gameState.difficulty)) {
      handleGameComplete();
    }
  }, [gameState.grid, gameState.difficulty, handleGameComplete]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setGameState(prev => ({
        ...prev,
        grid: JSON.parse(JSON.stringify(history[historyIndex - 1]))
      }));
    }
  }, [history, historyIndex]);

  const handleSaveGame = useCallback(() => {
    const saveKey = `binero_${gameState.difficulty}_${gameState.gridSize.rows}x${gameState.gridSize.cols}_${saveCounter}`;
    setSaveCounter(prev => prev + 1);
    setSavedGames(prev => ({
      ...prev,
      [saveKey]: gameState
    }));
    setMessage({ text: 'Partie sauvegardée avec succès !', severity: 'success' });
  }, [gameState, setSavedGames, saveCounter]);

  const handleLoadGame = useCallback((savedGame: GameState) => {
    setGameState(savedGame);
    setHistory([JSON.parse(JSON.stringify(savedGame.grid))]);
    setHistoryIndex(0);
    setMessage({ text: 'Partie chargée avec succès !', severity: 'success' });
    setShowSettings(false);
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 2, sm: 4 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: { xs: '100%', sm: 800 },
          mx: 'auto',
          px: { xs: 1, sm: 0 },
        }}>
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            mb: 3,
            gap: 2,
          }}>
            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                fontSize: { xs: '2rem', sm: '2.5rem' },
              }}
            >
              Binero
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Règles du jeu">
                <IconButton onClick={() => setShowRules(!showRules)} color="primary">
                  <Help />
                </IconButton>
              </Tooltip>
              <Tooltip title="Paramètres">
                <IconButton onClick={() => setShowSettings(!showSettings)} color="primary">
                  <Settings />
                </IconButton>
              </Tooltip>
              <Tooltip title="Nouvelle partie">
                <IconButton onClick={() => handleNewGame(gameState.difficulty)} color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Paper elevation={0} sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3, 
            border: `1px solid ${theme.palette.divider}`, 
            width: '100%',
            borderRadius: '12px',
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'center', sm: 'center' }, 
              mb: 2,
              gap: 2,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon color="primary" />
                <Timer isRunning={gameState.isPlaying} onTimeUpdate={handleTimeUpdate} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEvents color="primary" />
                <Typography variant="h6">
                  Score: {gameState.score}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progression: {gridCompletion}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Meilleur score ({gameState.difficulty}): {bestScores[gameState.difficulty] || 0}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={gridCompletion} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }}
              />
            </Box>
          </Paper>

          <Box sx={{ 
            mb: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2, 
            alignItems: 'center',
            width: '100%',
          }}>
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <ButtonGroup 
                variant="outlined" 
                size="large"
                sx={{
                  width: '100%',
                  '& .MuiButton-root': {
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                    flex: 1,
                    borderWidth: '2px',
                    '&.MuiButton-contained': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&.MuiButton-outlined': {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        backgroundColor: theme.palette.primary.light + '15',
                      },
                    },
                  },
                }}
              >
                <Button
                  onClick={() => handleNewGame('easy')}
                  variant={gameState.difficulty === 'easy' ? 'contained' : 'outlined'}
                  sx={{ 
                    borderRadius: '8px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                  }}
                >
                  Facile
                </Button>
                <Button
                  onClick={() => handleNewGame('medium')}
                  variant={gameState.difficulty === 'medium' ? 'contained' : 'outlined'}
                  sx={{ 
                    borderRadius: '8px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                  }}
                >
                  Moyen
                </Button>
                <Button
                  onClick={() => handleNewGame('hard')}
                  variant={gameState.difficulty === 'hard' ? 'contained' : 'outlined'}
                  sx={{ 
                    borderRadius: '8px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                  }}
                >
                  Difficile
                </Button>
              </ButtonGroup>
            </Box>

            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <ButtonGroup 
                variant="outlined" 
                size="large"
                sx={{
                  width: '100%',
                  '& .MuiButton-root': {
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                    flex: 1,
                    borderWidth: '2px',
                    '&.MuiButton-contained': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&.MuiButton-outlined': {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        backgroundColor: theme.palette.primary.light + '15',
                      },
                    },
                  },
                }}
              >
                {GRID_SIZES.map((size) => (
                  <Button
                    key={`${size.rows}×${size.cols}`}
                    onClick={() => handleNewGame(gameState.difficulty, { rows: size.rows, cols: size.cols })}
                    variant={
                      gameState.gridSize.rows === size.rows && gameState.gridSize.cols === size.cols
                        ? 'contained'
                        : 'outlined'
                    }
                    sx={{ 
                      borderRadius: '8px',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                    }}
                  >
                    {size.label}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
          </Box>

          <Box sx={{ 
            width: '100%',
            overflowX: 'auto',
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
          }}>
            <Box sx={{ 
              minWidth: { xs: '280px', sm: '400px' },
              maxWidth: '100%',
            }}>
              <BineroGrid
                grid={memoizedGrid}
                onCellClick={handleCellClick}
                showHints={showHints}
                difficulty={gameState.difficulty}
              />
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
            gap: 2, 
            width: '100%',
          }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleNewGame(gameState.difficulty)}
              startIcon={<Refresh />}
              size="large"
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                borderRadius: '8px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              Nouvelle Partie
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCheck}
              startIcon={<CheckCircle />}
              size="large"
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  backgroundColor: theme.palette.secondary.light + '15',
                },
                borderRadius: '8px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                borderWidth: '2px',
              }}
            >
              Vérifier
            </Button>
            <Button
              variant={showHints ? "contained" : "outlined"}
              color="info"
              onClick={() => setShowHints(!showHints)}
              startIcon={<Help />}
              size="large"
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                borderRadius: '8px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                ...(showHints ? {
                  background: `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                } : {
                  borderWidth: '2px',
                  '&:hover': {
                    backgroundColor: theme.palette.info.light + '15',
                  },
                }),
              }}
            >
              {showHints ? "Masquer" : "Indices"}
            </Button>
            <Tooltip title="Annuler le dernier coup">
              <span>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleUndo}
                  startIcon={<Undo />}
                  size="large"
                  disabled={historyIndex <= 0}
                  sx={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover:not(:disabled)': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? theme.palette.grey[800] 
                        : theme.palette.grey[200],
                    },
                    borderRadius: '8px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    borderWidth: '2px',
                    width: '100%',
                    height: '100%',
                    minHeight: '48px',
                    opacity: historyIndex <= 0 ? 0.5 : 1,
                    '&:disabled': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? theme.palette.grey[900] 
                        : theme.palette.grey[100],
                      borderColor: theme.palette.mode === 'dark' 
                        ? theme.palette.grey[700] 
                        : theme.palette.grey[300],
                    },
                  }}
                >
                  Annuler
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Sauvegarder la partie">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleSaveGame}
                size="large"
                sx={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? `${theme.palette.primary.main}33`
                      : theme.palette.primary.light + '15',
                    borderColor: theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.primary.main,
                  },
                  borderRadius: '8px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  borderWidth: '1px',
                  borderColor: theme.palette.mode === 'dark'
                    ? theme.palette.primary.main + '80'
                    : theme.palette.primary.main,
                  color: theme.palette.mode === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                  width: '100%',
                  height: '100%',
                  minHeight: '48px',
                  backgroundColor: 'transparent',
                  backdropFilter: 'blur(8px)',
                }}
              >
                Sauvegarder
              </Button>
            </Tooltip>
          </Box>
        </Box>

        <Dialog 
          open={showRules} 
          onClose={() => setShowRules(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Règles du Binero</DialogTitle>
          <DialogContent>
            <BineroRules />
          </DialogContent>
        </Dialog>

        <Dialog 
          open={showSettings} 
          onClose={() => setShowSettings(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Paramètres et parties sauvegardées</DialogTitle>
          <DialogContent>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Parties sauvegardées</Typography>
            {Object.keys(savedGames).length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Aucune partie sauvegardée.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Object.entries(savedGames).map(([key, game]) => (
                  <Paper 
                    key={key} 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      border: `1px solid ${theme.palette.divider}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)} ({game.gridSize.rows}×{game.gridSize.cols})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Score: {game.score} | Progression: {Math.round((game.grid.flat().filter(cell => cell !== null).length / (game.gridSize.rows * game.gridSize.cols)) * 100)}%
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleLoadGame(game)}
                    >
                      Charger
                    </Button>
                  </Paper>
                ))}
              </Box>
            )}
          </DialogContent>
        </Dialog>

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
      </Box>
    </Container>
  );
} 