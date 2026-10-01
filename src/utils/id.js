export function generateId() {
  // crypto.randomUUID is only available in secure contexts (https / localhost),
  // so fall back when the app is opened over the LAN (http://192.168.x.x).
  if (globalThis.crypto?.randomUUID) {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}
