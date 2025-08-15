import { createTheme } from '@mui/material/styles';

// Modern minimalist dark theme: neutral palette, no gradients, subtle borders/shadows
const primary = {
  main: '#3b82f6', // blue-500 (muted)
  light: '#60a5fa',
  dark: '#1d4ed8',
  contrastText: '#ffffff',
};

const secondary = {
  main: '#94a3b8', // slate-400 (neutral accent)
  light: '#cbd5e1',
  dark: '#64748b',
  contrastText: '#0b1220',
};

const background = {
  default: '#0d1117', // minimalist dark base
  paper: '#11151b', // slightly elevated surface
};

const text = {
  primary: '#e5e7eb', // gray-200
  secondary: '#9ca3af', // gray-400
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary,
    secondary,
    background,
    text,
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
    h6: { fontWeight: 600 },
    button: { fontWeight: 500 },
  },
  // Minimal shadows
  shadows: [
    'none',
    '0 1px 1px rgba(0,0,0,0.15)',
    '0 2px 4px rgba(0,0,0,0.18)',
    '0 4px 8px rgba(0,0,0,0.18)',
    ...Array(21).fill('0 4px 8px rgba(0,0,0,0.18)'),
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--border-color': 'rgba(148,163,184,0.18)',
          '--border-color-hover': 'rgba(148,163,184,0.3)',
        },
        body: {
          backgroundColor: background.default,
          backgroundImage: 'none',
        },
        '*:focus-visible': {
          outline: `2px solid ${primary.light}`,
          outlineOffset: '2px',
          borderRadius: '4px',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*': { animation: 'none !important', transition: 'none !important' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: background.paper,
          boxShadow: 'none',
          borderBottom: '1px solid var(--border-color)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'border-color 160ms ease, box-shadow 160ms ease',
          backgroundColor: background.paper,
          backgroundImage: 'none',
          border: '1px solid var(--border-color)',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            borderColor: 'var(--border-color-hover)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#0f1319',
          border: '1px solid var(--border-color)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#111827',
          border: '1px solid var(--border-color)',
        },
      },
    },
  },
});

export default theme;