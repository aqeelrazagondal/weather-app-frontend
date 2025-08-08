import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Location } from '../../types/weather';

interface Props {
  location: Location;
  size?: 'small' | 'medium' | 'large';
  variant?: 'text' | 'outlined' | 'contained';
}

const LocationLinkButton: React.FC<Props> = ({ location, size = 'small', variant = 'outlined' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const name =
      location.displayName ||
      [location.name, location.state, location.country].filter(Boolean).join(', ');
    const params = new URLSearchParams({
      lat: String(location.lat),
      lon: String(location.lon),
      name: encodeURIComponent(name),
    });
    navigate(`/location?${params.toString()}`);
  };

  return (
    <Button size={size} variant={variant} onClick={handleClick}>
      View forecast
    </Button>
  );
};

export default LocationLinkButton;