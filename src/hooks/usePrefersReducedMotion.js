import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback) {
  const mediaQuery = window.matchMedia(QUERY)
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

/** True when the user has asked the OS to minimise animations. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
