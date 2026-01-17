import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  IconButton,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  CircularProgress,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  SwapHoriz,
  Search,
  Person,
  CalendarMonth,
} from '@mui/icons-material';
import { useSearchStore } from '../../../store/searchStore';
import { searchAirports } from '../../../api/amadeus';
import type { Airport, TravelClass } from '../types';

interface SearchBarProps {
  onSearch: () => void;
  isLoading?: boolean;
}

const TRAVEL_CLASSES: { value: TravelClass; label: string }[] = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FIRST', label: 'First Class' },
];

const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    params,
    setOrigin,
    setDestination,
    setDepartureDate,
    setReturnDate,
    setAdults,
    setTravelClass,
    swapLocations,
  } = useSearchStore();

  const [originOptions, setOriginOptions] = useState<Airport[]>([]);
  const [destOptions, setDestOptions] = useState<Airport[]>([]);
  const [originLoading, setOriginLoading] = useState(false);
  const [destLoading, setDestLoading] = useState(false);
  const [originInputValue, setOriginInputValue] = useState(
    params.originName || ''
  );
  const [destInputValue, setDestInputValue] = useState(
    params.destinationName || ''
  );

  useEffect(() => {
    setOriginInputValue(params.originName || '');
  }, [params.originName]);

  useEffect(() => {
    setDestInputValue(params.destinationName || '');
  }, [params.destinationName]);

  const handleOriginSearch = useCallback(async (value: string) => {
    if (value.length < 2) {
      setOriginOptions([]);
      return;
    }
    setOriginLoading(true);
    try {
      const airports = await searchAirports(value);
      setOriginOptions(airports);
    } catch {
      setOriginOptions([]);
    } finally {
      setOriginLoading(false);
    }
  }, []);

  const handleDestSearch = useCallback(async (value: string) => {
    if (value.length < 2) {
      setDestOptions([]);
      return;
    }
    setDestLoading(true);
    try {
      const airports = await searchAirports(value);
      setDestOptions(airports);
    } catch {
      setDestOptions([]);
    } finally {
      setDestLoading(false);
    }
  }, []);

  const handleSwap = () => {
    swapLocations();
    setOriginInputValue(params.destinationName);
    setDestInputValue(params.originName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (params.origin && params.destination && params.departureDate) {
      onSearch();
    }
  };

  const isValid = Boolean(
    params.origin && params.destination && params.departureDate
  );

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={2}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        backgroundColor: 'background.paper',
      }}
      role="search"
      aria-label="Flight search form"
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr auto 1fr',
            lg: '1fr auto 1fr 150px 150px 120px 80px auto',
          },
          gap: 2,
          alignItems: 'center',
        }}
      >
        {/* Origin Airport */}
        <Autocomplete
          freeSolo
          options={originOptions}
          getOptionLabel={(option) =>
            typeof option === 'string'
              ? option
              : `${option.cityName} (${option.iataCode})`
          }
          inputValue={originInputValue}
          onInputChange={(_, value) => {
            setOriginInputValue(value);
            handleOriginSearch(value);
          }}
          onChange={(_, value) => {
            if (value && typeof value !== 'string') {
              setOrigin(value.iataCode, `${value.cityName} (${value.iataCode})`);
              setOriginInputValue(`${value.cityName} (${value.iataCode})`);
            }
          }}
          loading={originLoading}
          renderInput={(inputParams) => (
            <TextField
              {...inputParams}
              label="From"
              placeholder="City or airport"
              required
              InputProps={{
                ...inputParams.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightTakeoff color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {originLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {inputParams.InputProps.endAdornment}
                  </>
                ),
              }}
              aria-label="Origin airport"
            />
          )}
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            return (
              <li key={key} {...rest}>
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {option.cityName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.iataCode} • {option.name}
                  </Typography>
                </Box>
              </li>
            );
          }}
        />

        {/* Swap Button */}
        <IconButton
          onClick={handleSwap}
          sx={{
            bgcolor: 'background.default',
            border: 1,
            borderColor: 'divider',
            '&:hover': { bgcolor: 'action.hover' },
            display: { xs: 'none', md: 'flex' },
          }}
          aria-label="Swap origin and destination"
          tabIndex={0}
        >
          <SwapHoriz />
        </IconButton>

        {/* Destination Airport */}
        <Autocomplete
          freeSolo
          options={destOptions}
          getOptionLabel={(option) =>
            typeof option === 'string'
              ? option
              : `${option.cityName} (${option.iataCode})`
          }
          inputValue={destInputValue}
          onInputChange={(_, value) => {
            setDestInputValue(value);
            handleDestSearch(value);
          }}
          onChange={(_, value) => {
            if (value && typeof value !== 'string') {
              setDestination(
                value.iataCode,
                `${value.cityName} (${value.iataCode})`
              );
              setDestInputValue(`${value.cityName} (${value.iataCode})`);
            }
          }}
          loading={destLoading}
          renderInput={(inputParams) => (
            <TextField
              {...inputParams}
              label="To"
              placeholder="City or airport"
              required
              InputProps={{
                ...inputParams.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightLand color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {destLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {inputParams.InputProps.endAdornment}
                  </>
                ),
              }}
              aria-label="Destination airport"
            />
          )}
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            return (
              <li key={key} {...rest}>
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {option.cityName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.iataCode} • {option.name}
                  </Typography>
                </Box>
              </li>
            );
          }}
        />

        {/* Departure Date */}
        <TextField
          type="date"
          label="Departure"
          value={params.departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonth color="action" />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
          aria-label="Departure date"
        />

        {/* Return Date */}
        <TextField
          type="date"
          label="Return"
          value={params.returnDate || ''}
          onChange={(e) => setReturnDate(e.target.value || null)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonth color="action" />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
          aria-label="Return date"
        />

        {/* Passengers */}
        <FormControl size="medium">
          <InputLabel id="passengers-label">Passengers</InputLabel>
          <Select
            labelId="passengers-label"
            value={params.adults}
            label="Passengers"
            onChange={(e) => setAdults(Number(e.target.value))}
            startAdornment={
              <InputAdornment position="start">
                <Person color="action" />
              </InputAdornment>
            }
            aria-label="Number of passengers"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Travel Class (hidden on mobile) */}
        {!isMobile && (
          <FormControl size="medium" sx={{ minWidth: 120 }}>
            <InputLabel id="class-label">Class</InputLabel>
            <Select
              labelId="class-label"
              value={params.travelClass}
              label="Class"
              onChange={(e) => setTravelClass(e.target.value as TravelClass)}
              aria-label="Travel class"
            >
              {TRAVEL_CLASSES.map((tc) => (
                <MenuItem key={tc.value} value={tc.value}>
                  {tc.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Search Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isValid || isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : <Search />
          }
          sx={{
            height: 56,
            minWidth: { xs: '100%', md: 120 },
            gridColumn: { xs: '1', lg: 'auto' },
          }}
          aria-label="Search flights"
          tabIndex={0}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </Box>

      {/* Mobile: Show current selections as chips */}
      {isMobile && (params.origin || params.destination) && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          {params.originName && (
            <Chip
              icon={<FlightTakeoff fontSize="small" />}
              label={params.originName}
              size="small"
              variant="outlined"
            />
          )}
          {params.destinationName && (
            <Chip
              icon={<FlightLand fontSize="small" />}
              label={params.destinationName}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Paper>
  );
};

export default SearchBar;
