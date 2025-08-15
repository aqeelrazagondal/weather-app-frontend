# Weather Alert (Frontend)

A React + TypeScript application to monitor wind conditions for user-selected favourite locations. It integrates with a NestJS backend (v1 API) and demonstrates senior-level practices: clean architecture, data caching, rate-limit awareness, error boundaries, testing scaffold, and responsive UI.

## Quick Start (≤ 5 minutes)

1. Prerequisites
   - Node.js LTS
   - npm

2. Configure environment
   - Create `.env.development` at project root:
     ```
     REACT_APP_API_BASE_URL=http://localhost:3000/v1
     ```
     Adjust host/port if your backend differs.

3. Install dependencies
   ```
   npm install
   ```

4. Run the app
   ```
   npm start
   ```
   App runs at http://localhost:3001 (or the port CRA chooses). Backend should run at the API base URL from your `.env`.
- Frontend: http://localhost:3001 (CRA default)
- Backend: http://localhost:3000/v1 (per env)

5) Verify
- Open DevTools → Network
- Interactions should call endpoints like:
  - GET /v1/locations
  - GET /v1/location-search?query=...
  - GET /v1/weather/{lat},{lon}/forecast
- All requests include header: X-Client-Id: <uuid>

---

## Features Overview

- Favourites Management
  - Search with autocomplete, disambiguation (displayName, state, country, coords)
  - Add/remove favourites
  - Responsive grid (1/2/3 columns) with an intuitive empty state
  - LocalStorage mirror for instant reload + backend hydration

- Current Conditions
  - Per-favourite current snapshot derived from the new hourly forecast endpoint
  - Wind speed, direction indicator (cardinal + rotating arrow), temperature
  - Stable loading skeleton and error fallback

- Forecast View
  - Route: `/forecast?lat={lat}&lon={lon}&units={u}&granularity={g}&range={r}|days={d}`
  - Hourly: chips show hour + windSpeed (+ gust if present) and timeline sparkline
  - Daily: list shows avg wind speed, predominant direction (+ max gust)
  - Controls: Units (standard|metric|imperial), granularity (hourly|daily), range/days sliders
  - Preferences persisted in localStorage and synced to the URL

- UX/Styling
  - Dark modern theme with gradient AppBar and subtle card animations
  - Snackbars for add/remove confirmations (ToastProvider)
  - Layout with error boundary and accessible focus outlines

---

## Architecture

- React 19 + TypeScript
- MUI for UI
- React Query for server caching (wind/current/forecast)
- Redux Toolkit for favourites list (local + server merge)
- Axios API client (baseURL from env, X-Client-Id interceptor)

### Data Flow

- Client ID
  - Persistent UUID in localStorage
  - Sent as X-Client-Id for scoping favourites server-side
- Favourites
  - Source of truth: backend
  - Mirror: localStorage (fast first paint)
  - On load: fetch server favourites and merge with local mirror to preserve displayName/state/countryName/coords
- Current Weather
  - Built from the new hourly endpoint (smallest range=3) to avoid legacy `/weather/current`
- Forecast
  - New backend endpoint: `GET /v1/weather/{lat},{lon}/forecast`
  - Query: `units`, `granularity` (hourly/daily), `range` or `days` (validated client-side)
  - Hourly returns `windSpeed`, `windGust?`, `windDirectionDeg`, `windDirection` (16-point), `temperature`, `timestamp`
  - Daily returns `avgWindSpeed`, `predominantDirection`, `maxWindGust?`, `date`

### Project Structure (high-level)

---

## Features

- Favourite locations
  - Add via search autocomplete with disambiguation (displayName, state, country, coordinates)
  - Remove any time
  - Persisted across reloads and browser restarts (client ID stored in localStorage; server stores favourites keyed by client ID)
- Current weather summary (per favourite)
  - Wind speed (m/s), direction indicator (cardinal + rotating arrow), temperature
  - Lightweight, cached queries (React Query)
