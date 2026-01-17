import { Box, Tooltip } from '@mui/material';
import { Airlines } from '@mui/icons-material';

interface AirlineLogoProps {
  code: string;
  name?: string;
  size?: 'small' | 'medium' | 'large';
  showFallback?: boolean;
}

const SIZES = {
  small: 20,
  medium: 28,
  large: 40,
};

const AirlineLogo = ({ code, name, size = 'medium', showFallback = true }: AirlineLogoProps) => {
  const dimension = SIZES[size];
  const logoUrl = `https://images.kiwi.com/airlines/64/${code}.png`;
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const fallback = target.nextElementSibling;
    if (fallback) {
      (fallback as HTMLElement).style.display = 'flex';
    }
  };

  return (
    <Tooltip title={name || code} arrow>
      <Box
        sx={{
          width: dimension,
          height: dimension,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={logoUrl}
          alt={`${name || code} logo`}
          onError={handleError}
          sx={{
            width: dimension,
            height: dimension,
            objectFit: 'contain',
          }}
        />
        {showFallback && (
          <Box
            sx={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: dimension,
              height: dimension,
              bgcolor: 'action.hover',
              borderRadius: 1,
            }}
          >
            <Airlines sx={{ fontSize: dimension * 0.6, color: 'text.secondary' }} />
          </Box>
        )}
      </Box>
    </Tooltip>
  );
};

export default AirlineLogo;
