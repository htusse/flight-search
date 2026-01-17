import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import { ShowChart, BarChartRounded, TrendingUp } from '@mui/icons-material';
import type { Flight } from '../types';
import {
  buildGraphData,
  buildPriceDistribution,
  getFlightStats,
} from '../utils/buildGraphData';
import { formatDuration, formatStops } from '../../../api/amadeus';

interface PriceGraphProps {
  flights: Flight[];
  isLoading?: boolean;
}

type ChartType = 'area' | 'bar';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      price?: number;
      airline?: string;
      stops?: number;
      count?: number;
      range?: string;
      minPrice?: number;
      avgPrice?: number;
    };
  }>;
  chartType: ChartType;
}

const CustomTooltip = ({ active, payload, chartType }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1.5,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      {chartType === 'area' ? (
        <>
          <Typography variant="subtitle2" fontWeight={600} color="primary.main">
            ${data.price?.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {data.airline}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatStops(data.stops ?? 0)}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="subtitle2" fontWeight={600}>
            {data.range}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.count} flight{data.count !== 1 ? 's' : ''}
          </Typography>
          {data.minPrice && (
            <Typography variant="caption" color="primary.main" display="block">
              From ${data.minPrice?.toLocaleString()}
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
};

const StatsCard = ({
  label,
  value,
  subValue,
  icon,
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        bgcolor: alpha(theme.palette.primary.main, 0.04),
        borderRadius: 1.5,
        flex: 1,
        minWidth: 120,
      }}
    >
      <Box
        sx={{
          p: 1,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: 'primary.main',
          display: 'flex',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="subtitle2" fontWeight={600}>
          {value}
        </Typography>
        {subValue && (
          <Typography variant="caption" color="text.secondary">
            {subValue}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const EmptyGraph = () => (
  <Box
    sx={{
      height: 200,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'action.hover',
      borderRadius: 2,
    }}
  >
    <ShowChart sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
    <Typography variant="body2" color="text.secondary">
      No data to display
    </Typography>
    <Typography variant="caption" color="text.disabled">
      Apply different filters to see price trends
    </Typography>
  </Box>
);

const LoadingGraph = () => (
  <Box>
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Skeleton variant="rounded" width={120} height={60} />
      <Skeleton variant="rounded" width={120} height={60} />
      <Skeleton variant="rounded" width={120} height={60} />
    </Box>
    <Skeleton variant="rounded" width="100%" height={200} />
  </Box>
);

const PriceGraph = ({ flights, isLoading = false }: PriceGraphProps) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<ChartType>('area');

  const areaData = useMemo(() => buildGraphData(flights), [flights]);
  const barData = useMemo(
    () => buildPriceDistribution(flights, 6),
    [flights]
  );
  const stats = useMemo(() => getFlightStats(flights), [flights]);

  const handleChartTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newType: ChartType | null
  ) => {
    if (newType) setChartType(newType);
  };

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <LoadingGraph />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
      role="region"
      aria-label="Price visualization"
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Price Overview
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
          aria-label="Chart type"
        >
          <ToggleButton value="area" aria-label="Line chart">
            <ShowChart fontSize="small" />
          </ToggleButton>
          <ToggleButton value="bar" aria-label="Bar chart">
            <BarChartRounded fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            flexWrap: 'wrap',
          }}
        >
          <StatsCard
            label="Cheapest"
            value={`$${stats.cheapestPrice.toLocaleString()}`}
            icon={<TrendingUp fontSize="small" />}
          />
          <StatsCard
            label="Average"
            value={`$${stats.averagePrice.toLocaleString()}`}
            icon={<ShowChart fontSize="small" />}
          />
          <StatsCard
            label="Fastest"
            value={formatDuration(stats.shortestDuration)}
            subValue={`avg ${formatDuration(stats.averageDuration)}`}
            icon={<BarChartRounded fontSize="small" />}
          />
        </Box>
      )}

      {/* Chart */}
      {flights.length === 0 ? (
        <EmptyGraph />
      ) : (
        <Box sx={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            {chartType === 'area' ? (
              <AreaChart
                data={areaData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={theme.palette.primary.main}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={theme.palette.primary.main}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.divider}
                  vertical={false}
                />
                <XAxis
                  dataKey="index"
                  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  axisLine={{ stroke: theme.palette.divider }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip content={<CustomTooltip chartType="area" />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                  dot={{
                    r: 4,
                    fill: theme.palette.background.paper,
                    stroke: theme.palette.primary.main,
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: theme.palette.primary.main,
                    stroke: theme.palette.background.paper,
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            ) : (
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.divider}
                  vertical={false}
                />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
                  axisLine={{ stroke: theme.palette.divider }}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip content={<CustomTooltip chartType="bar" />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {barData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? theme.palette.success.main
                          : alpha(theme.palette.primary.main, 0.7 - index * 0.1)
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      )}

      {/* Legend */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {chartType === 'area'
            ? 'Prices sorted from lowest to highest'
            : 'Number of flights per price range'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PriceGraph;
