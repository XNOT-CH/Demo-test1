import { ORDER_STATUS, canCancelOrder, getNextStatus } from '@/constants/orderStatus'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { getCartTotal } from '@/utils/cart'
import { formatQueueNumber, getDateKey } from '@/utils/format'
import { generateId } from '@/utils/id'
import { readJSON, removeItem, writeJSON } from '@/utils/storage'

/**
 * Order data layer.
 *
 * Demo implementation backed by localStorage — tabs on the same device stay in sync
 * through the `storage` event. To go multi-device, replace the internals of this file
 * with API / Supabase calls; the exported functions are the only contract the UI uses.
 *
 * @typedef {import('@/utils/cart').CartLine} CartLine
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} queueNumber   e.g. "A001", resets every day
 * @property {string} dateKey       YYYY-MM-DD
 * @property {string} customerName
 * @property {string} orderType     see ORDER_TYPE
 * @property {string} note
 * @property {CartLine[]} items
 * @property {number} total
 * @property {string} status        see ORDER_STATUS
 * @property {number} createdAt
 * @property {number} updatedAt
 */

const MAX_TRACKED_ORDERS = 10

/** @type {Order[]} */
let orders = readJSON(STORAGE_KEYS.ORDERS, [])
const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener())
}

function saveOrders(nextOrders) {
  orders = nextOrders
  writeJSON(STORAGE_KEYS.ORDERS, nextOrders)
  notify()
}

window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEYS.ORDERS) {
    orders = readJSON(STORAGE_KEYS.ORDERS, [])
    notify()
  }
})

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getOrders() {
  return orders
}

export function getMyOrderIds() {
  return readJSON(STORAGE_KEYS.MY_ORDER_IDS, [])
}

function rememberMyOrder(orderId) {
  const ids = [...getMyOrderIds(), orderId].slice(-MAX_TRACKED_ORDERS)
  writeJSON(STORAGE_KEYS.MY_ORDER_IDS, ids)
}

/**
 * @param {Object} input
 * @param {CartLine[]} input.items
 * @param {string} input.customerName
 * @param {string} input.orderType
 * @param {string} [input.note]
 * @param {boolean} [input.isMine=true]  Track it as the current customer's order.
 * @returns {Order}
 */
export function createOrder({ items, customerName, orderType, note = '', isMine = true }) {
  // Re-read storage so another tab's latest order is counted for the queue number.
  const latestOrders = readJSON(STORAGE_KEYS.ORDERS, orders)
  const dateKey = getDateKey()
  const sequence = latestOrders.filter((order) => order.dateKey === dateKey).length + 1
  const now = Date.now()

  const order = {
    id: generateId(),
    queueNumber: formatQueueNumber(sequence),
    dateKey,
    customerName: customerName.trim() || 'ลูกค้า',
    orderType,
    note: note.trim(),
    items,
    total: getCartTotal(items),
    status: ORDER_STATUS.NEW,
    createdAt: now,
    updatedAt: now,
  }

  saveOrders([...latestOrders, order])
  if (isMine) rememberMyOrder(order.id)
  return order
}

export function advanceOrderStatus(orderId) {
  const latestOrders = readJSON(STORAGE_KEYS.ORDERS, orders)
  saveOrders(
    latestOrders.map((order) => {
      const nextStatus = getNextStatus(order.status)
      if (order.id !== orderId || !nextStatus) return order
      return { ...order, status: nextStatus, updatedAt: Date.now() }
    }),
  )
}

/** Cancels the order if the barista hasn't started it yet (checked against the latest data). */
export function cancelOrder(orderId) {
  const latestOrders = readJSON(STORAGE_KEYS.ORDERS, orders)
  saveOrders(
    latestOrders.map((order) => {
      if (order.id !== orderId || !canCancelOrder(order.status)) return order
      return { ...order, status: ORDER_STATUS.CANCELLED, updatedAt: Date.now() }
    }),
  )
}

export function clearAllOrders() {
  saveOrders([])
  removeItem(STORAGE_KEYS.MY_ORDER_IDS)
}
