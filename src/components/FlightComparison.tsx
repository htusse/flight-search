import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Paper,
  Chip,
  Divider,
  useTheme,
  alpha,
  useMediaQuery,
} from '@mui/material';
import {
  Close,
  FlightTakeoff,
  FlightLand,
  AccessTime,
  Airlines,
  AttachMoney,
  CheckCircle,
  Co2,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import type { Flight } from '../features/flight/types';
import { formatDuration, estimateCO2, formatStops } from '../api/amadeus';

interface FlightComparisonProps {
  flights: Flight[];
  open: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}

interface ComparisonRow {
  label: string;
  icon: React.ReactNode;
  getValue: (flight: Flight) => React.ReactNode;
  highlight?: 'lowest' | 'highest' | 'shortest';
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: 'Price',
    icon: <AttachMoney fontSize="small" />,
    getValue: (f) => `$${f.price.toLocaleString()}`,
    highlight: 'lowest',
  },
  {
    label: 'Duration',
    icon: <AccessTime fontSize="small" />,
    getValue: (f) => formatDuration(f.durationMinutes),
    highlight: 'shortest',
  },
  {
    label: 'Stops',
    icon: <FlightTakeoff fontSize="small" />,
    getValue: (f) => formatStops(f.stops),
    highlight: 'lowest',
  },
  {
    label: 'Airlines',
    icon: <Airlines fontSize="small" />,
    getValue: (f) => f.airlines.join(', '),
  },
  {
    label: 'Departure',
    icon: <FlightTakeoff fontSize="small" />,
    getValue: (f) => format(parseISO(f.departureTime), 'HH:mm'),
  },
  {
    label: 'Arrival',
    icon: <FlightLand fontSize="small" />,
    getValue: (f) => format(parseISO(f.arrivalTime), 'HH:mm'),
  },
  {
    label: 'CO₂ Estimate',
    icon: <Co2 fontSize="small" />,
    getValue: (f) => `~${estimateCO2(f.durationMinutes)} kg`,
  },
];

const FlightComparison = ({ flights, open, onClose, onRemove }: FlightComparisonProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getBestValue = (row: ComparisonRow): string | null => {
    if (!row.highlight || flights.length < 2) return null;
    
    const values = flights.map((f) => {
      if (row.highlight === 'lowest' && row.label === 'Price') return f.price;
      if (row.highlight === 'shortest' && row.label === 'Duration') return f.durationMinutes;
      if (row.highlight === 'lowest' && row.label === 'Stops') return f.stops;
      return null;
    });
    
    const validValues = values.filter((v): v is number => v !== null);
    if (validValues.length === 0) return null;
    
    const bestValue = Math.min(...validValues);
    const bestIndex = values.indexOf(bestValue);
    return flights[bestIndex]?.id || null;
  };

  if (flights.length === 0) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: { borderRadius: isMobile ? 0 : 3 },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Compare Flights
          </Typography>
          <Chip label={`${flights.length} selected`} size="small" color="primary" />
        </Box>
        <IconButton onClick={onClose} aria-label="Close comparison">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `150px repeat(${flights.length}, 1fr)`,
            gap: 2,
            mb: 2,
          }}
        >
          <Box />
          {flights.map((flight) => (
            <Paper
              key={flight.id}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                border: 1,
                borderColor: 'divider',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <IconButton
                size="small"
                onClick={() => onRemove(flight.id)}
                sx={{ position: 'absolute', top: 4, right: 4 }}
                aria-label="Remove from comparison"
              >
                <Close fontSize="small" />
              </IconButton>
              <Typography variant="subtitle2" fontWeight={600}>
                {flight.departureAirport} → {flight.arrivalAirport}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {flight.airlines.join(', ')}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Comparison Rows */}
        {COMPARISON_ROWS.map((row, index) => {
          const bestId = getBestValue(row);
          
          return (
            <Box key={row.label}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `150px repeat(${flights.length}, 1fr)`,
                  gap: 2,
                  py: 1.5,
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {row.icon}
                  <Typography variant="body2" color="text.secondary">
                    {row.label}
                  </Typography>
                </Box>
                {flights.map((flight) => {
                  const isBest = bestId === flight.id;
                  return (
                    <Box
                      key={flight.id}
                      sx={{
                        textAlign: 'center',
                        p: 1,
                        borderRadius: 1,
                        bgcolor: isBest ? alpha(theme.palette.success.main, 0.1) : 'transparent',
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={isBest ? 700 : 400}
                        color={isBest ? 'success.main' : 'text.primary'}
                      >
                        {row.getValue(flight)}
                        {isBest && (
                          <CheckCircle
                            fontSize="small"
                            sx={{ ml: 0.5, fontSize: 14, verticalAlign: 'middle' }}
                          />
                        )}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
              {index < COMPARISON_ROWS.length - 1 && <Divider />}
            </Box>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default FlightComparison;
