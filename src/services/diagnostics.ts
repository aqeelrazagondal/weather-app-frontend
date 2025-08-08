import api from './api';

export async function checkApiConnectivity() {
  try {
    // Try listing favorites to confirm base URL + headers work
    const res = await api.get('/locations');
    return {
      ok: true,
      status: res.status,
      count: Array.isArray(res.data) ? res.data.length : undefined,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: err?.response?.status,
      message: err?.response?.data ?? err?.message,
    };
  }
}