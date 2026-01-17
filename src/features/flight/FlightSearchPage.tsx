import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  Fab,
  Badge,
  Collapse,
  IconButton,
  alpha,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  FilterList,
  Close,
  FlightTakeoff,
  CalendarMonth,
  ShowChart,
} from '@mui/icons-material';
import SearchBar from './components/SearchBar';
import FiltersPanel from './components/FiltersPanel';
import ResultsList from './components/ResultsList';
import PriceGraph from './components/PriceGraph';
import ThemeToggle from '../../components/ThemeToggle';
import PriceCalendar from '../../components/PriceCalendar';
import FeatureHighlights from '../../components/FeatureHighlights';
import SkipLink from '../../components/SkipLink';
import RecentSearches from '../../components/RecentSearches';
import { saveRecentSearch } from '../../utils/recentSearches';
import FlightComparison from '../../components/FlightComparison';
import CompareFloatingBar from '../../components/CompareFloatingBar';
import SearchSummary from '../../components/SearchSummary';
import { SectionHeader } from '../../components/ui';
import { useFlightsSearch } from './hooks/useFlightsSearch';
import { useSearchStore } from '../../store/searchStore';
import { useFilterStore } from '../../store/filterStore';
import { applyFilters } from './utils/applyFilters';
import { useUrlParams } from '../../hooks/useUrlParams';
import type { Flight } from './types';

const DRAWER_WIDTH = parseInt(import.meta.env.VITE_DRAWER_WIDTH); 
const HEADER_HEIGHT = parseInt(import.meta.env.VITE_HEADER_HEIGHT);

