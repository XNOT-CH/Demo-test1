import { STORAGE_KEYS } from '@/constants/storageKeys'
import { STAFF_ACCOUNTS } from '@/data/staffAccounts'
import { readJSON, removeItem, writeJSON } from '@/utils/storage'

/**
 * Staff sign-in (demo, client-side only — see `data/staffAccounts.js`).
 * The session is kept in localStorage and synced across tabs like the other services.
 *
 * @typedef {Object} StaffSession
 * @property {string} username
 * @property {string} displayName
 * @property {number} signedInAt
 */

/** @type {StaffSession | null} */
let session = readJSON(STORAGE_KEYS.STAFF_SESSION, null)
const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener())
}

window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEYS.STAFF_SESSION) {
    session = readJSON(STORAGE_KEYS.STAFF_SESSION, null)
    notify()
  }
})

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSession() {
  return session
}

/** @returns {StaffSession | null} null when the username or password is wrong */
export function signIn(username, password) {
  const account = STAFF_ACCOUNTS.find(
    (candidate) =>
      candidate.username === username.trim().toLowerCase() && candidate.password === password,
  )
  if (!account) return null

  session = { username: account.username, displayName: account.displayName, signedInAt: Date.now() }
  writeJSON(STORAGE_KEYS.STAFF_SESSION, session)
  notify()
  return session
}

export function signOut() {
  session = null
  removeItem(STORAGE_KEYS.STAFF_SESSION)
  notify()
}
