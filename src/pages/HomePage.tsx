import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Container, Typography, Paper } from '@mui/material';
import LocationSearch from '../components/weather/LocationSearch';
import FavoriteLocations from '../components/weather/FavoriteLocations';
import { Location } from '../types/weather';
import { addFavorite, setFavorites, setError, setLoading } from '../store/slices/favoritesSlice';
import { favoritesService } from '../services/favoritesService';
import { useToast } from '../components/common/ToastProvider';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        dispatch(setLoading(true));
        const favs = await favoritesService.getFavorites();
        dispatch(setFavorites(favs));
      } catch (e: any) {
        dispatch(setError(e?.message ?? 'Failed to load favorites'));
        console.error('Failed to load favorites', e);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  }, [dispatch]);

  const handleLocationSelect = async (location: Location) => {
    try {
      const created = await favoritesService.addFavorite(location);
      dispatch(addFavorite(created));
      showToast({ message: 'Added to favorites', severity: 'success' });
    } catch (e) {
      console.error('Failed to add favorite', e);
      showToast({ message: 'Failed to add favorite', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Favorite Locations
        </Typography>
        <Paper sx={{ p: 2, mb: 3 }}>
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </Paper>
        <FavoriteLocations />
      </Box>
    </Container>
  );
};

export default HomePage;