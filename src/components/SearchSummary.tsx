import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  CalendarMonth,
  Person,
  SwapHoriz,
  AirlineSeatReclineNormal,
  Clear,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import type { SearchParams } from '../features/flight/types';

interface SearchSummaryProps {
  params: SearchParams;
  resultCount: number;
  onClear?: () => void;
}

const TRAVEL_CLASS_LABELS: Record<string, string> = {
  ECONOMY: 'Economy',
  PREMIUM_ECONOMY: 'Premium',
  BUSINESS: 'Business',
  FIRST: 'First',
};

const SearchSummary = ({ params, resultCount, onClear }: SearchSummaryProps) => {
  const theme = useTheme();

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'EEE, MMM d');
    } catch {
      return dateStr;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        bgcolor: alpha(theme.palette.primary.main, 0.02),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
        }}
      >
        {/* Route */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
            }}
          >
            <FlightTakeoff fontSize="small" />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              From
            </Typography>
            <Typography variant="subtitle2" fontWeight={600}>
              {params.originName || params.origin}
            </Typography>
          </Box>
          
          <SwapHoriz color="action" sx={{ mx: 0.5 }} />
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: 'success.main',
            }}
          >
            <FlightLand fontSize="small" />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              To
            </Typography>
            <Typography variant="subtitle2" fontWeight={600}>
              {params.destinationName || params.destination}
            </Typography>
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
        <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

        {/* Dates */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: 'info.main',
            }}
          >
            <CalendarMonth fontSize="small" />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {params.returnDate ? 'Round trip' : 'One way'}
            </Typography>
            <Typography variant="subtitle2" fontWeight={600}>
              {formatDate(params.departureDate)}
              {params.returnDate && ` - ${formatDate(params.returnDate)}`}
            </Typography>
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
        <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

        {/* Passengers & Class */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person fontSize="small" color="action" />
            <Typography variant="body2">
              {params.adults} {params.adults === 1 ? 'Adult' : 'Adults'}
            </Typography>
          </Box>
          <Chip
            icon={<AirlineSeatReclineNormal fontSize="small" />}
            label={TRAVEL_CLASS_LABELS[params.travelClass] || params.travelClass}
            size="small"
            variant="outlined"
          />
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
        <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

        {/* Results count & Clear */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            label={`${resultCount} flight${resultCount !== 1 ? 's' : ''}`}
            color="primary"
            size="small"
          />
          {onClear && (
            <Tooltip title="Clear search">
              <IconButton
                size="small"
                onClick={onClear}
                aria-label="Clear search results"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <Clear fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchSummary;
