import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SearchParams, TravelClass } from '../features/flight/types';

const isPageRefresh = (): boolean => {
  const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  if (navEntries.length > 0 && navEntries[0].type === 'reload') {
    return true;
  }
  return false;
};

if (isPageRefresh()) {
  sessionStorage.removeItem('flight-search-params');
}

interface SearchState {
  params: SearchParams;
  hasSearched: boolean;
  setOrigin: (code: string, name: string) => void;
  setDestination: (code: string, name: string) => void;
  setDepartureDate: (date: string) => void;
  setReturnDate: (date: string | null) => void;
  setAdults: (count: number) => void;
  setTravelClass: (travelClass: TravelClass) => void;
  swapLocations: () => void;
  setHasSearched: (value: boolean) => void;
  resetSearch: () => void;
}

const getDefaultParams = (): SearchParams => ({
  origin: '',
  originName: '',
  destination: '',
  destinationName: '',
  departureDate: '',
  returnDate: '',
  adults: 1,
  travelClass: 'ECONOMY',
  nonStop: false,
});

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      params: getDefaultParams(),
      hasSearched: false,

      setOrigin: (code, name) =>
        set((state) => ({
          params: { ...state.params, origin: code, originName: name },
        })),

      setDestination: (code, name) =>
        set((state) => ({
          params: { ...state.params, destination: code, destinationName: name },
        })),

  setDepartureDate: (date) =>
    set((state) => ({
      params: { ...state.params, departureDate: date },
    })),

  setReturnDate: (date) =>
    set((state) => ({
      params: { ...state.params, returnDate: date },
    })),

  setAdults: (count) =>
    set((state) => ({
      params: { ...state.params, adults: count },
    })),

  setTravelClass: (travelClass) =>
    set((state) => ({
      params: { ...state.params, travelClass },
    })),

  swapLocations: () =>
    set((state) => ({
      params: {
        ...state.params,
        origin: state.params.destination,
        originName: state.params.destinationName,
        destination: state.params.origin,
        destinationName: state.params.originName,
      },
    })),

      setHasSearched: (value) => set({ hasSearched: value }),

      resetSearch: () =>
        set({
          params: getDefaultParams(),
          hasSearched: false,
        }),
    }),
    {
      name: 'flight-search-params',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
