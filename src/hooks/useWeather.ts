// src/hooks/useWeather.ts
import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../services/weatherService';
import type { ForecastResponseDto, WeatherResponseDto } from '../types/weatherApi';
import type { WindForecastParams, WindForecastResponse } from '../types/windForecast';

export function useCurrentWeather(lat?: number, lon?: number) {
  const enabled = typeof lat === 'number' && typeof lon === 'number';
  return useQuery<WeatherResponseDto>({
    queryKey: ['current-weather', lat, lon],
    queryFn: () => weatherService.getCurrent(lat!, lon!),
    enabled,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 15,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useForecast(lat?: number, lon?: number) {
  const enabled = typeof lat === 'number' && typeof lon === 'number';
  return useQuery<ForecastResponseDto>({
    queryKey: ['forecast', lat, lon],
    queryFn: () => weatherService.getForecast(lat!, lon!),
    enabled,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useWindForecast(lat?: number, lon?: number, params?: WindForecastParams) {
  const enabled = typeof lat === 'number' && typeof lon === 'number';
  return useQuery<WindForecastResponse>({
    queryKey: [
      'wind-forecast',
      lat,
      lon,
      params?.units ?? 'metric',
      params?.granularity ?? 'hourly',
      params?.range ?? 24,
      params?.days ?? 5,
    ],
    queryFn: () => weatherService.getWindForecast(lat!, lon!, params ?? {}),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    // React Query v5 expects boolean | number | (failureCount, error) => boolean
    retry: (failureCount, error: any) => {
      const status = error?.response?.status;
      if (status === 429) return false; // do not retry on rate limit
      return failureCount < 1; // retry once for other transient errors
    },
    refetchOnWindowFocus: false,
  });
}