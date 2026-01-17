import { useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './theme';
import { useThemeStore } from './store/themeStore';
import FlightSearchPage from './features/flight/FlightSearchPage';

const App = () => {
  const { mode, getEffectiveMode } = useThemeStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (mode === 'system') {
        useThemeStore.setState({ mode: 'system' });
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const effectiveMode = getEffectiveMode();
  const theme = useMemo(
    () => createAppTheme(effectiveMode),
    [effectiveMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FlightSearchPage />
    </ThemeProvider>
  );
};

export default App;
