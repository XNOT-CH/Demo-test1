import { ORDER_STATUS, isActiveStatus } from '@/constants/orderStatus'
import { getDateKey } from '@/utils/format'

export function getTodayOrders(orders) {
  const today = getDateKey()
  return orders.filter((order) => order.dateKey === today)
}

/** Number of orders placed earlier the same day that are still waiting or in progress. */
export function countOrdersAhead(orders, target) {
  return orders.filter(
    (order) =>
      order.dateKey === target.dateKey &&
      order.createdAt < target.createdAt &&
      (order.status === ORDER_STATUS.NEW || order.status === ORDER_STATUS.MAKING),
  ).length
}

export function countByStatus(orders) {
  const counts = { active: 0, new: 0, making: 0, ready: 0, done: 0, cancelled: 0 }
  for (const order of orders) {
    counts[order.status] += 1
    if (isActiveStatus(order.status)) counts.active += 1
  }
  return counts
}

export function getSalesTotal(orders) {
  return orders
    .filter((order) => order.status !== ORDER_STATUS.CANCELLED)
    .reduce((sum, order) => sum + order.total, 0)
}
