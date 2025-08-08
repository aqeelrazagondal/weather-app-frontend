import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { cardinalToDeg } from '../../utils/wind';
import type { Cardinal } from '../../types/weatherApi';

interface WindDirectionProps {
  direction: Cardinal;
  size?: number;
  showLabel?: boolean;
}

const WindDirection: React.FC<WindDirectionProps> = ({ direction, size = 36, showLabel = true }) => {
  const angle = cardinalToDeg(direction);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        sx={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: 'divider',
          background:
            'radial-gradient(120% 120% at 0% 0%, rgba(14,165,233,0.15), transparent), radial-gradient(120% 120% at 100% 100%, rgba(124,58,237,0.15), transparent)',
        }}
      >
        {/* needle */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 2,
            height: size * 0.42,
            bgcolor: 'primary.main',
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${angle}deg)`,
            borderRadius: 1,
          }}
        />
        <Typography
          variant="caption"
          sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)' }}
        >
          N
        </Typography>
      </Box>
      {showLabel && (
        <Typography variant="body2" sx={{ minWidth: 28 }}>
          {direction}
        </Typography>
      )}
    </Stack>
  );
};

export default WindDirection;