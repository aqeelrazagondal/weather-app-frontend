import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import { loadFavoritesFromStorage, setupFavoritesPersistence } from './persistence';

const preloadedFavorites = loadFavoritesFromStorage();

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
  preloadedState: {
    favorites: {
      locations: preloadedFavorites,
      loading: false,
      error: null,
    },
  },
});

setupFavoritesPersistence(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;