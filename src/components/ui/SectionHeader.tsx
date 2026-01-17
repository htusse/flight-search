import { Box, Typography, IconButton } from '@mui/material';
import type { SvgIconProps } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactElement<SvgIconProps>;
  collapsible?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  action?: React.ReactNode;
}

const SectionHeader = ({
  title,
  subtitle,
  icon,
  collapsible = false,
  isExpanded = true,
  onToggle,
  action,
}: SectionHeaderProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 1,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon && (
        <Box
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: 20,
              color: 'primary.main',
            },
          }}
        >
          {icon}
        </Box>
      )}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {action}
      {collapsible && onToggle && (
        <IconButton
          size="small"
          onClick={onToggle}
          aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      )}
    </Box>
  </Box>
);

export default SectionHeader;
