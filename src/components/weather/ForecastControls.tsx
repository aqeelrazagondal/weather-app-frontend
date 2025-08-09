import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  Slider,
} from '@mui/material';
import type { Units, Granularity } from '../../types/windForecast';

export interface ForecastControlsValue {
  units: Units;
  granularity: Granularity;
  range: number; // hours (3–120 step 3)
  days: number; // 1–7
}

interface Props {
  value: ForecastControlsValue;
  onChange: (next: ForecastControlsValue) => void;
}

const ForecastControls: React.FC<Props> = ({ value, onChange }) => {
  const handleUnits = (e: SelectChangeEvent) => onChange({ ...value, units: e.target.value as Units });
  const handleGranularity = (e: SelectChangeEvent) =>
    onChange({ ...value, granularity: e.target.value as Granularity });

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="units-label">Units</InputLabel>
          <Select labelId="units-label" label="Units" value={value.units} onChange={handleUnits}>
            <MenuItem value="metric">Metric (m/s, °C)</MenuItem>
            <MenuItem value="imperial">Imperial (mph, °F)</MenuItem>
            <MenuItem value="standard">Standard (m/s, K)</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="granularity-label">Granularity</InputLabel>
          <Select
            labelId="granularity-label"
            label="Granularity"
            value={value.granularity}
            onChange={handleGranularity}
          >
            <MenuItem value="hourly">Hourly</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
          </Select>
        </FormControl>

        {value.granularity === 'hourly' ? (
          <Box sx={{ flex: 1, minWidth: 260, px: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Hours (3–120, step 3): {value.range}h
            </Typography>
            <Slider
              size="small"
              value={value.range}
              min={3}
              max={120}
              step={3}
              onChange={(_, v) => onChange({ ...value, range: v as number })}
              valueLabelDisplay="auto"
            />
          </Box>
        ) : (
          <Box sx={{ flex: 1, minWidth: 260, px: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Days (1–7): {value.days}
            </Typography>
            <Slider
              size="small"
              value={value.days}
              min={1}
              max={7}
              step={1}
              onChange={(_, v) => onChange({ ...value, days: v as number })}
              valueLabelDisplay="auto"
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ForecastControls;