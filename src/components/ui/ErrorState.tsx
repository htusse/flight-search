import { Alert, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorState = ({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Retry',
}: ErrorStateProps) => (
  <Alert
    severity="error"
    icon={<ErrorOutline />}
    sx={{ borderRadius: 2 }}
    role="alert"
    action={
      onRetry && (
        <Button
          color="inherit"
          size="small"
          onClick={onRetry}
          aria-label={retryLabel}
        >
          {retryLabel}
        </Button>
      )
    }
  >
    <Typography variant="subtitle2" fontWeight={600}>
      {title}
    </Typography>
    <Typography variant="body2">{message}</Typography>
  </Alert>
);

export default ErrorState;
