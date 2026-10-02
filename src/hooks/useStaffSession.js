import { useSyncExternalStore } from 'react'
import { getSession, subscribe } from '@/services/authService'

/** The signed-in staff member, or null. */
export function useStaffSession() {
  return useSyncExternalStore(subscribe, getSession)
}
