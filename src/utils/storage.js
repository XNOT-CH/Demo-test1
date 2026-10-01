// localStorage can throw (private mode, quota exceeded, blocked cookies),
// so every access goes through these safe wrappers.

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore: the app keeps working in memory for this tab.
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore
  }
}
