import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  IconButton,
  Skeleton,
  Tooltip,
  Chip,
  Box,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { FavoriteLocation } from '../../types/weather';
import { countryCodeToFlag } from '../../utils/locale';
import { useCurrentWeather } from '../../hooks/useWeather';
import WindDirection from './WindDirection';
import LocationLinkButton from './LocationLinkButton';

interface Props {
  location: FavoriteLocation;
  onRemove: (id: number | string) => void;
}

const FavoriteCard: React.FC<Props> = ({ location, onRemove }) => {
  const hasCoords = Number.isFinite(location.lat) && Number.isFinite(location.lon);
  const { data, isLoading, isError } = useCurrentWeather(
    hasCoords ? location.lat : undefined,
    hasCoords ? location.lon : undefined
  );

  const title = useMemo(
    () =>
      location.displayName ||
      [location.name, location.state, location.country].filter(Boolean).join(', '),
    [location.displayName, location.name, location.state, location.country]
  );

  // Format "Updated" time safely; avoid Invalid Date
  const updatedLabel = useMemo(() => {
    if (!data || typeof data.timestamp !== 'number') return null;
    // Backend might send seconds; if it's already ms, keep it
    const ms = data.timestamp > 1e12 ? data.timestamp : data.timestamp * 1000;
    const d = new Date(ms);
    const time = Number.isFinite(d.getTime()) ? d : null;
    if (!time) return null;
    try {
      return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(time);
    } catch {
      return time.toLocaleTimeString();
    }
  }, [data]);

  return (
    <Card sx={{ overflow: 'hidden', position: 'relative' }}>
      {/* Subtle top accent bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, #06b6d4, #2563eb, #7c3aed)',
          opacity: 0.85,
        }}
      />
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Typography component="span" sx={{ fontSize: 22 }}>
            {countryCodeToFlag(location.country)}
          </Typography>
          <Typography variant="h6" sx={{ mb: 0 }} title={title}>
            {title}
          </Typography>
          {location.countryName && (
            <Chip
              size="small"
              label={location.countryName}
              sx={{ ml: 'auto', bgcolor: 'rgba(255,255,255,0.06)', color: 'text.secondary' }}
            />
          )}
        </Stack>

        {hasCoords && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Coords: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
          </Typography>
        )}

        {isLoading && (
          <Stack spacing={1} aria-label="loading-current-conditions">
            <Skeleton width={120} />
            <Skeleton width={180} />
          </Stack>
        )}

        {!isLoading && isError && (
          <Typography variant="body2" color="error">
            Failed to load current conditions
          </Typography>
        )}

        {!isLoading && !isError && data && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <WindDirection direction={data.windDirection} />
              <Typography variant="body2">{data.windSpeed.toFixed(1)} m/s</Typography>
            </Stack>
            <Typography variant="body2">{Math.round(data.temperature)}°C</Typography>
            <Tooltip title={updatedLabel ? `Updated ${updatedLabel}` : 'Live'}>
              <Typography variant="caption" color="text.secondary">
                Live
              </Typography>
            </Tooltip>
          </Stack>
        )}
      </CardContent>
      <CardActions sx={{ pt: 0 }}>
        <IconButton
          onClick={() => onRemove(location.id)}
          color="error"
          aria-label="remove from favorites"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
        {hasCoords && <LocationLinkButton location={location} size="small" variant="contained" />}
      </CardActions>
    </Card>
  );
};

export default React.memo(FavoriteCard);