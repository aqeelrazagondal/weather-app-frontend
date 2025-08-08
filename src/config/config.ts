export const config = {
  api: {
    // Reads from env; falls back to "/v1" if not set (useful with a dev proxy)
    baseUrl: process.env.REACT_APP_API_BASE_URL || '/v1',
  },
  cache: {
    ttl: 1800000,
    maxSize: 100,
  },
};