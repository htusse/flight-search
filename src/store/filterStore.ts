import { create } from 'zustand';
import type { FilterState, SortOption } from '../features/flight/types';

interface FilterActions {
  toggleStop: (stop: number) => void;
  setAirlines: (airlines: string[]) => void;
  toggleAirline: (airline: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setDepartureTimeRange: (range: [number, number]) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
  initializeFilters: (maxPrice: number) => void;
}

type FilterStore = FilterState & FilterActions;

const getDefaultFilters = (): FilterState => ({
  stops: [0, 1, 2], 
  airlines: [], 
  priceRange: [0, 10000],
  maxPrice: 10000,
  departureTimeRange: [0, 24], 
  sortBy: 'price',
});

export const useFilterStore = create<FilterStore>((set) => ({
  ...getDefaultFilters(),

  toggleStop: (stop) =>
    set((state) => {
      const newStops = state.stops.includes(stop)
        ? state.stops.filter((s) => s !== stop)
        : [...state.stops, stop].sort();
      return { stops: newStops.length > 0 ? newStops : state.stops };
    }),

  setAirlines: (airlines) => set({ airlines }),

  toggleAirline: (airline) =>
    set((state) => {
      const newAirlines = state.airlines.includes(airline)
        ? state.airlines.filter((a) => a !== airline)
        : [...state.airlines, airline];
      return { airlines: newAirlines };
    }),

  setPriceRange: (range) => set({ priceRange: range }),

  setDepartureTimeRange: (range) => set({ departureTimeRange: range }),

  setSortBy: (sortBy) => set({ sortBy }),

  resetFilters: () => set(getDefaultFilters()),

  initializeFilters: (maxPrice) =>
    set({
      ...getDefaultFilters(),
      maxPrice,
      priceRange: [0, maxPrice],
    }),
}));
