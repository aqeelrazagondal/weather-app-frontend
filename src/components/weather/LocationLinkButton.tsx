import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Location } from '../../types/weather';
import { loadWindPrefs } from '../../utils/prefs';

interface Props {
  location: Location;
  size?: 'small' | 'medium' | 'large';
  variant?: 'text' | 'outlined' | 'contained';
}

const LocationLinkButton: React.FC<Props> = ({ location, size = 'small', variant = 'outlined' }) => {
  const navigate = useNavigate();
  const prefs = loadWindPrefs();

  const handleClick = () => {
    const params = new URLSearchParams({
      lat: String(location.lat),
      lon: String(location.lon),
      units: prefs.units,
      granularity: prefs.granularity,
    });
    if (prefs.granularity === 'hourly') params.set('range', String(prefs.range));
    else params.set('days', String(prefs.days));
    navigate(`/forecast?${params.toString()}`);
  };

  return (
    <Button size={size} variant={variant} onClick={handleClick}>
      View forecast
    </Button>
  );
};

export default LocationLinkButton;