import api from './api';
import { FavoriteLocation, Location } from '../types/weather';

// Read local cache (mirrored favorites) to enrich server results
function loadLocalFavorites(): FavoriteLocation[] {
  try {
    const raw = localStorage.getItem('favorites');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Safely coerce lat/lon to numbers if present; return undefined if invalid
function toNumberOrUndef(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function normalizeFavorite(fromServer: Partial<FavoriteLocation>, fromClient?: Location | FavoriteLocation): FavoriteLocation {
  const id = (fromServer.id ?? fromClient?.id)! as number | string;
  const name = (fromServer.name ?? fromClient?.name)!;
  const country = (fromServer.country ?? fromClient?.country)!;
  const state = fromServer.state ?? fromClient?.state;

  const lat = toNumberOrUndef((fromServer as any).lat ?? fromClient?.lat);
  const lon = toNumberOrUndef((fromServer as any).lon ?? fromClient?.lon);

  const displayName =
    fromServer.displayName ??
    fromClient?.displayName ??
    [name, state, country].filter(Boolean).join(', ');

  const countryName = fromServer.countryName ?? (fromClient as any)?.countryName;

  return {
    id,
    name,
    country,
    state,
    lat: (lat as number) ?? (NaN as unknown as number),
    lon: (lon as number) ?? (NaN as unknown as number),
    displayName,
    countryName,
    addedAt: (fromServer as any).addedAt ?? Date.now(),
  };
}

export const favoritesService = {
  // Merge server results with local cached favorites by id to preserve richer fields
  getFavorites: async (): Promise<FavoriteLocation[]> => {
    const [serverRes, localFavs] = await Promise.all([
      api.get<FavoriteLocation[]>('locations'),
      Promise.resolve(loadLocalFavorites()),
    ]);

    const localById = new Map<string, FavoriteLocation>(
      (localFavs ?? []).map((f) => [String(f.id), f])
    );

    const merged = (serverRes.data ?? []).map((srv) => {
      const local = localById.get(String(srv.id));
      return normalizeFavorite(srv, local);
    });

    return merged;
  },

  addFavorite: async (selected: Location): Promise<FavoriteLocation> => {
    const payload = {
      name: selected.name,
      latitude: selected.lat,
      longitude: selected.lon,
    };
    const res = await api.post<FavoriteLocation>('locations', payload);
    // Merge with selected to ensure UI retains displayName/state/countryName/coords
    return normalizeFavorite(res.data, selected);
  },

  removeFavorite: async (id: number | string): Promise<void> => {
    await api.delete(`locations/${id}`);
  },
};