import React from 'react';
import { Card, CardContent, Typography, Stack, Chip, Tooltip } from '@mui/material';
import WindDirection from './WindDirection';
import type { WeatherResponseDto } from '../../types/weatherApi';

interface WeatherCardProps {
  title?: string;
  data?: WeatherResponseDto;
  loading?: boolean;
  error?: string | null;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ title = 'Current Conditions', data, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">No data</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>

        <Stack direction="row" spacing={3} alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="h3" component="div">
              {Math.round(data.temperature)}°C
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Updated: {new Date(data.timestamp * 1000).toLocaleTimeString()}
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <WindDirection direction={data.windDirection} />
              <Typography variant="body1">
                {data.windSpeed.toFixed(1)} m/s
              </Typography>
            </Stack>
            <Tooltip title="Measured in meters per second">
              <Chip label="Wind" size="small" />
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;