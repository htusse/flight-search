import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { searchFlights } from '../../../api/amadeus';
import { useSearchStore } from '../../../store/searchStore';
import { useFilterStore } from '../../../store/filterStore';
import type { Flight } from '../types';

interface UseFlightsSearchReturn {
  flights: Flight[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
}

export const useFlightsSearch = (): UseFlightsSearchReturn => {
  const { params, hasSearched } = useSearchStore();
  const { initializeFilters } = useFilterStore();

  const queryKey = [
    'flights',
    params.origin,
    params.destination,
    params.departureDate,
    params.returnDate,
    params.adults,
    params.travelClass,
    params.nonStop,
  ];

  const {
    data: flights = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Flight[], Error>({
    queryKey,
    queryFn: () => searchFlights(params),
    enabled:
      hasSearched &&
      Boolean(params.origin) &&
      Boolean(params.destination) &&
      Boolean(params.departureDate),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (flights.length > 0) {
      const maxPrice = Math.ceil(
        Math.max(...flights.map((f) => f.price)) / 100
      ) * 100;
      initializeFilters(maxPrice);
    }
  }, [flights, initializeFilters]);

  return {
    flights,
    isLoading: isLoading && hasSearched,
    isError,
    error: error as Error | null,
    refetch,
    isFetching,
  };
};
