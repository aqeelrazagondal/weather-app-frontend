import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import {loadWindPrefs, saveWindPrefs} from "../../utils/prefs";
import WindForecastView from "./WindForecastView";
import {useWindForecast} from "../../hooks/useWeather";
import ForecastControls, {ForecastControlsValue} from "./ForecastControls";

function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ForecastPage: React.FC = () => {
  const q = useQueryParams();
  const nav = useNavigate();

  const lat = Number(q.get('lat'));
  const lon = Number(q.get('lon'));
  const hasValidCoords = Number.isFinite(lat) && Number.isFinite(lon);

  const saved = loadWindPrefs();
  const [controls, setControls] = useState<ForecastControlsValue>({
    units: (q.get('units') as any) || saved.units,
    granularity: (q.get('granularity') as any) || saved.granularity,
    range: Number(q.get('range')) || saved.range,
    days: Number(q.get('days')) || saved.days,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('lat', String(lat));
    params.set('lon', String(lon));
    params.set('units', controls.units);
    params.set('granularity', controls.granularity);
    if (controls.granularity === 'hourly') params.set('range', String(controls.range));
    else params.set('days', String(controls.days));
    nav(`/forecast?${params.toString()}`, { replace: true });
    saveWindPrefs(controls);
  }, [controls, lat, lon, nav]);

  const { data, isLoading, isError, error } = useWindForecast(
    hasValidCoords ? lat : undefined,
    hasValidCoords ? lon : undefined,
    {
      units: controls.units,
      granularity: controls.granularity,
      range: controls.granularity === 'hourly' ? controls.range : undefined,
      days: controls.granularity === 'daily' ? controls.days : undefined,
    }
  );

  if (!hasValidCoords) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box color="error.main">Invalid coordinates. Go back and pick a location.</Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <ForecastControls value={controls} onChange={setControls} />
      <WindForecastView
        data={data}
        loading={isLoading}
        error={isError ? String((error as any)?.response?.status || (error as any)?.message) : null}
      />
    </Container>
  );
};

export default ForecastPage;