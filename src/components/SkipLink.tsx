import { Box } from '@mui/material';

const SkipLink = () => (
  <Box
    component="a"
    href="#main-content"
    sx={{
      position: 'absolute',
      left: '-9999px',
      top: 'auto',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      zIndex: 9999,
      '&:focus': {
        position: 'fixed',
        top: 8,
        left: 8,
        width: 'auto',
        height: 'auto',
        padding: '12px 24px',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: 2,
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
        boxShadow: 4,
        outline: '2px solid',
        outlineColor: 'primary.dark',
        outlineOffset: 2,
      },
    }}
    tabIndex={0}
  >
    Skip to main content
  </Box>
);

export default SkipLink;
