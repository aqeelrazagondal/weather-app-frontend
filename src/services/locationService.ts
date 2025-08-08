import api from './api';
import { Location } from '../types/weather';

type LocationSearchResponseDto = {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  displayName?: string;
  countryName?: string;
};

export const locationService = {
  // NOTE: endpoint is relative to baseURL (/v1). Do NOT prefix with /v1 here.
  searchLocations: async (query: string): Promise<Location[]> => {
    const res = await api.get<LocationSearchResponseDto[]>(
      `location-search?query=${encodeURIComponent(query)}`
    );

    return res.data.map((x) => ({
      id: x.id,
      name: x.name,
      country: x.country,
      state: x.state,
      lat: x.lat,
      lon: x.lon,
      displayName: x.displayName ?? [x.name, x.state, x.country].filter(Boolean).join(', '),
      countryName: x.countryName,
    }));
  },
};