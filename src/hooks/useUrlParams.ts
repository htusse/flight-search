import { useEffect } from 'react';
import { useSearchStore } from '../store/searchStore';
import { useFilterStore } from '../store/filterStore';

export const useUrlParams = () => {
  const { setOrigin, setDestination, setDepartureDate, setReturnDate, setAdults, setHasSearched } =
    useSearchStore();
  const { setSortBy } = useFilterStore();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const origin = searchParams.get('from');
    const originName = searchParams.get('fromName');
    const destination = searchParams.get('to');
    const destName = searchParams.get('toName');
    const departureDate = searchParams.get('date');
    const returnDate = searchParams.get('return');
    const adults = searchParams.get('adults');
    const sort = searchParams.get('sort');

    if (origin && destination && departureDate) {
      setOrigin(origin, originName || origin);
      setDestination(destination, destName || destination);
      setDepartureDate(departureDate);
      if (returnDate) setReturnDate(returnDate);
      if (adults) setAdults(parseInt(adults, 10));
      
      if (sort && ['price', 'duration', 'departure'].includes(sort)) {
        setSortBy(sort as 'price' | 'duration' | 'departure');
      }
      
      setHasSearched(true);
    }
  }, [setOrigin, setDestination, setDepartureDate, setReturnDate, setAdults, setSortBy, setHasSearched]);
};
