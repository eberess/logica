import { createTheme, PaletteMode } from '@mui/material';

export const getTheme = (mode: PaletteMode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#2C3E50' : '#3498DB',
        contrastText: '#fff',
      },
      secondary: {
        main: mode === 'light' ? '#E74C3C' : '#E74C3C',
      },
      background: {
        default: mode === 'light' ? '#F5F6FA' : '#1A1A2E',
        paper: mode === 'light' ? '#FFFFFF' : '#16213E',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#16213E',
            color: mode === 'light' ? '#2C3E50' : '#FFFFFF',
            boxShadow: 'none',
            borderBottom: `1px solid ${mode === 'light' ? '#E0E0E0' : '#2C3E50'}`,
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
  });
}; 