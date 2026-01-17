import { Box, Typography, Paper, useTheme, alpha, Chip } from '@mui/material';
import {
  FilterAlt,
  TrendingUp,
  CalendarMonth,
  Speed,
  CompareArrows,
  Co2,
} from '@mui/icons-material';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: <FilterAlt />,
    title: 'Smart Filtering',
    description: 'Filter by stops, airlines, price, and time. Changes apply instantly without reloading.',
  },
  {
    icon: <CompareArrows />,
    title: 'Flight Comparison',
    description: 'Select up to 3 flights to compare side-by-side across price, duration, and stops.',
  },
  {
    icon: <TrendingUp />,
    title: 'Price Visualization',
    description: 'Interactive charts show price distribution to help you spot the best deals quickly.',
  },
  {
    icon: <CalendarMonth />,
    title: 'Flexible Dates',
    description: 'Explore prices on nearby dates to find cheaper alternatives for your trip.',
  },
  {
    icon: <Co2 />,
    title: 'CO₂ Estimates',
    description: 'See estimated carbon emissions per flight to make eco-conscious travel choices.',
  },
  {
    icon: <Speed />,
    title: 'Recent Searches',
    description: 'Quickly access your recent searches to continue where you left off.',
  },
];

const FeatureHighlights = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        bgcolor: alpha(theme.palette.primary.main, 0.02),
      }}
      role="region"
      aria-label="Application features"
    >
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Chip
          label="What you can do"
          color="primary"
          size="small"
          sx={{ mb: 1 }}
        />
        <Typography variant="h6" fontWeight={600}>
          Discover Your Perfect Flight
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Search, compare, and filter flights to find the best deals
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {FEATURES.map((feature) => (
          <Box
            key={feature.title}
            sx={{
              display: 'flex',
              gap: 1.5,
              p: 2,
              borderRadius: 1.5,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                flexShrink: 0,
              }}
            >
              {feature.icon}
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {feature.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default FeatureHighlights;
