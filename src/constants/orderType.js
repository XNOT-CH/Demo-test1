export const ORDER_TYPE = Object.freeze({
  DINE_IN: 'dine-in',
  TAKEAWAY: 'takeaway',
})

export const ORDER_TYPE_META = {
  [ORDER_TYPE.DINE_IN]: { label: 'ทานที่ร้าน', icon: '🪑' },
  [ORDER_TYPE.TAKEAWAY]: { label: 'กลับบ้าน', icon: '🛍️' },
}
