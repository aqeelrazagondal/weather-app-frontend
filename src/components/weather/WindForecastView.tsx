import React from 'react';
import { Card, CardContent, Typography, Stack, Box, Chip, Tooltip, Avatar } from '@mui/material';
import type { WindForecastResponse } from '../../types/windForecast';
import WindDirection from './WindDirection';
import ForecastSparkline from './ForecastSparkline';

function unitLabel(units: string): string {
  switch (units) {
    case 'imperial':
      return 'mph';
    case 'standard':
      return 'm/s';
    default:
      return 'm/s';
  }
}

interface Props {
  data?: WindForecastResponse | undefined;
  loading?: boolean;
  error?: string | null;
}

const WindForecastView: React.FC<Props> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Forecast</Typography>
          <Typography variant="body2" color="text.secondary">Loading...</Typography>
        </CardContent>
      </Card>
    );
  }
  if (error) {
    const is429 = /429/.test(error);
    const is400 = /400/.test(error);
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Forecast</Typography>
          <Typography variant="body2" color="error">
            {is429
              ? 'Too many requests. Please try again shortly.'
              : is400
              ? 'Invalid parameters or location not supported.'
              : error}
          </Typography>
        </CardContent>
      </Card>
    );
  }
  if (!data) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Forecast</Typography>
          <Typography variant="body2" color="text.secondary">No data</Typography>
        </CardContent>
      </Card>
    );
  }

  if (data.granularity === 'hourly') {
    const speeds = data.hourly.map(h => h.windSpeed);
    const unit = unitLabel(data.units);
    const min = Math.min(...speeds);
    const max = Math.max(...speeds);
    const range = Math.max(1e-6, max - min);

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Forecast • Hourly</Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>Wind speed over time</Typography>
              <ForecastSparkline values={speeds} width={240} height={60} />
              <Box
                sx={{
                  mt: 1.5,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
                  gap: 1,
                }}
              >
                {data.hourly.slice(0, 12).map((h) => {
                  const intensity = (h.windSpeed - min) / range;
                  const bgAlpha = 0.08 + intensity * 0.18;
                  const borderAlpha = 0.15 + intensity * 0.3;
                  const time = new Date((h.timestamp > 1e12 ? h.timestamp : h.timestamp * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <Tooltip
                      key={h.timestamp}
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WindDirection direction={h.windDirection as any} size={22} showLabel />
                          <Typography variant="caption">
                            {h.windSpeed.toFixed(1)} {unit} {h.windGust ? `(gust ${h.windGust.toFixed(1)} ${unit})` : ''} at {time}
                          </Typography>
                        </Box>
                      }
                      arrow
                    >
                      <Chip
                        size="small"
                        variant="outlined"
                        sx={{
                          justifyContent: 'space-between',
                          bgcolor: `rgba(96, 165, 250, ${bgAlpha})`,
                          borderColor: `rgba(148,163,184, ${borderAlpha})`,
                          color: 'text.primary',
                          fontWeight: 500,
                          px: 0.5,
                          height: 34,
                          '& .MuiChip-label': {
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            px: 0.5,
                            fontSize: 12,
                          },
                        }}
                        avatar={
                          <Avatar
                            sx={{
                              width: 22,
                              height: 22,
                              fontSize: 11,
                              bgcolor: 'rgba(37,99,235,0.35)',
                              color: 'primary.contrastText',
                            }}
                          >
                            {time.split(':')[0]}
                          </Avatar>
                        }
                        label={
                          <>
                            <span>{h.windSpeed.toFixed(1)} {unit}</span>
                            <span style={{ opacity: 0.8, fontWeight: 400, marginLeft: 8 }}>
                              {time}
                            </span>
                          </>
                        }
                      />
                    </Tooltip>
                  );
                })}
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const unit = unitLabel(data.units);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Forecast • Daily</Typography>
        <Stack spacing={1}>
          {data.daily.map((d) => (
            <Stack key={d.date} direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 110 }}>{d.date}</Typography>
              <Typography variant="body2">
                {d.avgWindSpeed.toFixed(1)} {unit}
                {typeof d.maxWindGust === 'number' ? ` • gust ${d.maxWindGust.toFixed(1)} ${unit}` : ''}
              </Typography>
              <WindDirection direction={d.predominantDirection as any} showLabel />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WindForecastView;