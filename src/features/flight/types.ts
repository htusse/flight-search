export interface Flight {
  id: string;
  price: number;
  currency: string;
  airlines: string[];
  airlineCodes: string[];
  stops: number;
  durationMinutes: number;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  segments: FlightSegment[];
}

export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  flightNumber: string;
  duration: string;
}

export interface SearchParams {
  origin: string;
  originName: string;
  destination: string;
  destinationName: string;
  departureDate: string;
  returnDate: string | null;
  adults: number;
  travelClass: TravelClass;
  nonStop: boolean;
}

export type TravelClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';

export interface FilterState {
  stops: number[];
  airlines: string[];
  priceRange: [number, number];
  maxPrice: number;
  departureTimeRange: [number, number];
  sortBy: SortOption;
}

export type SortOption = 'price' | 'duration' | 'departure';

export interface GraphDataPoint {
  index: number;
  price: number;
  label: string;
  airline: string;
  stops: number;
}

export interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
}
