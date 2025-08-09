import type { Units, Granularity } from '../types/windForecast';

const KEY = 'wind_prefs';

export interface WindPrefs {
  units: Units; // metric | imperial | standard
  granularity: Granularity; // hourly | daily
  range: number; // hours (hourly)
  days: number; // days (daily)
}

const defaults: WindPrefs = {
  units: 'metric',
  granularity: 'hourly',
  range: 24,
  days: 5,
};

export function loadWindPrefs(): WindPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function saveWindPrefs(p: Partial<WindPrefs>) {
  try {
    const merged = { ...loadWindPrefs(), ...p };
    localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }
}