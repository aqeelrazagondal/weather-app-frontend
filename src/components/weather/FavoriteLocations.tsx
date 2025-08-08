import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { RootState } from '../../store';
import { removeFavorite } from '../../store/slices/favoritesSlice';
import { favoritesService } from '../../services/favoritesService';
import FavoriteCard from './FavoriteCard';
import { useToast } from '../common/ToastProvider';

const fadeUp = {
  '@keyframes fadeUp': {
    from: { opacity: 0, transform: 'translateY(6px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

const FavoriteLocations: React.FC = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { locations } = useSelector((state: RootState) => state.favorites);

  const handleRemove = async (id: number | string) => {
    try {
      await favoritesService.removeFavorite(id);
      dispatch(removeFavorite(id));
      showToast({ message: 'Removed from favorites', severity: 'success' });
    } catch (e) {
      console.error('Failed to remove favorite', e);
      showToast({ message: 'Failed to remove favorite', severity: 'error' });
    }
  };

  if (!locations || locations.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          textAlign: 'center',
          p: 3,
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'rgba(148,163,184,0.35)',
          bgcolor: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <Typography variant="h6" gutterBottom>
          No favorite locations yet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Use the search above to find a city and add it to your favorites.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        ...fadeUp,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
      }}
    >
      {locations.map((loc, i) => (
        <Box
          key={loc.id}
          sx={{
            animation: 'fadeUp 300ms ease forwards',
            opacity: 0,
            animationDelay: `${i * 60}ms`,
          }}
        >
          <FavoriteCard location={loc} onRemove={handleRemove} />
        </Box>
      ))}
    </Box>
  );
};

export default FavoriteLocations;