// Safe wrappers around localStorage / sessionStorage.
// Storage can be unavailable (private mode, blocked cookies) or hold corrupted
// data from an older version of the app — neither should ever crash the UI.

function getStore(kind) {
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function readJSON(key, fallback, kind = "local") {
  const store = getStore(kind);
  if (!store) return fallback;
  try {
    const raw = store.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value, kind = "local") {
  const store = getStore(kind);
  if (!store) return;
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage blocked — the app keeps working in memory.
  }
}

export function removeKey(key, kind = "local") {
  const store = getStore(kind);
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    // ignore
  }
}