- Detailed forecast view
  - Hourly wind trends (SVG sparkline)
  - Daily summaries with predominant wind direction
- Robust UX
  - Error boundaries and graceful per-card fallbacks
  - Debounced location search
  - Snackbars for add/remove confirmations
  - Responsive layout (1/2/3 columns)
- Rate-limit aware: caching, sensible `staleTime`, minimal refetching

---

## Technology Stack

- React 19, TypeScript
- @mui/material for UI
- @tanstack/react-query for data fetching + caching
- Redux Toolkit for favourites state
- Axios for HTTP
- dayjs for date/time utilities (optional)
- Jest + React Testing Library (scaffolded)

---

## Architecture Overview

### High-Level Flow

- Client ID
  - `X-Client-Id` header is injected into every API request using a persistent ID in `localStorage`.
  - This enables the backend to associate favourites across reloads and browser restarts.

- Favourites
  - Source of truth: Backend
  - Local mirror: `localStorage` (fast initial paint)
  - Hydration: On Home load, app fetches `/locations` and merges results with locally cached favourites (preserves rich fields like `displayName`, `state`, `countryName`, and `coords`).
  - Redux Toolkit stores the list, provides duplicate prevention (by ID or 500m proximity).

- Search
  - Debounced GET `/location-search?query=` returns disambiguated results.
  - Selecting a result POSTs to `/locations`, normalizes the server response with selected metadata, and updates Redux.

- Current Weather (Card Summary)
  - Per-card GET `/weather/current?lat&lon` via React Query.
  - Tuned caching: `staleTime ~3m`, `retry: 1`, no refetch on window focus.
  - Displays wind speed, cardinal direction with rotating indicator, and temperature.

- Forecast View
  - GET `/weather/forecast?lat&lon`.
  - Renders hourly sparkline (SVG) and daily list with predominant direction.

### Caching and Rate Limit Strategy

- React Query tuning:
  - `staleTime` ensures data is reused across navigation and minimizes server hits.
  - `refetchOnWindowFocus: false` prevents silent refetch storms.
  - `gcTime` keeps cache warm for quick back/forward navigation.

- LocalStorage:
  - Mirrors favourites to show them instantly on reload (optimistic UX) while the server load resolves.

- Optional Batch (Backend)
  - If many favourites are common, add `/weather/current/batch` to reduce N calls to 1.
  - Frontend has a stub in `weatherService` to adopt this when backend supports it.

### Error Handling

- Global ErrorBoundary in layout catches unexpected UI errors.
- API errors show inline messages per component (e.g., per-card “Failed to load current conditions”).
- Snackbars confirm add/remove actions.

---

## Project Structure
src/ components/ common/    
        # ErrorBoundary, ToastProvider layout/ 
        # Header, Footer, Layout weather/ # LocationSearch, FavoriteCard, ForecastView, WindDirection, etc. hooks/ # useWeather (current + forecast) pages/ # HomePage, LocationDetailPage services/ # api, favoritesService, weatherService, locationService store/ # Redux store, slices, local persistence types/ # Weather types, API DTOs utils/ # session (client id), wind helpers, geo distance, locale flag config/ # theme, config

---

## API Endpoints (consumed)

- GET `/v1/locations` – list favourites for `X-Client-Id`
- POST `/v1/locations` – add favourite (payload: `{ name, latitude, longitude }`)
- DELETE `/v1/locations/{id}` – remove favourite
- GET `/v1/location-search?query=...` – location autocomplete (returns id, displayName, state, country, lat/lon, countryName)
- GET `/v1/weather/current?lat&lon` – current conditions
- GET `/v1/weather/forecast?lat&lon` – forecast (hourly + daily)

All requests include header: `X-Client-Id: <persistent-id>`

---

## Environment Configuration

- `.env.development`
  ```
  REACT_APP_API_BASE_URL=http://localhost:3000/v1
  ```
- `.env.production`
  ```
  REACT_APP_API_BASE_URL=https://<your-prod-domain>/v1
  ```

