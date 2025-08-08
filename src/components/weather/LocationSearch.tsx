import React, { useMemo, useEffect, useState } from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import debounce from 'lodash/debounce';
import { Location } from '../../types/weather';
import { locationService } from '../../services/locationService';
import { countryCodeToFlag } from '../../utils/locale';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLocations = useMemo(
    () =>
      debounce(async (input: string) => {
        if (input.trim().length < 2) {
          setOptions([]);
          return;
        }
        setLoading(true);
        try {
          const results = await locationService.searchLocations(input);
          setOptions(results);
        } catch (error) {
          setOptions([]);
          // eslint-disable-next-line no-console
          console.error('Error fetching locations:', error);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      fetchLocations.cancel();
    };
  }, [fetchLocations]);

  return (
    <Autocomplete
      id="location-search"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      getOptionLabel={(option) => option.displayName || `${option.name}, ${option.country}`}
      onChange={(_, value) => value && onLocationSelect(value)}
      onInputChange={(_, newInputValue) => {
        fetchLocations(newInputValue);
      }}
      filterOptions={(x) => x}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for a location"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(optionProps, option) => {
        // React 19 requires key to be passed directly, not inside a spread object
        const { key, ...liProps } = optionProps as any;
        return (
          <li key={key} {...liProps}>
            <Box component={Paper} elevation={0} sx={{ width: '100%', p: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography component="span" sx={{ fontSize: 18 }}>
                  {countryCodeToFlag(option.country)}
                </Typography>
                <Stack sx={{ overflow: 'hidden' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>
                    {option.displayName || option.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {option.state ? `${option.state}, ` : ''}
                    {option.country} • {option.lat.toFixed(4)}, {option.lon.toFixed(4)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </li>
        );
      }}
    />
  );
};

export default LocationSearch;