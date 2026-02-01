// Simple autosave utility with TTL and toggle
const AUTO_SAVE_KEY = 'autoSaveEnabled';

export const isAutoSaveEnabled = (): boolean => {
  try {
    const v = localStorage.getItem(AUTO_SAVE_KEY);
    if (v === null) return true; // default ON
    return v === 'true';
  } catch (e) {
    return true;
  }
};

export const setAutoSaveEnabled = (enabled: boolean) => {
  try {
    localStorage.setItem(AUTO_SAVE_KEY, enabled ? 'true' : 'false');
  } catch (e) {
    // ignore
  }
};

export const setWithTTL = (key: string, value: any, ttlMs: number) => {
  try {
    const payload = { ts: Date.now(), ttl: ttlMs, v: value };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    // ignore
  }
};

export const getWithTTL = (key: string) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.ts || !parsed.ttl) return parsed.v || null;
    if (Date.now() - parsed.ts > parsed.ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.v;
  } catch (e) {
    return null;
  }
};

export default { isAutoSaveEnabled, setAutoSaveEnabled, setWithTTL, getWithTTL };
