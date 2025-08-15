import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Stack, Box, useTheme } from '@mui/material';
import type { WindForecastResponse } from '../../types/windForecast';
import WindDirection from './WindDirection';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
} from 'recharts';

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
  const theme = useTheme();
  const unit = unitLabel(data?.units ?? 'metric');
  const hourlyData = useMemo(() => {
    if (!data || data.granularity !== 'hourly') return [] as Array<{ t: string; speed: number; gust: number | null; dir: any }>;
    return data.hourly.map(h => {
      const ts = h.timestamp > 1e12 ? h.timestamp : h.timestamp * 1000;
      const time = new Date(ts);
      const label = time.toLocaleTimeString([], { hour: '2-digit' });
      return {
        t: label,
        speed: h.windSpeed,
        gust: typeof h.windGust === 'number' ? h.windGust : null,
        dir: h.windDirection,
      };
    });
  }, [data]);
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
    const axisColor = theme.palette.text.secondary;
    const gridColor = 'rgba(148,163,184,0.16)';
    const lineColor = theme.palette.primary.main;
    const gustColor = 'rgba(148,163,184,0.8)';

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Forecast • Hourly</Typography>
          <Box sx={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={hourlyData} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="windArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={lineColor} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="t" tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={{ stroke: gridColor }} interval={Math.ceil(hourlyData.length / 6)} />
                <YAxis tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={{ stroke: gridColor }} width={36} allowDecimals={false} />
                <RTooltip
                  cursor={{ stroke: 'rgba(148,163,184,0.25)' }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const p = payload[0].payload as any;
                    return (
                      <Box sx={{ p: 1, border: '1px solid var(--border-color)', bgcolor: '#111827', borderRadius: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <WindDirection direction={p.dir as any} />
                          <Typography variant="caption">{label}: {p.speed.toFixed(1)} {unit}{p.gust ? ` (gust ${p.gust.toFixed(1)} ${unit})` : ''}</Typography>
                        </Stack>
                      </Box>
                    );
                  }}
                />
                <Area type="monotone" dataKey="speed" stroke={lineColor} fill="url(#windArea)" strokeWidth={2}
                  dot={false} />
                <Line type="monotone" dataKey="gust" stroke={gustColor} strokeDasharray="4 4" dot={false} connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const axisColor = theme.palette.text.secondary;
  const gridColor = 'rgba(148,163,184,0.16)';
  const lineColor = theme.palette.primary.main;
  const gustColor = 'rgba(148,163,184,0.8)';
  const dailyData = data.daily.map(d => ({
    d: d.date,
    avg: d.avgWindSpeed,
    gust: typeof d.maxWindGust === 'number' ? d.maxWindGust : null,
    dir: d.predominantDirection,
  }));
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Forecast • Daily</Typography>
        <Box sx={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={dailyData} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="d" tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={{ stroke: gridColor }} interval={0} />
              <YAxis tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={{ stroke: gridColor }} width={36} allowDecimals={false} />
              <RTooltip
                cursor={{ stroke: 'rgba(148,163,184,0.25)' }}
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const p = payload[0].payload as any;
                  return (
                    <Box sx={{ p: 1, border: '1px solid var(--border-color)', bgcolor: '#111827', borderRadius: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WindDirection direction={p.dir as any} />
                        <Typography variant="caption">{label}: {p.avg.toFixed(1)} {unit}{p.gust ? ` (gust ${p.gust.toFixed(1)} ${unit})` : ''}</Typography>
                      </Stack>
                    </Box>
                  );
                }}
              />
              <Line type="monotone" dataKey="avg" stroke={lineColor} strokeWidth={2} dot={{ r: 2, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="gust" stroke={gustColor} strokeDasharray="4 4" dot={false} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WindForecastView;