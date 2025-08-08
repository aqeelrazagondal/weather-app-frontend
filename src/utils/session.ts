// Persistent client ID for favorites scoping (survives tab/browser close)
const LOCAL_KEY = 'weatherapp_client_id';
const LEGACY_SESSION_KEY = 'weatherapp_session_id';

function generateUuid(): string {
  // RFC4122-ish UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (typeof crypto !== 'undefined' && crypto.getRandomValues)
      ? crypto.getRandomValues(new Uint8Array(1))[0] % 16
      : Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create a persistent client ID.
 * - Migrates any existing sessionStorage ID to localStorage (one-time).
 * - Falls back gracefully if storage is unavailable.
 */
export function getSessionId(): string {
  try {
    // Migration: move legacy session-based id to localStorage
    const legacy = sessionStorage.getItem(LEGACY_SESSION_KEY);
    if (legacy) {
      localStorage.setItem(LOCAL_KEY, legacy);
      sessionStorage.removeItem(LEGACY_SESSION_KEY);
    }

    let cid = localStorage.getItem(LOCAL_KEY);
    if (!cid) {
      cid = generateUuid();
      localStorage.setItem(LOCAL_KEY, cid);
    }
    return cid;
  } catch {
    // If storage is not available, keep an in-memory id for this runtime
    // Note: This won’t survive a reload, but prevents crashes in strict envs.
    if (!(window as any).__memoryClientId) {
      (window as any).__memoryClientId = generateUuid();
    }
    return (window as any).__memoryClientId as string;
  }
}