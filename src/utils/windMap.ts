// src/utils/windMap.ts
import type { Cardinal } from '../types/weatherApi';

// Map 16-point (or any string) to 8-point Cardinal used by WeatherResponseDto
export function toEightPoint(dir: string | undefined | null): Cardinal {
  switch ((dir || '').toUpperCase()) {
    case 'N':
    case 'NNE':
      return 'N';
    case 'NE':
    case 'ENE':
      return 'NE';
    case 'E':
    case 'ESE':
      return 'E';
    case 'SE':
    case 'SSE':
      return 'SE';
    case 'S':
    case 'SSW':
      return 'S';
    case 'SW':
    case 'WSW':
      return 'SW';
    case 'W':
    case 'WNW':
      return 'W';
    case 'NW':
    case 'NNW':
      return 'NW';
    default:
      return 'N/A';
  }
}