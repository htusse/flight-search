import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  History,
  FlightTakeoff,
  Close,
  CalendarMonth,
  Person,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useSearchStore } from '../store/searchStore';
import {
  getRecentSearches,
  removeRecentSearch,
  clearRecentSearches,
  type RecentSearch,
} from '../utils/recentSearches';

const RecentSearches = ({ onSelect }: { onSelect?: () => void }) => {
  const theme = useTheme();
  const [searches, setSearches] = useState<RecentSearch[]>(getRecentSearches);
  const { setOrigin, setDestination, setDepartureDate, setReturnDate, setAdults, setTravelClass } = useSearchStore();

  const handleSelect = (search: RecentSearch) => {
    const { params } = search;
    setOrigin(params.origin, params.originName);
    setDestination(params.destination, params.destinationName);
    setDepartureDate(params.departureDate);
    setReturnDate(params.returnDate);
    setAdults(params.adults);
    setTravelClass(params.travelClass);
    onSelect?.();
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeRecentSearch(id);
    setSearches(updated);
  };

  const handleClearAll = () => {
    clearRecentSearches();
    setSearches([]);
  };

  if (searches.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        bgcolor: alpha(theme.palette.background.paper, 0.8),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <History fontSize="small" color="primary" />
          <Typography variant="subtitle2" fontWeight={600}>
            Recent Searches
          </Typography>
        </Box>
        <Chip
          label="Clear all"
          size="small"
          onClick={handleClearAll}
          variant="outlined"
          sx={{ fontSize: '0.7rem', height: 24 }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {searches.map((search) => (
          <Box
            key={search.id}
            onClick={() => handleSelect(search)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: 'background.default',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                '& .remove-btn': { opacity: 1 },
              },
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelect(search)}
            aria-label={`Search from ${search.params.originName} to ${search.params.destinationName}`}
          >
            <FlightTakeoff fontSize="small" color="action" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={500} noWrap>
                {search.params.originName || search.params.origin} → {search.params.destinationName || search.params.destination}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarMonth sx={{ fontSize: 12 }} color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {format(parseISO(search.params.departureDate), 'MMM d')}
                    {search.params.returnDate && ` - ${format(parseISO(search.params.returnDate), 'MMM d')}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Person sx={{ fontSize: 12 }} color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {search.params.adults}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Tooltip title="Remove">
              <IconButton
                size="small"
                onClick={(e) => handleRemove(search.id, e)}
                className="remove-btn"
                sx={{ opacity: 0, transition: 'opacity 0.2s' }}
                aria-label="Remove search"
              >
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default RecentSearches;
