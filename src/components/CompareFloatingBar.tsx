import { Box, Chip, Button, Paper, Typography, useTheme, alpha, Zoom } from '@mui/material';
import { Close, CompareArrows } from '@mui/icons-material';
import type { Flight } from '../features/flight/types';

interface CompareFloatingBarProps {
  selectedFlights: Flight[];
  onRemove: (id: string) => void;
  onCompare: () => void;
  onClear: () => void;
  maxFlights?: number;
}

const CompareFloatingBar = ({
  selectedFlights,
  onRemove,
  onCompare,
  onClear,
  maxFlights = 3,
}: CompareFloatingBarProps) => {
  const theme = useTheme();

  if (selectedFlights.length === 0) return null;

  return (
    <Zoom in={selectedFlights.length > 0}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: theme.zIndex.snackbar,
          borderRadius: 3,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          maxWidth: 'calc(100vw - 48px)',
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
        }}
        role="region"
        aria-label="Flight comparison selection"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompareArrows color="primary" />
          <Typography variant="subtitle2" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
            Compare
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {selectedFlights.map((flight) => (
            <Chip
              key={flight.id}
              label={`${flight.airlines[0]} $${flight.price}`}
              onDelete={() => onRemove(flight.id)}
              deleteIcon={<Close fontSize="small" />}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiChip-deleteIcon': {
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main' },
                },
              }}
            />
          ))}
          {selectedFlights.length < maxFlights && (
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
              Select {maxFlights - selectedFlights.length} more
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button
            size="small"
            onClick={onClear}
            sx={{ textTransform: 'none' }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={onCompare}
            disabled={selectedFlights.length < 2}
            startIcon={<CompareArrows />}
            sx={{ textTransform: 'none' }}
          >
            Compare ({selectedFlights.length})
          </Button>
        </Box>
      </Paper>
    </Zoom>
  );
};

export default CompareFloatingBar;
