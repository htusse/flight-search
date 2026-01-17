import type { Flight, FilterState } from '../types';

export const applyFilters = (
  flights: Flight[],
  filters: FilterState
): Flight[] => {
  if (!flights || flights.length === 0) return [];

  let filtered = [...flights];

  if (filters.stops.length > 0 && filters.stops.length < 3) {
    filtered = filtered.filter((flight) => {
      if (filters.stops.includes(2) && flight.stops >= 2) return true;
      return filters.stops.includes(flight.stops);
    });
  }

  if (filters.airlines.length > 0) {
    filtered = filtered.filter((flight) =>
      flight.airlines.some((airline) => filters.airlines.includes(airline))
    );
  }

  filtered = filtered.filter(
    (flight) =>
      flight.price >= filters.priceRange[0] &&
      flight.price <= filters.priceRange[1]
  );

  if (
    filters.departureTimeRange[0] > 0 ||
    filters.departureTimeRange[1] < 24
  ) {
    filtered = filtered.filter((flight) => {
      const departureHour = new Date(flight.departureTime).getHours();
      return (
        departureHour >= filters.departureTimeRange[0] &&
        departureHour <= filters.departureTimeRange[1]
      );
    });
  }

  switch (filters.sortBy) {
    case 'price':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'duration':
      filtered.sort((a, b) => a.durationMinutes - b.durationMinutes);
      break;
    case 'departure':
      filtered.sort(
        (a, b) =>
          new Date(a.departureTime).getTime() -
          new Date(b.departureTime).getTime()
      );
      break;
  }

  return filtered;
};

export const getUniqueAirlines = (flights: Flight[]): string[] => {
  return [...new Set(flights.flatMap((f) => f.airlines))].sort();
};

export const getStopsDistribution = (
  flights: Flight[]
): Record<number, number> => {
  return flights.reduce(
    (acc, flight) => {
      const stopKey = Math.min(flight.stops, 2);
      acc[stopKey] = (acc[stopKey] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );
};
