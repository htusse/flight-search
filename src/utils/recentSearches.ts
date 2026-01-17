import type { SearchParams } from '../features/flight/types';

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;
const MAX_RECENT_SEARCHES = Number(import.meta.env.VITE_MAX_RECENT_SEARCHES);

export interface RecentSearch {
  id: string;
  params: SearchParams;
  timestamp: number;
}

export const getRecentSearches = (): RecentSearch[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored) as RecentSearch[];
  } catch {
    return [];
  }
};

export const saveRecentSearch = (params: SearchParams) => {
  if (!params.origin || !params.destination) return;
  
  let searches = getRecentSearches();
  
  searches = searches.filter(
    (s) => !(s.params.origin === params.origin && 
             s.params.destination === params.destination &&
             s.params.departureDate === params.departureDate)
  );
  
  searches.unshift({
    id: `${Date.now()}`,
    params: { ...params },
    timestamp: Date.now(),
  });
  
  searches = searches.slice(0, MAX_RECENT_SEARCHES);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
};

export const removeRecentSearch = (id: string): RecentSearch[] => {
  const searches = getRecentSearches().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  return searches;
};

export const clearRecentSearches = () => {
  localStorage.removeItem(STORAGE_KEY);
};
