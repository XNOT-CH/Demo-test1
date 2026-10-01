const priceFormatter = new Intl.NumberFormat('th-TH')

export function formatPrice(amount) {
  return `฿${priceFormatter.format(amount)}`
}

export function formatQueueNumber(sequence) {
  return `A${String(sequence).padStart(3, '0')}`
}

export function formatTimeAgo(timestamp, now = Date.now()) {
  const minutes = Math.floor((now - timestamp) / 60_000)
  if (minutes < 1) return 'เมื่อสักครู่'
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`
  return `${Math.floor(minutes / 60)} ชม.ที่แล้ว`
}

/** Local-date key (YYYY-MM-DD) used to group orders by business day. */
export function getDateKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
