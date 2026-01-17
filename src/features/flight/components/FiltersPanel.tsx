import { useMemo } from 'react';
import {
  Box,
  Typography,
  Slider,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Button,
  Chip,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  FilterList,
  RestartAlt,
  SortRounded,
  AttachMoney,
  AirplaneTicket,
  Timer,
  Airlines,
} from '@mui/icons-material';
import { useFilterStore } from '../../../store/filterStore';
import type { Flight, SortOption } from '../types';
import { getStopsDistribution, getUniqueAirlines } from '../utils/applyFilters';

interface FiltersPanelProps {
  flights: Flight[];
  filteredCount: number;
}

const STOP_OPTIONS = [
  { value: 0, label: 'Nonstop' },
  { value: 1, label: '1 stop' },
  { value: 2, label: '2+ stops' },
];

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'price', label: 'Price', icon: <AttachMoney fontSize="small" /> },
  { value: 'duration', label: 'Duration', icon: <Timer fontSize="small" /> },
  { value: 'departure', label: 'Departure', icon: <AirplaneTicket fontSize="small" /> },
];

const FiltersPanel = ({ flights, filteredCount }: FiltersPanelProps) => {
  const theme = useTheme();

  const {
    stops,
    airlines,
    priceRange,
    maxPrice,
    departureTimeRange,
    sortBy,
    toggleStop,
    toggleAirline,
    setPriceRange,
    setDepartureTimeRange,
    setSortBy,
    resetFilters,
  } = useFilterStore();

  const availableAirlines = useMemo(() => getUniqueAirlines(flights), [flights]);
  const stopsDistribution = useMemo(() => getStopsDistribution(flights), [flights]);

  const hasActiveFilters = useMemo(() => {
    return (
      stops.length < 3 ||
      airlines.length > 0 ||
      priceRange[0] > 0 ||
      priceRange[1] < maxPrice ||
      departureTimeRange[0] > 0 ||
      departureTimeRange[1] < 24
    );
  }, [stops, airlines, priceRange, maxPrice, departureTimeRange]);

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  const handleTimeChange = (_: Event, newValue: number | number[]) => {
    setDepartureTimeRange(newValue as [number, number]);
  };

  const formatTime = (hour: number): string => {
    if (hour === 0 || hour === 24) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  if (flights.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
      role="complementary"
      aria-label="Flight filters"
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          {hasActiveFilters && (
            <Chip
              label={`${filteredCount} results`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        {hasActiveFilters && (
          <Tooltip title="Reset all filters">
            <Button
              startIcon={<RestartAlt />}
              size="small"
              onClick={resetFilters}
              sx={{ textTransform: 'none' }}
              aria-label="Reset all filters"
            >
              Reset
            </Button>
          </Tooltip>
        )}
      </Box>

      {/* Sort By */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <SortRounded fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={600}>
            Sort by
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={sortBy}
          exclusive
          onChange={(_, value) => value && setSortBy(value)}
          size="small"
          fullWidth
          aria-label="Sort flights by"
        >
          {SORT_OPTIONS.map((option) => (
            <ToggleButton
              key={option.value}
              value={option.value}
              aria-label={`Sort by ${option.label}`}
              sx={{
                py: 1,
                textTransform: 'none',
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                  },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {option.icon}
                {option.label}
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Stops Filter */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <AirplaneTicket fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={600}>
            Stops
          </Typography>
        </Box>
        <FormGroup>
          {STOP_OPTIONS.map((option) => {
            const count = stopsDistribution[option.value] || 0;
            return (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={stops.includes(option.value)}
                    onChange={() => toggleStop(option.value)}
                    size="small"
                    disabled={count === 0}
                    aria-label={`${option.label} (${count} flights)`}
                  />
                }
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      pr: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={count === 0 ? 'text.disabled' : 'text.primary'}
                    >
                      {option.label}
                    </Typography>
                    <Chip
                      label={count}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        opacity: count === 0 ? 0.5 : 1,
                      }}
                    />
                  </Box>
                }
                sx={{
                  width: '100%',
                  ml: 0,
                  '& .MuiFormControlLabel-label': { width: '100%' },
                }}
              />
            );
          })}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <AttachMoney fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={600}>
            Price Range
          </Typography>
        </Box>
        <Box sx={{ px: 1 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `$${value}`}
            min={0}
            max={maxPrice}
            step={10}
            aria-label="Price range"
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 0.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              ${priceRange[0]}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ${priceRange[1]}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Departure Time */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Timer fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={600}>
            Departure Time
          </Typography>
        </Box>
        <Box sx={{ px: 1 }}>
          <Slider
            value={departureTimeRange}
            onChange={handleTimeChange}
            valueLabelDisplay="auto"
            valueLabelFormat={formatTime}
            min={0}
            max={24}
            step={1}
            marks={[
              { value: 0, label: '12AM' },
              { value: 12, label: '12PM' },
              { value: 24, label: '12AM' },
            ]}
            aria-label="Departure time range"
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Airlines Filter */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Airlines fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={600}>
            Airlines
          </Typography>
          {airlines.length > 0 && (
            <Chip
              label={`${airlines.length} selected`}
              size="small"
              color="primary"
              variant="outlined"
              onDelete={() => useFilterStore.getState().setAirlines([])}
            />
          )}
        </Box>
        <FormGroup 
          sx={{ 
            flexDirection: 'column', 
            flexWrap: 'nowrap',
            '& .MuiFormControlLabel-root': {
              width: '100%',
            }
          }}
        >
          {availableAirlines.map((airline) => {
            const count = flights.filter((f) =>
              f.airlines.includes(airline)
            ).length;
            return (
              <FormControlLabel
                key={airline}
                control={
                  <Checkbox
                    checked={airlines.includes(airline)}
                    onChange={() => toggleAirline(airline)}
                    size="small"
                    aria-label={`${airline} (${count} flights)`}
                  />
                }
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      pr: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {airline}
                    </Typography>
                    <Chip
                      label={count}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem', flexShrink: 0 }}
                    />
                  </Box>
                }
                sx={{
                  width: '100%',
                  ml: 0,
                  '& .MuiFormControlLabel-label': { width: '100%' },
                }}
              />
            );
          })}
        </FormGroup>
      </Box>
    </Paper>
  );
};

export default FiltersPanel;
