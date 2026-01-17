import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  useTheme,
  alpha,
  Collapse,
  IconButton,
  Checkbox,
  Tooltip,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  AccessTime,
  Airlines,
  SearchOff,
  Circle,
  LocalOffer,
  Bolt,
  ExpandMore,
  ExpandLess,
  Schedule,
  Luggage,
  Co2,
  CompareArrows,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import type { Flight, FlightSegment } from '../types';
import { formatDuration, estimateCO2, formatStops } from '../../../api/amadeus';
import {
  EmptyState as EmptyStateUI,
  ErrorState as ErrorStateUI,
  LoadingState,
} from '../../../components/ui';
import AirlineLogo from '../../../components/AirlineLogo';

interface ResultsListProps {
  flights: Flight[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRetry?: () => void;
  hasSearched: boolean;
  selectedForCompare?: string[];
  onToggleCompare?: (flight: Flight) => void;
  maxCompare?: number;
}

const SegmentDetails = ({ segments }: { segments: FlightSegment[] }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
        Flight Details
      </Typography>
      {segments.map((segment, index) => {
        const departureTime = parseISO(segment.departure.at);
        const arrivalTime = parseISO(segment.arrival.at);
        const nextSegment = segments[index + 1];
        
        let layoverMinutes = 0;
        if (nextSegment) {
          const nextDeparture = parseISO(nextSegment.departure.at);
          layoverMinutes = differenceInMinutes(nextDeparture, arrivalTime);
        }

        return (
          <Box key={index}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mb: 2,
                p: 2,
                bgcolor: alpha(theme.palette.background.default, 0.5),
                borderRadius: 1,
              }}
            >
              {/* Departure */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Depart
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  {format(departureTime, 'HH:mm')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(departureTime, 'EEE, MMM d')}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {segment.departure.iataCode}
                </Typography>
                {segment.departure.terminal && (
                  <Typography variant="caption" color="text.secondary">
                    Terminal {segment.departure.terminal}
                  </Typography>
                )}
              </Box>

              {/* Flight Info */}
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Airlines fontSize="small" color="action" />
                  <Typography variant="body2">
                    {segment.carrierCode} {segment.flightNumber}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                  <Schedule fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {segment.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm')}
                  </Typography>
                </Box>
              </Box>

              {/* Arrival */}
              <Box sx={{ flex: 1, textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">
                  Arrive
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  {format(arrivalTime, 'HH:mm')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(arrivalTime, 'EEE, MMM d')}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {segment.arrival.iataCode}
                </Typography>
                {segment.arrival.terminal && (
                  <Typography variant="caption" color="text.secondary">
                    Terminal {segment.arrival.terminal}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Layover info */}
            {nextSegment && layoverMinutes > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  py: 1.5,
                  mb: 2,
                  bgcolor: alpha(theme.palette.warning.main, 0.08),
                  borderRadius: 1,
                  border: `1px dashed ${alpha(theme.palette.warning.main, 0.3)}`,
                }}
              >
                <Luggage fontSize="small" sx={{ color: 'warning.main' }} />
                <Typography variant="body2" color="warning.dark">
                  {formatDuration(layoverMinutes)} layover in {segment.arrival.iataCode}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

const FlightCard = ({
  flight,
  isCheapest,
  isFastest,
  isSelected,
  onToggleCompare,
  canSelect,
}: {
  flight: Flight;
  isCheapest: boolean;
  isFastest: boolean;
  isSelected?: boolean;
  onToggleCompare?: (flight: Flight) => void;
  canSelect?: boolean;
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const departureTime = parseISO(flight.departureTime);
  const arrivalTime = parseISO(flight.arrivalTime);
  const co2Estimate = estimateCO2(flight.durationMinutes);

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const handleCompareClick = (e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    onToggleCompare?.(flight);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          position: 'relative',
          transition: 'all 0.2s ease',
          border: isSelected ? 2 : 1,
          borderColor: isSelected ? 'primary.main' : 'divider',
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        }}
        role="article"
        aria-label={`Flight from ${flight.departureAirport} to ${flight.arrivalAirport}, ${flight.airlines.join(', ')}, $${flight.price}`}
      >
      {/* Compare Checkbox */}
      {onToggleCompare && (
        <Tooltip title={isSelected ? 'Remove from comparison' : (canSelect ? 'Add to comparison' : 'Max 3 flights')}>
          <Checkbox
            checked={isSelected}
            onChange={handleCompareClick}
            disabled={!canSelect && !isSelected}
            icon={<CompareArrows />}
            checkedIcon={<CompareArrows />}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.1) : 'background.paper',
              borderRadius: 1,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
            }}
            aria-label={isSelected ? 'Remove from comparison' : 'Add to comparison'}
          />
        </Tooltip>
      )}

      {/* Badges */}
      {(isCheapest || isFastest) && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            gap: 0.5,
          }}
        >
          {isCheapest && (
            <Chip
              icon={<LocalOffer fontSize="small" />}
              label="Cheapest"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: 'success.main',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
          {isFastest && (
            <Chip
              icon={<Bolt fontSize="small" />}
              label="Fastest"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
      )}

      <CardContent sx={{ p: { xs: 2, md: 3 }, pl: onToggleCompare ? { xs: 6, md: 7 } : undefined }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr auto' },
            gap: { xs: 2, md: 3 },
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={handleToggleExpand}
          onKeyDown={(e) => e.key === 'Enter' && handleToggleExpand()}
          tabIndex={0}
          role="button"
          aria-expanded={expanded}
          aria-label="Show flight details"
        >
          {/* Flight Times & Route */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Departure */}
            <Box sx={{ textAlign: 'center', minWidth: 60 }}>
              <Typography variant="h6" fontWeight={600}>
                {format(departureTime, 'HH:mm')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flight.departureAirport}
              </Typography>
            </Box>

            {/* Route Visualization */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 100,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                {formatDuration(flight.durationMinutes)}
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <FlightTakeoff
                  fontSize="small"
                  sx={{ color: 'text.secondary' }}
                />
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    bgcolor: 'divider',
                    borderRadius: 1,
                    position: 'relative',
                  }}
                >
                  {flight.stops > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        gap: 0.5,
                      }}
                    >
                      {Array.from({ length: Math.min(flight.stops, 3) }).map(
                        (_, i) => (
                          <Circle
                            key={i}
                            sx={{
                              fontSize: 8,
                              color: 'warning.main',
                            }}
                          />
                        )
                      )}
                    </Box>
                  )}
                </Box>
                <FlightLand fontSize="small" sx={{ color: 'text.secondary' }} />
              </Box>
              <Chip
                label={formatStops(flight.stops)}
                size="small"
                variant="outlined"
                sx={{
                  mt: 0.5,
                  fontSize: '0.7rem',
                  height: 20,
                  bgcolor:
                    flight.stops === 0
                      ? alpha(theme.palette.success.main, 0.08)
                      : 'transparent',
                  borderColor:
                    flight.stops === 0 ? 'success.main' : 'divider',
                  color: flight.stops === 0 ? 'success.main' : 'text.secondary',
                }}
              />
            </Box>

            {/* Arrival */}
            <Box sx={{ textAlign: 'center', minWidth: 60 }}>
              <Typography variant="h6" fontWeight={600}>
                {format(arrivalTime, 'HH:mm')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flight.arrivalAirport}
              </Typography>
            </Box>
          </Box>

          {/* Divider for mobile */}
          <Divider
            sx={{ display: { xs: 'block', md: 'none' }, my: 1 }}
          />

          {/* Airline Info with Logo */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 0.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {flight.airlineCodes.slice(0, 2).map((code, i) => (
                <AirlineLogo 
                  key={code} 
                  code={code} 
                  name={flight.airlines[i]} 
                  size="small" 
                />
              ))}
              <Typography variant="body2" color="text.secondary">
                {flight.airlines.join(', ')}
              </Typography>
            </Box>
            {/* CO2 Estimate */}
            <Tooltip title="Estimated carbon emissions per passenger">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Co2 sx={{ fontSize: 14 }} color="action" />
                <Typography variant="caption" color="text.secondary">
                  ~{co2Estimate} kg CO₂
                </Typography>
              </Box>
            </Tooltip>
          </Box>

          {/* Price */}
          <Box
            sx={{
              textAlign: { xs: 'left', md: 'right' },
              mt: { xs: 1, md: 0 },
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              color="primary.main"
              sx={{ lineHeight: 1 }}
            >
              ${flight.price.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {flight.currency} • per person
            </Typography>
          </Box>
        </Box>

        {/* Expand/Collapse Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleExpand();
            }}
            aria-label={expanded ? 'Hide details' : 'Show details'}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* Expandable Details */}
        <Collapse in={expanded}>
          <SegmentDetails segments={flight.segments} />
        </Collapse>
      </CardContent>
    </Card>
    </motion.div>
  );
};

const InitialState = () => (
  <EmptyStateUI
    icon={<FlightTakeoff />}
    title="Search for flights"
    description="Enter your origin, destination, and travel dates above to find available flights."
  />
);

const ResultsList = ({
  flights,
  isLoading,
  isError,
  error,
  onRetry,
  hasSearched,
  selectedForCompare = [],
  onToggleCompare,
  maxCompare = 3,
}: ResultsListProps) => {
  if (!hasSearched) {
    return <InitialState />;
  }

  if (isLoading) {
    return <LoadingState variant="card" count={5} />;
  }

  if (isError) {
    return (
      <ErrorStateUI
        title="Failed to load flights"
        message={error?.message || 'An unexpected error occurred. Please try again.'}
        onRetry={onRetry}
      />
    );
  }

  if (flights.length === 0) {
    return (
      <EmptyStateUI
        icon={<SearchOff />}
        title="No flights found"
        description="Try different dates or destinations to find available flights."
      />
    );
  }

  const cheapestPrice = Math.min(...flights.map((f) => f.price));
  const fastestDuration = Math.min(...flights.map((f) => f.durationMinutes));

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      role="list"
      aria-label="Flight search results"
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <Box component="span" fontWeight={600}>
              {flights.length}
            </Box>{' '}
            {flights.length === 1 ? 'flight' : 'flights'} found
          </Typography>
          {onToggleCompare && (
            <Tooltip title="Select flights to compare side-by-side">
              <Chip
                icon={<CompareArrows fontSize="small" />}
                label="Compare"
                size="small"
                variant="outlined"
                color="primary"
                sx={{ fontSize: '0.75rem' }}
              />
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTime fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            Prices may change
          </Typography>
        </Box>
      </Box>

      <AnimatePresence mode="popLayout">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            isCheapest={flight.price === cheapestPrice}
            isFastest={flight.durationMinutes === fastestDuration}
            isSelected={selectedForCompare.includes(flight.id)}
            onToggleCompare={onToggleCompare}
            canSelect={selectedForCompare.length < maxCompare || selectedForCompare.includes(flight.id)}
          />
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default ResultsList;
