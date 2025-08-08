import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Box,
  Chip,
  Tooltip,
  Avatar,
} from '@mui/material';
import type { ForecastResponseDto } from '../../types/weatherApi';
import ForecastSparkline from './ForecastSparkline';
import WindDirection from './WindDirection';
import { useElementSize } from '../../utils/useSize';

interface ForecastViewProps {
  data?: ForecastResponseDto;
  loading?: boolean;
  error?: string | null;
}

function formatHour(ts: number) {
  const ms = ts > 1e12 ? ts : ts * 1000;
  try {
    return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(ms);
  } catch {
    return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

const GRID_GAP = 8; // must match `gap: 1` below
const COLS = { xs: 2, sm: 3, md: 12 }; // aim one row on md+

const ForecastView: React.FC<ForecastViewProps> = ({ data, loading, error }) => {
  const hourly = data?.hourly ?? [];
  const daily = data?.daily ?? [];

  // Show the first 12 hours inline
  const MAX_HOURS = 12;
  const hourlySlice = hourly.slice(0, MAX_HOURS);

  const hourlySpeeds = useMemo(() => hourlySlice.map((h) => h.windSpeed), [hourlySlice]);
  const hourlyInfo = useMemo(
    () =>
      hourlySlice.map((h) => ({
        label: formatHour(h.timestamp),
        hourOnly: formatHour(h.timestamp).split(':')[0],
        speed: `${h.windSpeed.toFixed(1)} m/s`,
        speedValue: h.windSpeed,
        direction: h.windDirection,
        ts: h.timestamp,
      })),
    [hourlySlice]
  );

  // IMPORTANT: measure a wrapper that contains BOTH sparkline and pills,
  // so the sparkline width is never 0 at first render.
  const { ref: wrapRef, size: wrapSize } = useElementSize<HTMLDivElement>();

  // Compute x centers for alignment based on wrapper width (same breakpoints as grid)
  const xPositions = useMemo(() => {
    const containerWidth = wrapSize.width || 0;
    if (!containerWidth || hourlyInfo.length === 0) return undefined;

    const bpCols = containerWidth < 600 ? COLS.xs : containerWidth < 900 ? COLS.sm : COLS.md;
    const totalCols = Math.min(bpCols, hourlyInfo.length);
    const gaps = Math.max(0, totalCols - 1);
    const totalGap = gaps * GRID_GAP;
    const colWidth = (containerWidth - totalGap) / totalCols;

    return hourlyInfo.map((_, i) => i * (colWidth + GRID_GAP) + colWidth / 2);
  }, [wrapSize.width, hourlyInfo]);

  // Fallback width to avoid blank sparkline before ResizeObserver kicks in
  const sparkWidth = useMemo(() => {
    // Approx 56px per chip incl. gap as a conservative guess
    const approx = Math.max(240, hourlyInfo.length * 56);
    return wrapSize.width > 0 ? wrapSize.width : approx;
  }, [wrapSize.width, hourlyInfo.length]);

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
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Forecast</Typography>
          <Typography variant="body2" color="error">{error}</Typography>
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

  const min = Math.min(...hourlySpeeds);
  const max = Math.max(...hourlySpeeds);
  const range = Math.max(1e-6, max - min);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Forecast</Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>Hourly wind speed</Typography>

            {/* Wrapper measured for both sparkline and chips */}
            <Box ref={wrapRef} sx={{ width: '100%' }}>
              {/* Sparkline aligned to pills; uses wrapper width */}
              <Box sx={{ width: '100%', mb: 1 }}>
                <ForecastSparkline
                  values={hourlySpeeds}
                  width={sparkWidth}
                  height={64}
                  xPositions={xPositions}
                />
              </Box>

              {/* Hour "pills" - compact, informative, aligned with sparkline */}
              <Box
                sx={{
                  mt: 0.5,
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, minmax(0, 1fr))',
                    sm: 'repeat(3, 1fr)',
                    md: `repeat(${Math.min(MAX_HOURS, 12)}, 1fr)`, // single row on md+
                  },
                  gap: 1, // 8px (GRID_GAP)
                  alignItems: 'center',
                }}
              >
                {hourlyInfo.map((h) => {
                  const intensity = (h.speedValue - min) / range;
                  const bgAlpha = 0.08 + intensity * 0.18;
                  const borderAlpha = 0.15 + intensity * 0.3;

                  return (
                    <Tooltip
                      key={h.ts}
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WindDirection direction={h.direction} size={22} showLabel />
                          <Typography variant="caption">
                            {h.speed} at {h.label}
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
                            {h.hourOnly}
                          </Avatar>
                        }
                        label={
                          <>
                            <span>{h.speed}</span>
                            <span style={{ opacity: 0.8, fontWeight: 400, marginLeft: 8 }}>
                              {h.label}
                            </span>
                          </>
                        }
                      />
                    </Tooltip>
                  );
                })}
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" gutterBottom>Daily overview</Typography>
            <Stack spacing={1}>
              {daily.map((d) => (
                <Stack key={d.date} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 110 }}>{d.date}</Typography>
                  <Typography variant="body2">{d.avgWindSpeed.toFixed(1)} m/s</Typography>
                  <WindDirection direction={d.predominantDirection} showLabel />
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ForecastView;