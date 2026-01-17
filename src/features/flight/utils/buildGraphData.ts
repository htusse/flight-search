import type { Flight, GraphDataPoint } from '../types';

export const buildGraphData = (flights: Flight[]): GraphDataPoint[] => {
  if (!flights || flights.length === 0) return [];

  return flights.map((flight, index) => ({
    index: index + 1,
    price: flight.price,
    label: `Flight ${index + 1}`,
    airline: flight.airlines[0] || 'Unknown',
    stops: flight.stops,
  }));
};

interface PriceBucket {
  range: string;
  rangeStart: number;
  rangeEnd: number;
  count: number;
  minPrice: number;
  avgPrice: number;
}

export const buildPriceDistribution = (
  flights: Flight[],
  bucketCount: number = 8
): PriceBucket[] => {
  if (!flights || flights.length === 0) return [];

  const prices = flights.map((f) => f.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const bucketSize = Math.ceil((maxPrice - minPrice) / bucketCount) || 50;

  const buckets: PriceBucket[] = [];

  for (let i = 0; i < bucketCount; i++) {
    const rangeStart = minPrice + i * bucketSize;
    const rangeEnd = rangeStart + bucketSize;

    const flightsInBucket = flights.filter(
      (f) => f.price >= rangeStart && f.price < rangeEnd
    );

    if (flightsInBucket.length > 0 || i < bucketCount - 1) {
      const bucketPrices = flightsInBucket.map((f) => f.price);
      buckets.push({
        range: `$${Math.round(rangeStart)}-${Math.round(rangeEnd)}`,
        rangeStart: Math.round(rangeStart),
        rangeEnd: Math.round(rangeEnd),
        count: flightsInBucket.length,
        minPrice:
          bucketPrices.length > 0 ? Math.min(...bucketPrices) : rangeStart,
        avgPrice:
          bucketPrices.length > 0
            ? Math.round(
                bucketPrices.reduce((a, b) => a + b, 0) / bucketPrices.length
              )
            : 0,
      });
    }
  }

  const lastBucket = buckets[buckets.length - 1];
  if (lastBucket) {
    const flightsAtMax = flights.filter((f) => f.price === maxPrice);
    if (
      flightsAtMax.length > 0 &&
      !buckets.some((b) => maxPrice >= b.rangeStart && maxPrice < b.rangeEnd)
    ) {
      lastBucket.count += flightsAtMax.length;
    }
  }

  return buckets.filter((b) => b.count > 0);
};

interface FlightStats {
  totalFlights: number;
  cheapestPrice: number;
  averagePrice: number;
  shortestDuration: number;
  averageDuration: number;
}

export const getFlightStats = (flights: Flight[]): FlightStats | null => {
  if (!flights || flights.length === 0) return null;

  const prices = flights.map((f) => f.price);
  const durations = flights.map((f) => f.durationMinutes);

  return {
    totalFlights: flights.length,
    cheapestPrice: Math.min(...prices),
    averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    shortestDuration: Math.min(...durations),
    averageDuration: Math.round(
      durations.reduce((a, b) => a + b, 0) / durations.length
    ),
  };
};
