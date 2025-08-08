import axios from 'axios';
import { config } from '../config/config';
import { getSessionId } from '../utils/session';

// Normalize base URL to avoid accidental trailing slashes
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

const api = axios.create({
  baseURL: normalizeBaseUrl(config.api.baseUrl), // e.g., http://localhost:3000/v1
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (cfg) => {
    // Persistent client ID so backend can retrieve favorites even after tab/browser close
    const clientId = getSessionId();
    cfg.headers = cfg.headers ?? {};
    cfg.headers['X-Client-Id'] = clientId;
    return cfg;
  },
  (error) => Promise.reject(error)
);

export default api;