import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useThemeStore } from '../store/themeStore';

const ThemeToggle = () => {
  const { setMode, getEffectiveMode } = useThemeStore();

  const handleToggle = () => {
    const effectiveMode = getEffectiveMode();
    setMode(effectiveMode === 'dark' ? 'light' : 'dark');
  };

  const effectiveMode = getEffectiveMode();

  return (
    <Tooltip title={`Switch to ${effectiveMode === 'dark' ? 'light' : 'dark'} mode`}>
      <IconButton
        onClick={handleToggle}
        sx={{
          color: 'inherit',
        }}
        aria-label={`Switch to ${effectiveMode === 'dark' ? 'light' : 'dark'} mode`}
      >
        {effectiveMode === 'dark' ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
