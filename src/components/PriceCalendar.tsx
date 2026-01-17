import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ChevronLeft, ChevronRight, CalendarMonth } from '@mui/icons-material';
import { format, addDays, subDays, parseISO, isSameDay } from 'date-fns';
import { searchFlights } from '../api/amadeus';
import type { SearchParams } from '../features/flight/types';

interface PriceCalendarProps {
  params: SearchParams;
  onDateSelect: (date: string) => void;
}

interface DatePrice {
  date: string;
  price: number | null;
  isLoading: boolean;
  isSelected: boolean;
}

const PriceCalendar = ({ params, onDateSelect }: PriceCalendarProps) => {
  const theme = useTheme();
  const [datePrices, setDatePrices] = useState<DatePrice[]>([]);

  const selectedDate = params.departureDate;

  useEffect(() => {
    if (!params.origin || !params.destination || !selectedDate) return;

    const fetchPrices = async () => {
      const baseDate = parseISO(selectedDate);
      const dates: DatePrice[] = [];

      for (let i = -3; i <= 3; i++) {
        const date = i === 0 ? baseDate : (i < 0 ? subDays(baseDate, Math.abs(i)) : addDays(baseDate, i));
        const dateStr = format(date, 'yyyy-MM-dd');
        dates.push({
          date: dateStr,
          price: null,
          isLoading: true,
          isSelected: i === 0,
        });
      }

      setDatePrices(dates);

      const updatedDates = await Promise.all(
        dates.map(async (dateItem) => {
          try {
            const flights = await searchFlights({
              ...params,
              departureDate: dateItem.date,
            });
            const cheapest = flights.length > 0 
              ? Math.min(...flights.map(f => f.price)) 
              : null;
            return { ...dateItem, price: cheapest, isLoading: false };
          } catch {
            return { ...dateItem, price: null, isLoading: false };
          }
        })
      );

      setDatePrices(updatedDates);
    };

    fetchPrices();
  }, [params, selectedDate]);

  const cheapestPrice = datePrices
    .filter(d => d.price !== null)
    .reduce((min, d) => (d.price! < min ? d.price! : min), Infinity);

  const handleShiftDates = (direction: 'prev' | 'next') => {
    const currentDate = parseISO(selectedDate);
    const newDate = direction === 'prev' 
      ? subDays(currentDate, 1) 
      : addDays(currentDate, 1);
    onDateSelect(format(newDate, 'yyyy-MM-dd'));
  };

  if (!params.origin || !params.destination) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CalendarMonth color="primary" fontSize="small" />
        <Typography variant="subtitle2" fontWeight={600}>
          Price Calendar
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
          Lowest fares for nearby dates
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => handleShiftDates('prev')}
          aria-label="Previous dates"
        >
          <ChevronLeft />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flex: 1,
            overflowX: 'auto',
            pb: 1,
          }}
        >
          {datePrices.map((dateItem) => {
            const date = parseISO(dateItem.date);
            const isCheapest = dateItem.price === cheapestPrice && cheapestPrice !== Infinity;
            const isSelected = isSameDay(date, parseISO(selectedDate));

            return (
              <Tooltip
                key={dateItem.date}
                title={dateItem.price ? `$${dateItem.price}` : 'No flights'}
              >
                <Box
                  onClick={() => !dateItem.isLoading && onDateSelect(dateItem.date)}
                  sx={{
                    flex: 1,
                    minWidth: 70,
                    p: 1.5,
                    borderRadius: 1.5,
                    textAlign: 'center',
                    cursor: dateItem.isLoading ? 'wait' : 'pointer',
                    border: 2,
                    borderColor: isSelected 
                      ? 'primary.main' 
                      : isCheapest 
                        ? 'success.main' 
                        : 'transparent',
                    bgcolor: isSelected 
                      ? alpha(theme.palette.primary.main, 0.08)
                      : isCheapest
                        ? alpha(theme.palette.success.main, 0.08)
                        : alpha(theme.palette.action.hover, 0.5),
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: isSelected 
                        ? alpha(theme.palette.primary.main, 0.12)
                        : alpha(theme.palette.action.hover, 0.8),
                    },
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${format(date, 'EEE, MMM d')} - ${dateItem.price ? `$${dateItem.price}` : 'No flights'}`}
                  aria-pressed={isSelected}
                >
                  <Typography
                    variant="caption"
                    color={isSelected ? 'primary.main' : 'text.secondary'}
                    fontWeight={isSelected ? 600 : 400}
                  >
                    {format(date, 'EEE')}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={isSelected ? 'primary.main' : 'text.primary'}
                  >
                    {format(date, 'd')}
                  </Typography>
                  {dateItem.isLoading ? (
                    <Skeleton variant="text" width={40} height={20} sx={{ mx: 'auto' }} />
                  ) : (
                    <Typography
                      variant="caption"
                      fontWeight={isCheapest ? 700 : 500}
                      color={
                        dateItem.price === null
                          ? 'text.disabled'
                          : isCheapest
                            ? 'success.main'
                            : 'text.secondary'
                      }
                    >
                      {dateItem.price !== null ? `$${dateItem.price}` : '—'}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        <IconButton
          size="small"
          onClick={() => handleShiftDates('next')}
          aria-label="Next dates"
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default PriceCalendar;
