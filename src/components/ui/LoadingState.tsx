import { Box, Card, CardContent, Skeleton } from '@mui/material';

interface LoadingStateProps {
  variant?: 'card' | 'list' | 'inline';
  count?: number;
}

const LoadingState = ({ variant = 'card', count = 3 }: LoadingStateProps) => {
  if (variant === 'inline') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
      </Box>
    );
  }

  if (variant === 'list') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      role="status"
      aria-label="Loading content"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 100px' },
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="text" width={50} height={40} />
                <Skeleton variant="rectangular" width="100%" height={24} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" width={50} height={40} />
              </Box>
              <Skeleton variant="text" width={120} />
              <Skeleton variant="text" width={80} height={40} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default LoadingState;
