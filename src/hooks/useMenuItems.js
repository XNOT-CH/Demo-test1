import { useSyncExternalStore } from 'react'
import { getMenuItems, subscribe } from '@/services/menuService'

/** Built-in + staff-added menu items, re-rendering whenever they change. */
export function useMenuItems() {
  return useSyncExternalStore(subscribe, getMenuItems)
}
