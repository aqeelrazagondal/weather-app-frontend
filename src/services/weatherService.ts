import api from './api';
import type { ForecastResponseDto, WeatherResponseDto } from '../types/weatherApi';

export const weatherService = {
  getCurrent: async (lat: number, lon: number): Promise<WeatherResponseDto> => {
    const res = await api.get<WeatherResponseDto>('weather/current', { params: { lat, lon } });
    return res.data;
  },

  getForecast: async (lat: number, lon: number): Promise<ForecastResponseDto> => {
    const res = await api.get<ForecastResponseDto>('weather/forecast', { params: { lat, lon } });
    return res.data;
  },

  // Payload shape example: { coords: [{ lat: 1.23, lon: 4.56 }, ...] }
  // getCurrentBatch: async (coords: Array<{ lat: number; lon: number }>): Promise<WeatherResponseDto[]> => {
  //   const res = await api.post<WeatherResponseDto[]>('weather/current/batch', { coords });
  //   return res.data;
  // },
};