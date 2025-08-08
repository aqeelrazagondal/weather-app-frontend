import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../services/weatherService';
import type { ForecastResponseDto, WeatherResponseDto } from '../types/weatherApi';

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