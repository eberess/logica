'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Typography } from '@mui/material';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (seconds: number) => void;
}

export const Timer = ({ isRunning, onTimeUpdate }: TimerProps) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastUpdateRef = useRef<number>(0);
  const isFirstRender = useRef(true);
  const secondsRef = useRef(0);

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const delta = Math.floor((now - lastUpdateRef.current) / 1000);
    if (delta > 0) {
      lastUpdateRef.current = now;
      secondsRef.current += delta;
      setSeconds(secondsRef.current);
      if (onTimeUpdate) {
        onTimeUpdate(secondsRef.current);
      }
    }
  }, [onTimeUpdate]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isRunning) {
      lastUpdateRef.current = Date.now();
      intervalRef.current = setInterval(updateTimer, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, updateTimer]);

  useEffect(() => {
    setSeconds(secondsRef.current);
  }, [secondsRef.current]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Typography variant="h6" component="div">
      {formatTime(seconds)}
    </Typography>
  );
}; 