Note: Changing env values requires restarting the dev server.

---

## Scripts

- Start
  ```
  npm start
  ```
- Build
  ```
  npm run build
  ```
- Test
  ```
  npm test
  ```
- Lint/Format
  ```
  npm run lint
  npm run format
  ```

---

## Future Improvements

- Backend batch endpoints for current weather to reduce request volume.
- Authentication to enable cross-device favourites.
- PWA: full offline support and background sync for favourites.
- Add trend tooltips and zoom/pan in charts (if you adopt a chart library).
- Geolocation “use my location” shortcut.
- Advanced duplicate detection and conflict resolution if the same city is added via different sources.

---

## Security & Privacy

- No sensitive tokens are stored client-side. Client ID is a random UUID (non-PII) to scope favourites.
- CORS: Backend should allow `X-Client-Id` and the frontend origin(s).
- Input sanitization: search queries are encoded; server should validate/clean as well.

---

## Accessibility

- Uses semantic HTML via MUI components.
- Labels on inputs and clear error messages.
- Keyboard navigable Autocomplete and buttons.

---

## Testing

- Unit tests (to expand):
  - Utilities: `countryCodeToFlag`, `cardinalToDeg`, `distanceMeters`
  - Components: small rendering tests for `LocationSearch`, `FavoriteCard`, `ForecastView`
- Integration tests (to expand):
  - Add favourite → appears in grid → navigate to forecast → back → persists

---

## Contact

---

## API Integration

Base URL from env: `REACT_APP_API_BASE_URL` (defaults to `/v1` for proxy dev).

Requests include header:

Endpoints used:
- Favourites
  - GET `/v1/locations`
  - POST `/v1/locations` (payload: `{ name, latitude, longitude }`)
  - DELETE `/v1/locations/{id}`
- Location search
  - GET `/v1/location-search?query=<q>`
- Current/Forecast
  - NEW: GET `/v1/weather/{lat},{lon}/forecast?units=&granularity=&range=&days=`
    - Hourly: `granularity=hourly&range=3..120 (step 3)`
    - Daily: `granularity=daily&days=1..7`
  - Legacy (kept for LocationDetailPage): GET `/v1/weather/forecast?lat=&lon=`
    - Consider migrating to the new endpoint fully

Error handling:
- 400 → “Invalid parameters or location not supported”
- 429 → “Too many requests. Please try again shortly”
- Others → generic message with retry option

---

## Caching, Rate Limits, and Performance

- React Query
  - current: `staleTime ~3m`, `retry: 1`, `refetchOnWindowFocus: false`
  - forecast (new): `staleTime ~5–10m`, `retry: 1` except 429 → no retry
  - `gcTime` tuned for navigation friendliness
- Search
  - Debounced 300ms
- Optional server optimization
  - Batch current endpoint can be added server-side to reduce per-card calls if many favourites exist

---

## State & Persistence

- Redux (favourites slice)
  - Avoid duplicate adds by ID or proximity (Haversine distance <500m)
  - LocalStorage persistence (mirror) + merge on hydration (preserves rich metadata like displayName)
- Preferences
  - Units, granularity, range/days stored in localStorage
  - Synced to URL on ForecastPage

---

## Routing

- `/` (HomePage)
  - Search + favourites grid
  - Cards show current summary, “View forecast”, remove button
- `/location?lat=&lon=&name=` (legacy detail)
  - Current card + legacy ForecastView (consider migrating)
- `/forecast?lat=&lon=&units=&granularity=&range|days` (new ForecastPage)
  - Controls for units, granularity, range/days
  - WindForecastView for hourly/daily data

Header title “Weather Alert” navigates to home.

---

## Styling & Accessibility

- Dark theme, gradient app bar, subtle animations on cards (respects reduced motion)
- Accessible labels on controls, focus outlines via CssBaseline overrides
- Compact chips for hourly view with tooltips indicating direction/speed/time

---

