import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoriteLocation, Location } from '../../types/weather';
import { distanceMeters } from '../../utils/geo';

interface FavoritesState {
  locations: FavoriteLocation[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  locations: [],
  loading: false,
  error: null,
};

function isDuplicate(existing: FavoriteLocation[], incoming: Location) {
  // Duplicate if backend id matches (string or number)
  if (incoming.id !== undefined) {
    const idStr = String(incoming.id);
    if (existing.some((f) => String(f.id) === idStr)) return true;
  }
  // Or if within 500 meters (avoid near-duplicate coords)
  const threshold = 500;
  return existing.some((f) => distanceMeters({ lat: f.lat, lon: f.lon }, { lat: incoming.lat, lon: incoming.lon }) < threshold);
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<FavoriteLocation[]>) => {
      state.locations = action.payload;
    },
    addFavorite: (state, action: PayloadAction<FavoriteLocation>) => {
      // Prevent duplicates by id or closeness
      if (isDuplicate(state.locations, action.payload)) return;
      state.locations.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<number | string>) => {
      const target = String(action.payload);
      state.locations = state.locations.filter((location) => String(location.id) !== target);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite, setLoading, setError } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;