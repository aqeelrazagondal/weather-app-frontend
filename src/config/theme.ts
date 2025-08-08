import { createTheme } from '@mui/material/styles';

const primary = {
  main: '#2563eb', // indigo-600
  light: '#60a5fa',
  dark: '#1e40af',
  contrastText: '#ffffff',
};

const secondary = {
  main: '#06b6d4', // cyan-500
  light: '#67e8f9',
  dark: '#0e7490',
  contrastText: '#0b1220',
};

const background = {
  default: '#0b1220', // deep navy
  paper: '#0f172a', // slate-900-ish
};

const text = {
  primary: '#e2e8f0', // slate-200
  secondary: '#94a3b8', // slate-400
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
    borderRadius: 12,
  },
  typography: {
    fontFamily: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
    h6: { fontWeight: 700 },
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.2)',
    '0 4px 12px rgba(0,0,0,0.25)',
    '0 8px 24px rgba(0,0,0,0.35)',
    ...Array(21).fill('0 8px 24px rgba(0,0,0,0.35)'),
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--gradient-appbar': 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 50%, #7c3aed 100%)',
          '--card-hover': '0 10px 24px rgba(0,0,0,0.35)',
        },
        body: {
          background: 'radial-gradient(1200px 600px at 10% -10%, rgba(37,99,235,0.20), transparent), radial-gradient(1000px 500px at 90% 10%, rgba(14,165,233,0.20), transparent), #0b1220',
        },
        '*:focus-visible': {
          outline: '2px solid #60a5fa',
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
          background: 'var(--gradient-appbar)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
          border: '1px solid rgba(148,163,184,0.15)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'var(--card-hover)',
            borderColor: 'rgba(148,163,184,0.35)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
        },
        containedPrimary: {
          background:
            'linear-gradient(135deg, rgba(14,165,233,1) 0%, rgba(37,99,235,1) 60%)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#111827',
          border: '1px solid rgba(148,163,184,0.25)',
        },
      },
    },
  },
});

export default theme;