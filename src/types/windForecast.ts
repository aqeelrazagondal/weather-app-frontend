export type Units = 'standard' | 'metric' | 'imperial';
export type Granularity = 'hourly' | 'daily';

export interface HourlyPoint {
  temperature: number;
  windSpeed: number;
  windGust?: number;
  windDirectionDeg: number;
  windDirection: string; // 16-point: N, NNE, NE, ...
  timestamp: number; // unix seconds
}

export interface DailyPoint {
  date: string; // YYYY-MM-DD
  avgWindSpeed: number;
  predominantDirection: string; // 16-point compass
  maxWindGust?: number;
}

export interface HourlyForecastResponse {
  units: Units;
  granularity: 'hourly';
  hourly: HourlyPoint[];
}

export interface DailyForecastResponse {
  units: Units;
  granularity: 'daily';
  daily: DailyPoint[];
}

export type WindForecastResponse = HourlyForecastResponse | DailyForecastResponse;

export interface WindForecastParams {
  units?: Units; // default metric
  granularity?: Granularity; // default hourly
  range?: number; // hours for hourly (3–120, step 3)
  days?: number; // days for daily (1–7)
}