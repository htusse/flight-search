import { createTheme, alpha, type PaletteMode } from '@mui/material/styles';

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: 'rgb(0, 128, 128)',
      light: 'rgb(0, 128, 128)',
      dark: 'rgb(0, 128, 128)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'light' ? '#5f6368' : '#9aa0a6',
      light: '#80868b',
      dark: '#3c4043',
    },
    background: {
      default: mode === 'light' ? '#f8f9fa' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    success: {
      main: '#34a853',
      light: '#81c995',
    },
    warning: {
      main: '#fbbc04',
    },
    error: {
      main: '#ea4335',
    },
    text: {
      primary: mode === 'light' ? '#202124' : '#e8eaed',
      secondary: mode === 'light' ? '#5f6368' : '#9aa0a6',
    },
    divider: mode === 'light' ? '#dadce0' : '#3c4043',
  },
});

export const createAppTheme = (mode: PaletteMode) => {
  const designTokens = getDesignTokens(mode);
  
  return createTheme({
    ...designTokens,
    typography: {
      fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2rem',
        fontWeight: 500,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '1.5rem',
        fontWeight: 500,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.8125rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            padding: '10px 24px',
            fontSize: '0.875rem',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            },
          },
          outlined: {
            borderColor: designTokens.palette.divider,
            '&:hover': {
              backgroundColor: alpha('rgb(0, 128, 128)', 0.04),
              borderColor: 'rgb(0, 128, 128)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light' 
              ? '0 1px 2px rgba(0,0,0,0.1)' 
              : '0 1px 3px rgba(0,0,0,0.4)',
            border: `1px solid ${designTokens.palette.divider}`,
            backgroundColor: designTokens.palette.background.paper,
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 4px 12px rgba(0,0,0,0.1)'
                : '0 4px 12px rgba(0,0,0,0.5)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: designTokens.palette.background.paper,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            fontWeight: 500,
          },
          outlined: {
            borderColor: designTokens.palette.divider,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: mode === 'light'
              ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
              : '0 1px 3px rgba(0,0,0,0.4)',
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            color: 'rgb(0, 128, 128)',
          },
          thumb: {
            '&:hover, &.Mui-focusVisible': {
              boxShadow: `0px 0px 0px 8px ${alpha('rgb(0, 128, 128)', 0.16)}`,
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: designTokens.palette.text.secondary,
            '&.Mui-checked': {
              color: 'rgb(0, 128, 128)',
            },
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#e8eaed' : '#3c4043',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: designTokens.palette.background.paper,
          },
        },
      },
    },
  });
};
