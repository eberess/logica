import { useState, useEffect } from 'react';
import { GameProgress, CrosswordCell } from '@/types/crossword';

const STORAGE_KEY = 'crossword-progress';

export const useCrosswordProgress = (gridId: string) => {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Charger la progression sauvegardée
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      const allProgress: GameProgress[] = JSON.parse(savedProgress);
      const currentProgress = allProgress.find(p => p.gridId === gridId);
      if (currentProgress) {
        setProgress(currentProgress);
        setTimeSpent(currentProgress.timeSpent);
        setHintsUsed(currentProgress.hintsUsed);
      }
    }
    setStartTime(new Date());
  }, [gridId]);

  // Sauvegarder la progression
  const saveProgress = (cells: CrosswordCell[][], completed = false) => {
    const currentTime = new Date();
    const sessionTime = startTime ? Math.floor((currentTime.getTime() - startTime.getTime()) / 1000) : 0;
    const totalTime = timeSpent + sessionTime;

    const newProgress: GameProgress = {
      gridId,
      cells: cells.map(row => row.map(cell => ({ ...cell }))), // Deep copy
      timeSpent: totalTime,
      hintsUsed,
      completedAt: completed ? currentTime : undefined,
    };

    // Récupérer toutes les progressions
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    let allProgress: GameProgress[] = savedProgress ? JSON.parse(savedProgress) : [];
    
    // Mettre à jour ou ajouter la progression actuelle
    const existingIndex = allProgress.findIndex(p => p.gridId === gridId);
    if (existingIndex >= 0) {
      allProgress[existingIndex] = newProgress;
    } else {
      allProgress.push(newProgress);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    setProgress(newProgress);
    setTimeSpent(totalTime);
    setStartTime(currentTime);
  };

  // Utiliser un indice
  const useHint = () => {
    setHintsUsed(prev => prev + 1);
  };

  // Réinitialiser la progression
  const resetProgress = () => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      let allProgress: GameProgress[] = JSON.parse(savedProgress);
      allProgress = allProgress.filter(p => p.gridId !== gridId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    }
    setProgress(null);
    setTimeSpent(0);
    setHintsUsed(0);
    setStartTime(new Date());
  };

  // Obtenir toutes les progressions
  const getAllProgress = (): GameProgress[] => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    return savedProgress ? JSON.parse(savedProgress) : [];
  };

  // Formater le temps
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return {
    progress,
    timeSpent,
    hintsUsed,
    saveProgress,
    useHint,
    resetProgress,
    getAllProgress,
    formatTime,
  };
};