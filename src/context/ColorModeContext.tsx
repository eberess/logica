'use client';

import { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider, PaletteMode } from '@mui/material';
import { getTheme } from '@/theme/theme';

interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
});

interface ColorModeProviderProps {
  children: ReactNode;
}

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  // Charger le thème depuis localStorage au montage
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as PaletteMode;
    if (savedMode) {
      setMode(savedMode);
    } else {
      // Détecter le thème système par défaut
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}; 