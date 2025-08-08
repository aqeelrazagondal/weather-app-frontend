// Types matching your Swagger

export type Cardinal = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'N/A';

export interface WeatherResponseDto {
  temperature: number; // °C
  windSpeed: number;   // m/s
  windDirection: Cardinal; // cardinal direction
  timestamp: number;   // unix
}

export interface DailyForecastDto {
  date: string; // YYYY-MM-DD
  avgWindSpeed: number; // m/s
  predominantDirection: Cardinal;
}

export interface ForecastResponseDto {
  hourly: WeatherResponseDto[];
  daily: DailyForecastDto[];
}