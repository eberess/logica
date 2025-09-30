'use client';

import {
    Box, Container, Typography, Paper, TextField, Button, Card, CardContent,
    Select, MenuItem, FormControl, InputLabel, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, List, ListItem, ListItemText, IconButton, Tooltip, Alert, Snackbar,
    ButtonGroup, Divider, LinearProgress, useTheme
} from '@mui/material';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Lightbulb, Refresh, CheckCircle, Timer as TimerIcon, EmojiEvents, Help, Settings, Undo } from '@mui/icons-material';
import { Timer } from '@/components/games/sudoku/Timer';
import { CrosswordGrid, CrosswordCell } from '@/types/crossword';
import { crosswordGrids, getRandomGrid } from '@/data/crosswordGrids';
import { useCrosswordProgress } from '@/hooks/useCrosswordProgress';

export default function MotsCroises() {
    const theme = useTheme();
    const [selectedGrid, setSelectedGrid] = useState<CrosswordGrid | null>(null);
    const [grid, setGrid] = useState<CrosswordCell[][]>([]);
    const [showHintDialog, setShowHintDialog] = useState(false);
    const [showStatsDialog, setShowStatsDialog] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [message, setMessage] = useState<{ text: string; severity: 'success' | 'error' | 'info' }>({
        text: '',
        severity: 'info',
    });

    const {
        progress,
        timeSpent,
        hintsUsed,
        saveProgress,
        useHint,
        resetProgress,
        getAllProgress,
        formatTime,
    } = useCrosswordProgress(selectedGrid?.id || '');

    // Timer
    useEffect(() => {
        if (selectedGrid && !gameCompleted) {
            const interval = setInterval(() => {
                setCurrentTime(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [selectedGrid, gameCompleted]);

    // Progression calculation
    const gridCompletion = useMemo(() => {
        if (!grid.length) return 0;
        const totalCells = grid.flat().filter(cell => !cell.isBlack).length;
        const filledCells = grid.flat().filter(cell => !cell.isBlack && cell.userInput).length;
        return totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;
    }, [grid]);

    // Load grid function
    const loadGrid = useCallback((gridData: CrosswordGrid) => {
        setSelectedGrid(gridData);
        setGameCompleted(false);
        setCurrentTime(0);

        if (progress && progress.gridId === gridData.id) {
            setGrid(progress.cells);
        } else {
            const newGrid = gridData.cells.map(row =>
                row.map(cell => ({ ...cell, userInput: '' }))
            );
            setGrid(newGrid);
        }
    }, [progress]);

    // Load random grid on startup
    useEffect(() => {
        if (!selectedGrid) {
            loadGrid(getRandomGrid('facile'));
        }
    }, [selectedGrid, loadGrid]);

    const handleCellChange = useCallback((row: number, col: number, value: string) => {
        if (value.length <= 1) {
            const newGrid = [...grid];
            newGrid[row][col].userInput = value.toUpperCase();
            setGrid(newGrid);

            if (selectedGrid) {
                saveProgress(newGrid);
            }
        }
    }, [grid, selectedGrid, saveProgress]);

    const checkSolution = useCallback(() => {
        if (!selectedGrid) return;

        let correct = true;
        let filledCells = 0;
        let totalCells = 0;

        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const cell = grid[row][col];
                if (!cell.isBlack) {
                    totalCells++;
                    if (cell.userInput) {
                        filledCells++;
                        if (cell.letter !== cell.userInput) {
                            correct = false;
                        }
                    } else {
                        correct = false;
                    }
                }
            }
        }

        if (correct && filledCells === totalCells) {
            setGameCompleted(true);
            saveProgress(grid, true);
            setMessage({
                text: `🎉 Félicitations ! Grille terminée en ${formatTime(timeSpent + currentTime)} avec ${hintsUsed} indices !`,
                severity: 'success'
            });
        } else {
            const percentage = Math.round((filledCells / totalCells) * 100);
            setMessage({
                text: `Progression: ${percentage}% - ${correct ? 'Continuez !' : 'Il y a des erreurs à corriger.'}`,
                severity: correct ? 'info' : 'error'
            });
        }
    }, [selectedGrid, grid, timeSpent, currentTime, hintsUsed, saveProgress, formatTime]);

    const getHint = useCallback(() => {
        if (!selectedGrid) return;

        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const cell = grid[row][col];
                if (!cell.isBlack && !cell.userInput) {
                    const newGrid = [...grid];
                    newGrid[row][col].userInput = cell.letter;
                    setGrid(newGrid);
                    useHint();
                    saveProgress(newGrid);
                    setMessage({ text: 'Indice utilisé !', severity: 'info' });
                    return;
                }
            }
        }
        setMessage({ text: 'Aucun indice disponible', severity: 'info' });
    }, [selectedGrid, grid, useHint, saveProgress]);

    const resetGrid = useCallback(() => {
        if (!selectedGrid) return;

        const newGrid = selectedGrid.cells.map(row =>
            row.map(cell => ({ ...cell, userInput: '' }))
        );
        setGrid(newGrid);
        setGameCompleted(false);
        setCurrentTime(0);
        resetProgress();
        setMessage({ text: 'Grille réinitialisée', severity: 'info' });
    }, [selectedGrid, resetProgress]);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'facile': return 'success';
            case 'moyen': return 'warning';
            case 'difficile': return 'error';
            default: return 'default';
        }
    };

    const handleNewGame = useCallback((difficulty: 'facile' | 'moyen' | 'difficile') => {
        const newGrid = getRandomGrid(difficulty);
        loadGrid(newGrid);
        setMessage({ text: `Nouvelle grille ${difficulty} chargée !`, severity: 'info' });
    }, [loadGrid]);

    if (!selectedGrid) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <Typography>Chargement...</Typography>
                </Box>
            </Container>
        );
    }
    return (
        <Container maxWidth="lg">
            <Box sx={{ py: { xs: 2, sm: 4 } }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: { xs: '100%', sm: 1000 },
                    mx: 'auto',
                    px: { xs: 1, sm: 0 },
                }}>
                    {/* Header */}
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
                            Mots Croisés
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Règles du jeu">
                                <IconButton onClick={() => setShowRules(!showRules)} color="primary">
                                    <Help />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Statistiques">
                                <IconButton onClick={() => setShowStatsDialog(!showStatsDialog)} color="primary">
                                    <EmojiEvents />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Nouvelle grille aléatoire">
                                <IconButton onClick={() => handleNewGame(selectedGrid.difficulty)} color="primary">
                                    <Refresh />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Stats Panel */}
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
                                <Timer isRunning={selectedGrid && !gameCompleted} onTimeUpdate={() => { }} />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Lightbulb color="primary" />
                                <Typography variant="h6">
                                    Indices: {hintsUsed}
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
                                    Grille: {selectedGrid.name}
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

                    {/* Difficulty Selector */}
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
                                    },
                                }}
                            >
                                <Button
                                    onClick={() => handleNewGame('facile')}
                                    variant={selectedGrid.difficulty === 'facile' ? 'contained' : 'outlined'}
                                    sx={{ borderRadius: '8px', fontWeight: 600, letterSpacing: '0.5px' }}
                                >
                                    Facile
                                </Button>
                                <Button
                                    onClick={() => handleNewGame('moyen')}
                                    variant={selectedGrid.difficulty === 'moyen' ? 'contained' : 'outlined'}
                                    sx={{ borderRadius: '8px', fontWeight: 600, letterSpacing: '0.5px' }}
                                >
                                    Moyen
                                </Button>
                                <Button
                                    onClick={() => handleNewGame('difficile')}
                                    variant={selectedGrid.difficulty === 'difficile' ? 'contained' : 'outlined'}
                                    sx={{ borderRadius: '8px', fontWeight: 600, letterSpacing: '0.5px' }}
                                >
                                    Difficile
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Box>
                    {/* Game Area */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', lg: 'row' },
                        gap: 4,
                        width: '100%',
                        justifyContent: 'center',
                    }}>
                        {/* Grid */}
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                    <Box sx={{ display: 'inline-block', border: '2px solid #333', borderRadius: '4px' }}>
                                        {grid.map((row, rowIndex) => (
                                            <Box key={rowIndex} sx={{ display: 'flex' }}>
                                                {row.map((cell, colIndex) => (
                                                    <Box
                                                        key={`${rowIndex}-${colIndex}`}
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            border: '1px solid #333',
                                                            position: 'relative',
                                                            backgroundColor: cell.isBlack ? '#333' :
                                                                (cell.userInput === cell.letter && cell.userInput ? '#e8f5e8' : '#fff'),
                                                        }}
                                                    >
                                                        {!cell.isBlack && (
                                                            <>
                                                                {cell.number && (
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            position: 'absolute',
                                                                            top: 1,
                                                                            left: 2,
                                                                            fontSize: '10px',
                                                                            fontWeight: 'bold',
                                                                            color: '#333',
                                                                            zIndex: 1,
                                                                        }}
                                                                    >
                                                                        {cell.number}
                                                                    </Typography>
                                                                )}
                                                                <TextField
                                                                    value={cell.userInput}
                                                                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                                                    variant="standard"
                                                                    inputProps={{
                                                                        maxLength: 1,
                                                                        style: {
                                                                            textAlign: 'center',
                                                                            fontSize: '18px',
                                                                            fontWeight: 'bold',
                                                                            padding: '8px 0',
                                                                            border: 'none',
                                                                            color: '#000000',
                                                                        },
                                                                    }}
                                                                    sx={{
                                                                        '& .MuiInput-underline:before': { display: 'none' },
                                                                        '& .MuiInput-underline:after': { display: 'none' },
                                                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { display: 'none' },
                                                                        '& .MuiInputBase-input': {
                                                                            color: '#000000 !important',
                                                                        },
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </Box>
                                                ))}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>

                        {/* Clues */}
                        <Box sx={{ flex: '0 0 300px', minWidth: '300px' }}>
                            <Card sx={{ borderRadius: '12px' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Typography variant="h6">
                                            Définitions
                                        </Typography>
                                        <Chip
                                            label={selectedGrid.difficulty}
                                            color={getDifficultyColor(selectedGrid.difficulty) as any}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                                        {selectedGrid.name}
                                    </Typography>
                                    {selectedGrid.clues.map((clue) => (
                                        <Box key={`${clue.number}-${clue.direction}`} sx={{ mb: 2 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {clue.number}. {clue.direction === 'horizontal' ? 'Horizontal' : 'Vertical'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {clue.clue} ({clue.length} lettres)
                                            </Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
                        gap: 2,
                        width: '100%',
                        mt: 4,
                    }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={checkSolution}
                            startIcon={<CheckCircle />}
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
                            }}
                        >
                            Vérifier
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={getHint}
                            startIcon={<Lightbulb />}
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
                                borderWidth: '2px',
                            }}
                        >
                            Indice
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={resetGrid}
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
                                borderWidth: '2px',
                            }}
                        >
                            Recommencer
                        </Button>
                        <FormControl size="small" sx={{ gridColumn: { xs: 'span 2', md: 'span 2' } }}>
                            <InputLabel>Changer de grille</InputLabel>
                            <Select
                                value={selectedGrid.id}
                                label="Changer de grille"
                                onChange={(e) => {
                                    const grid = crosswordGrids.find(g => g.id === e.target.value);
                                    if (grid) loadGrid(grid);
                                }}
                                sx={{
                                    borderRadius: '8px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderWidth: '2px',
                                    },
                                }}
                            >
                                {crosswordGrids.map((grid) => (
                                    <MenuItem key={grid.id} value={grid.id}>
                                        {grid.name} ({grid.difficulty})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Completion Alert */}
                    {gameCompleted && (
                        <Alert
                            severity="success"
                            sx={{
                                mt: 3,
                                borderRadius: '12px',
                                '& .MuiAlert-message': {
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                }
                            }}
                        >
                            🎉 Félicitations ! Grille terminée en {formatTime(timeSpent + currentTime)} avec {hintsUsed} indices !
                        </Alert>
                    )}
                </Box>
            </Box>
            {/* Rules Dialog */}
            <Dialog open={showRules} onClose={() => setShowRules(false)} maxWidth="sm" fullWidth>
                <DialogTitle>📝 Règles des Mots Croisés</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" paragraph>
                        <strong>Objectif :</strong> Remplir toutes les cases blanches de la grille avec les bonnes lettres.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Comment jouer :</strong>
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                        <Typography component="li" variant="body2" paragraph>
                            Lisez les définitions dans le panneau de droite
                        </Typography>
                        <Typography component="li" variant="body2" paragraph>
                            Cliquez sur une case blanche et tapez une lettre
                        </Typography>
                        <Typography component="li" variant="body2" paragraph>
                            Les numéros indiquent le début d'un mot
                        </Typography>
                        <Typography component="li" variant="body2" paragraph>
                            Utilisez les indices si vous êtes bloqué
                        </Typography>
                        <Typography component="li" variant="body2" paragraph>
                            Vérifiez votre solution quand vous pensez avoir terminé
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        💡 Astuce : Les cases correctes deviennent vertes !
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowRules(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>

            {/* Statistics Dialog */}
            <Dialog open={showStatsDialog} onClose={() => setShowStatsDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>📊 Vos Statistiques</DialogTitle>
                <DialogContent>
                    {getAllProgress().length === 0 ? (
                        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                            Aucune statistique disponible. Commencez à jouer pour voir vos progrès !
                        </Typography>
                    ) : (
                        <List>
                            {getAllProgress().map((prog) => {
                                const gridInfo = crosswordGrids.find(g => g.id === prog.gridId);
                                return (
                                    <ListItem key={prog.gridId} sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {gridInfo?.name || prog.gridId}
                                                    </Typography>
                                                    <Chip
                                                        label={gridInfo?.difficulty}
                                                        color={getDifficultyColor(gridInfo?.difficulty || '') as any}
                                                        size="small"
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2">
                                                        ⏱️ Temps: {formatTime(prog.timeSpent)} | 💡 Indices: {prog.hintsUsed}
                                                    </Typography>
                                                    {prog.completedAt && (
                                                        <Typography variant="body2" color="success.main">
                                                            ✅ Terminé le {new Date(prog.completedAt).toLocaleDateString('fr-FR')}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowStatsDialog(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for messages */}
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