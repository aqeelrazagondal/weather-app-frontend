export interface Location {
  id: string | number; // search may return a string id; favorites may use numeric ids
  name: string;
  country: string; // ISO alpha-2 (e.g., "GB")
  lat: number;
  lon: number;
  state?: string;
  displayName?: string; // "City, State, Country"
  countryName?: string; // optional full country name from search
}

export interface WindInfo {
  speed: number;
  deg: number;
  gust?: number;
}

export interface WeatherData {
  id: number;
  location: Location;
  wind: WindInfo;
  temperature: number;
  timestamp: number;
}

export interface FavoriteLocation extends Location {
  addedAt: number;
}