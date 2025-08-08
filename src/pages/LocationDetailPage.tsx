import React, { useMemo } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Stack, Typography, Button } from '@mui/material';
import WeatherCard from '../components/weather/WeatherCard';
import ForecastView from '../components/weather/ForecastView';
import { useCurrentWeather, useForecast } from '../hooks/useWeather';

function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const LocationDetailPage: React.FC = () => {
  const q = useQueryParams();
  const lat = Number(q.get('lat'));
  const lon = Number(q.get('lon'));
  const name = q.get('name') ? decodeURIComponent(q.get('name') as string) : 'Selected Location';

  const hasValidCoords = Number.isFinite(lat) && Number.isFinite(lon);

  const current = useCurrentWeather(hasValidCoords ? lat : undefined, hasValidCoords ? lon : undefined);
  const forecast = useForecast(hasValidCoords ? lat : undefined, hasValidCoords ? lon : undefined);

  if (!hasValidCoords) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h6" color="error">
            Invalid or missing coordinates. Please select a location again.
          </Typography>
          <Button component={RouterLink} to="/" variant="contained">
            Go back to Home
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={3}>
        <WeatherCard
          title={`Current • ${name}`}
          data={current.data}
          loading={current.isLoading}
          error={current.isError ? (current.error as Error).message : null}
        />
        <ForecastView
          data={forecast.data}
          loading={forecast.isLoading}
          error={forecast.isError ? (forecast.error as Error).message : null}
        />
      </Stack>
      <Box sx={{ height: 16 }} />
    </Container>
  );
};

export default LocationDetailPage;