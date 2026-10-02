export const ORDER_STATUS = Object.freeze({
  NEW: 'new',
  MAKING: 'making',
  READY: 'ready',
  DONE: 'done',
  CANCELLED: 'cancelled',
})

/** Order lifecycle, in sequence. Cancelled sits outside the flow. */
export const ORDER_STATUS_FLOW = [
  ORDER_STATUS.NEW,
  ORDER_STATUS.MAKING,
  ORDER_STATUS.READY,
  ORDER_STATUS.DONE,
]

export const ORDER_STATUS_META = {
  [ORDER_STATUS.NEW]: {
    label: 'รับออเดอร์แล้ว',
    shortLabel: 'ใหม่',
    actionLabel: 'เริ่มชง',
  },
  [ORDER_STATUS.MAKING]: {
    label: 'กำลังชงอยู่',
    shortLabel: 'กำลังชง',
    actionLabel: 'พร้อมเสิร์ฟ',
  },
  [ORDER_STATUS.READY]: {
    label: 'พร้อมรับแล้ว!',
    shortLabel: 'พร้อมรับ',
    actionLabel: 'ลูกค้ารับแล้ว',
  },
  [ORDER_STATUS.DONE]: {
    label: 'รับเรียบร้อย',
    shortLabel: 'เสร็จแล้ว',
    actionLabel: null,
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'ยกเลิกออเดอร์แล้ว',
    shortLabel: 'ยกเลิก',
    actionLabel: null,
  },
}

export function getNextStatus(status) {
  const index = ORDER_STATUS_FLOW.indexOf(status)
  if (index === -1) return null
  return ORDER_STATUS_FLOW[index + 1] ?? null
}

export function isActiveStatus(status) {
  return status !== ORDER_STATUS.DONE && status !== ORDER_STATUS.CANCELLED
}

/** Customers can cancel only until the barista starts making the order. */
export function canCancelOrder(status) {
  return status === ORDER_STATUS.NEW
}
