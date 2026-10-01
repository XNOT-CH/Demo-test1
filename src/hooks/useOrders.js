import { useSyncExternalStore } from 'react'
import { isActiveStatus } from '@/constants/orderStatus'
import { getMyOrderIds, getOrders, subscribe } from '@/services/orderService'

/** All orders, re-rendering whenever they change (including from other tabs). */
export function useOrders() {
  return useSyncExternalStore(subscribe, getOrders)
}

export function useOrder(orderId) {
  const orders = useOrders()
  return orders.find((order) => order.id === orderId)
}

/** The latest order placed from this browser that hasn't been picked up yet. */
export function useMyActiveOrder() {
  const orders = useOrders()
  const myOrderIds = getMyOrderIds()
  return orders.findLast((order) => myOrderIds.includes(order.id) && isActiveStatus(order.status))
}
