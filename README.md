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

5. Verify connectivity
   - Open DevTools → Network
   - Trigger a search or load the home page
   - You should see `/v1/locations` and `/v1/location-search` requests including the `X-Client-Id` header.

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
