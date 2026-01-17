import { Box, Typography, Button } from '@mui/material';
import type { SvgIconProps } from '@mui/material';

interface EmptyStateProps {
  icon: React.ReactElement<SvgIconProps>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      px: 2,
      textAlign: 'center',
    }}
    role="status"
    aria-label={title}
  >
    <Box
      sx={{
        '& .MuiSvgIcon-root': {
          fontSize: 64,
          color: 'text.disabled',
          mb: 2,
        },
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
      {description}
    </Typography>
    {action && (
      <Button
        variant="outlined"
        onClick={action.onClick}
        sx={{ mt: 3, textTransform: 'none' }}
        aria-label={action.label}
      >
        {action.label}
      </Button>
    )}
  </Box>
);

export default EmptyState;
