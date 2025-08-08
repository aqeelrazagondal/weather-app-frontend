import { FavoriteLocation } from '../types/weather';
import type { Store } from '@reduxjs/toolkit';
import type { RootState } from './index';

const STORAGE_KEY = 'favorites';

export function loadFavoritesFromStorage(): FavoriteLocation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteLocation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavoritesToStorage(favorites: FavoriteLocation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // ignore storage errors (quota, etc.)
  }
}

export function setupFavoritesPersistence(store: Store<RootState>) {
  let prev = store.getState().favorites.locations;
  return store.subscribe(() => {
    const next = store.getState().favorites.locations;
    if (next !== prev) {
      prev = next;
      saveFavoritesToStorage(next);
    }
  });
}