const FlightSearchPage = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [graphExpanded, setGraphExpanded] = useState(true);
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const { hasSearched, setHasSearched, params } = useSearchStore();
  const filters = useFilterStore();
  
  useUrlParams();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { flights, isLoading, isError, error, refetch, isFetching } =
    useFlightsSearch();

  const filteredFlights = useMemo(
    () => applyFilters(flights, filters),
    [flights, filters]
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.stops.length < 3) count++;
    if (filters.airlines.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < filters.maxPrice) count++;
    if (filters.departureTimeRange[0] > 0 || filters.departureTimeRange[1] < 24) count++;
    return count;
  }, [filters]);

  const handleSearch = () => {
    setHasSearched(true);
    saveRecentSearch(params);
    setSelectedForCompare([]);
    refetch();
  };

  const handleClearSearch = () => {
    useSearchStore.getState().resetSearch();
    setSelectedForCompare([]);
    setGraphExpanded(true);
    setCalendarExpanded(false);
  };

  const handleToggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleToggleCompare = useCallback((flight: Flight) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(flight.id)) {
        return prev.filter((id) => id !== flight.id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, flight.id];
    });
  }, []);

  const selectedFlights = useMemo(
    () => filteredFlights.filter((f) => selectedForCompare.includes(f.id)),
    [filteredFlights, selectedForCompare]
  );

  const filtersContent = (
    <FiltersPanel flights={flights} filteredCount={filteredFlights.length} />
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <SkipLink />

      <AppBar
        position="fixed"
        elevation={isScrolled ? 4 : 0}
        sx={{
          bgcolor: 'primary.main',
          transform: isScrolled ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <Toolbar sx={{ minHeight: HEADER_HEIGHT }}>
          <FlightTakeoff sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flight Search
          </Typography>
          {params.origin && params.destination && (
            <Typography variant="body2" sx={{ mr: 2, opacity: 0.9 }}>
              {params.originName || params.origin} → {params.destinationName || params.destination}
            </Typography>
          )}
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 3, md: 4 },
          px: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: { xs: 2, md: 3 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FlightTakeoff sx={{ fontSize: { xs: 28, md: 36 } }} />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 600,
                }}
              >
                Flight Search
              </Typography>
            </Box>
            <ThemeToggle />
          </Box>
          <SearchBar onSearch={handleSearch} isLoading={isLoading || isFetching} />
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 3 }} id="main-content">
        {!hasSearched && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
            <FeatureHighlights />
            <RecentSearches onSelect={handleSearch} />
          </Box>
        )}

        {hasSearched && params.origin && params.destination && (
          <Box sx={{ mb: 2 }}>
            <SearchSummary
              params={params}
              resultCount={filteredFlights.length}
              onClear={handleClearSearch}
            />
          </Box>
        )}

        {hasSearched && flights.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <SectionHeader
              title="Explore nearby dates"
              icon={<CalendarMonth />}
              collapsible
              isExpanded={calendarExpanded}
              onToggle={() => setCalendarExpanded((prev) => !prev)}
            />
            <Collapse in={calendarExpanded}>
              <PriceCalendar
                params={params}
                onDateSelect={(date) => {
                  // Update search date and refetch
                  useSearchStore.getState().setDepartureDate(date);
                  refetch();
                }}
              />
            </Collapse>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            gap: 3,
            position: 'relative',
          }}
        >
          {!isMobile && hasSearched && flights.length > 0 && (
            <Box
              sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                position: 'sticky',
                top: isScrolled ? HEADER_HEIGHT + 16 : 16,
                alignSelf: 'flex-start',
                maxHeight: isScrolled ? `calc(100vh - ${HEADER_HEIGHT + 32}px)` : 'calc(100vh - 32px)',
                overflowY: 'auto',
                transition: 'top 0.3s ease-in-out',
              }}
            >
              {filtersContent}
            </Box>
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {hasSearched && flights.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <SectionHeader
                  title="Price Visualization"
                  subtitle="Updates instantly with filters"
                  icon={<ShowChart />}
                  collapsible
                  isExpanded={graphExpanded}
                  onToggle={() => setGraphExpanded((prev) => !prev)}
                />
                <Collapse in={graphExpanded}>
                  <PriceGraph
                    flights={filteredFlights}
                    isLoading={isLoading || isFetching}
                  />
                </Collapse>
              </Box>
            )}

            <ResultsList
              flights={filteredFlights}
              isLoading={isLoading || isFetching}
              isError={isError}
              error={error}
              onRetry={refetch}
              hasSearched={hasSearched}
              selectedForCompare={selectedForCompare}
              onToggleCompare={handleToggleCompare}
              maxCompare={3}
            />
          </Box>
        </Box>
      </Container>

      <CompareFloatingBar
        selectedFlights={selectedFlights}
        onRemove={(id) => setSelectedForCompare((prev) => prev.filter((fid) => fid !== id))}
        onCompare={() => setCompareOpen(true)}
        onClear={() => setSelectedForCompare([])}
      />

      <FlightComparison
        flights={selectedFlights}
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        onRemove={(id) => setSelectedForCompare((prev) => prev.filter((fid) => fid !== id))}
      />

      {isMobile && hasSearched && flights.length > 0 && (
        <Fab
          color="primary"
          onClick={handleToggleDrawer}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: theme.zIndex.speedDial,
          }}
          aria-label="Open filters"
        >
          <Badge
            badgeContent={activeFiltersCount}
            color="error"
            invisible={activeFiltersCount === 0}
          >
            <FilterList />
          </Badge>
        </Fab>
      )}

      <Drawer
        anchor={isTablet ? 'bottom' : 'right'}
        open={drawerOpen}
        onClose={handleToggleDrawer}
        PaperProps={{
          sx: {
            width: isTablet ? '100%' : DRAWER_WIDTH,
            maxHeight: isTablet ? '85vh' : '100%',
            borderTopLeftRadius: isTablet ? 16 : 0,
            borderTopRightRadius: isTablet ? 16 : 0,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Filters
            </Typography>
            <IconButton
              onClick={handleToggleDrawer}
              aria-label="Close filters"
            >
              <Close />
            </IconButton>
          </Box>

          {isTablet && (
            <Box
              sx={{
                width: 40,
                height: 4,
                bgcolor: alpha(theme.palette.common.black, 0.2),
                borderRadius: 2,
                position: 'absolute',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          )}

          {filtersContent}
        </Box>
      </Drawer>
    </Box>
  );
};

export default FlightSearchPage;
