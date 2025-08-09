import api from './api';
import type { ForecastResponseDto, WeatherResponseDto } from '../types/weatherApi';
import type { WindForecastResponse, WindForecastParams } from '../types/windForecast';
import { toEightPoint } from '../utils/windMap';

// Helper to call new path-style endpoint
async function getWindForecastInternal(
  lat: number,
  lon: number,
  params: WindForecastParams = {}
): Promise<WindForecastResponse> {
  const { units, granularity, range, days } = params;

  const query: Record<string, string | number> = {};
  if (units) query.units = units;
  if (granularity) query.granularity = granularity;
  if ((granularity ?? 'hourly') === 'hourly' && typeof range === 'number') {
    query.range = range;
  }
  if ((granularity ?? 'hourly') === 'daily' && typeof days === 'number') {
    query.days = days;
  }

  // New backend path: /v1/weather/{lat},{lon}/forecast
  const path = `weather/${lat},${lon}/forecast`;
  const res = await api.get<WindForecastResponse>(path, { params: query });
  return res.data;
}

export const weatherService = {
  // Updated: Build "current" from new hourly forecast (first point)
  async getCurrent(lat: number, lon: number): Promise<WeatherResponseDto> {
    const data = await getWindForecastInternal(lat, lon, {
      units: 'metric',
      granularity: 'hourly',
      range: 3, // smallest allowed window
    });

    // If no hourly data, return a neutral WeatherResponseDto
    if (data.granularity !== 'hourly' || !data.hourly.length) {
      return {
        temperature: 0,
        windSpeed: 0,
        windDirection: 'N/A',
        timestamp: Math.floor(Date.now() / 1000),
      };
    }

    const point = data.hourly[0];
    return {
      temperature: point.temperature,
      windSpeed: point.windSpeed,
      windDirection: toEightPoint(point.windDirection),
      timestamp: point.timestamp,
    };
  },

  // Legacy forecast (kept for the existing LocationDetailPage).
  async getForecast(lat: number, lon: number): Promise<ForecastResponseDto> {
    const res = await api.get<ForecastResponseDto>('weather/forecast', { params: { lat, lon } });
    return res.data;
  },

  // New endpoint exposed for the advanced Forecast page
  async getWindForecast(
    lat: number,
    lon: number,
    params: WindForecastParams = {}
  ): Promise<WindForecastResponse> {
    return getWindForecastInternal(lat, lon, params);
  },
};