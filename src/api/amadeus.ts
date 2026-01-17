import axios from 'axios';
import type { Flight, FlightSegment, Airport, SearchParams } from '../features/flight/types';

const AMADEUS_BASE_URL = import.meta.env.VITE_AMADEUS_BASE_URL;

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

const getAccessToken = async (): Promise<string> => {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Amadeus API credentials not configured');
  }

  const response = await axios.post(
    `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

  return cachedToken!;
};

const AIRLINE_NAMES: Record<string, string> = {
  AA: 'American Airlines',
  UA: 'United Airlines',
  DL: 'Delta Air Lines',
  WN: 'Southwest Airlines',
  B6: 'JetBlue Airways',
  AS: 'Alaska Airlines',
  NK: 'Spirit Airlines',
  F9: 'Frontier Airlines',
  G4: 'Allegiant Air',
  BA: 'British Airways',
  AF: 'Air France',
  LH: 'Lufthansa',
  KL: 'KLM',
  IB: 'Iberia',
  EK: 'Emirates',
  QR: 'Qatar Airways',
  SQ: 'Singapore Airlines',
  CX: 'Cathay Pacific',
  JL: 'Japan Airlines',
  NH: 'ANA',
  AC: 'Air Canada',
  QF: 'Qantas',
  VS: 'Virgin Atlantic',
  TK: 'Turkish Airlines',
  LX: 'Swiss International',
  AY: 'Finnair',
  SK: 'SAS',
  TP: 'TAP Portugal',
  AZ: 'ITA Airways',
  EI: 'Aer Lingus',
};

const getAirlineName = (code: string): string => AIRLINE_NAMES[code] || code;

const parseDuration = (isoDuration: string): number => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  
  return hours * 60 + minutes;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const estimateCO2 = (durationMinutes: number): number => {
  const hours = durationMinutes / 60;
  return Math.round(hours * 90);
};

export const formatStops = (stops: number): string => {
  if (stops === 0) return 'Nonstop';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeFlightOffer = (offer: any): Flight => {
  const itinerary = offer.itineraries[0];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const segments: FlightSegment[] = itinerary.segments.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (seg: any): FlightSegment => ({
      departure: {
        iataCode: seg.departure.iataCode,
        terminal: seg.departure.terminal,
        at: seg.departure.at,
      },
      arrival: {
        iataCode: seg.arrival.iataCode,
        terminal: seg.arrival.terminal,
        at: seg.arrival.at,
      },
      carrierCode: seg.carrierCode,
      flightNumber: seg.number,
      duration: seg.duration,
    })
  );

  const airlineCodes = [...new Set(segments.map((s) => s.carrierCode))];
  const airlines = airlineCodes.map(getAirlineName);

  return {
    id: offer.id,
    price: parseFloat(offer.price.total),
    currency: offer.price.currency,
    airlines,
    airlineCodes,
    stops: segments.length - 1,
    durationMinutes: parseDuration(itinerary.duration),
    departureTime: segments[0].departure.at,
    arrivalTime: segments[segments.length - 1].arrival.at,
    departureAirport: segments[0].departure.iataCode,
    arrivalAirport: segments[segments.length - 1].arrival.iataCode,
    departureDate: segments[0].departure.at.split('T')[0],
    segments,
  };
};

export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  const token = await getAccessToken();

  const searchParams: Record<string, string> = {
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    adults: params.adults.toString(),
    travelClass: params.travelClass,
    currencyCode: 'USD',
    max: '50',
  };

  if (params.returnDate) {
    searchParams.returnDate = params.returnDate;
  }

  if (params.nonStop) {
    searchParams.nonStop = 'true';
  }

  const response = await axios.get(
    `${AMADEUS_BASE_URL}/v2/shopping/flight-offers`,
    {
      params: searchParams,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data.map(normalizeFlightOffer);
};

export const searchAirports = async (keyword: string): Promise<Airport[]> => {
  if (!keyword || keyword.length < 2) return [];

  try {
    const token = await getAccessToken();

    const response = await axios.get(
      `${AMADEUS_BASE_URL}/v1/reference-data/locations`,
      {
        params: {
          keyword,
          subType: 'AIRPORT,CITY',
          'page[limit]': 10,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.data.map((loc: any) => ({
      iataCode: loc.iataCode,
      name: loc.name,
      cityName: loc.address?.cityName || loc.name,
      countryCode: loc.address?.countryCode || '',
    }));
  } catch (error) {
    console.error('Airport search error:', error);
    return [];
  }
};
