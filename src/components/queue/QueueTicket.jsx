import { ORDER_STATUS, ORDER_STATUS_META } from '@/constants/orderStatus'
import { ORDER_TYPE_META } from '@/constants/orderType'
import OrderProgress from './OrderProgress'
import './QueueTicket.css'

const STATUS_MOOD = {
  [ORDER_STATUS.NEW]: '😺',
  [ORDER_STATUS.MAKING]: '🐱',
  [ORDER_STATUS.READY]: '😻',
  [ORDER_STATUS.DONE]: '😸',
  [ORDER_STATUS.CANCELLED]: '😿',
}

function getStatusMessage(status, ordersAhead) {
  switch (status) {
    case ORDER_STATUS.NEW:
      return ordersAhead > 0 ? `มีอีก ${ordersAhead} คิวก่อนหน้าคุณ` : 'คิวถัดไปคือคุณเลย!'
    case ORDER_STATUS.MAKING:
      return 'บาริสต้าแมวกำลังชงให้อยู่นะ~'
    case ORDER_STATUS.READY:
      return 'มารับที่เคาน์เตอร์ได้เลย 🔔'
    case ORDER_STATUS.CANCELLED:
      return 'เปลี่ยนใจเมื่อไหร่ สั่งใหม่ได้เลยนะเมี๊ยว'
    default:
      return 'ขอบคุณที่มาอุดหนุนนะเมี๊ยว'
  }
}

export default function QueueTicket({ order, ordersAhead }) {
  return (
    <section className={`queue-ticket queue-ticket--${order.status}`} aria-live="polite">
      <p className="queue-ticket__label">เลขคิวของคุณ</p>
      <div className="queue-ticket__number">{order.queueNumber}</div>
      <p className="queue-ticket__customer">
        คุณ{order.customerName} · {ORDER_TYPE_META[order.orderType].label}
      </p>

      <div className="queue-ticket__divider" aria-hidden="true" />

      <div className="queue-ticket__status">
        <span key={order.status} className="queue-ticket__mood" aria-hidden="true">
          {STATUS_MOOD[order.status]}
        </span>
        <strong className="queue-ticket__status-title">
          {ORDER_STATUS_META[order.status].label}
        </strong>
        <p className="text-muted">{getStatusMessage(order.status, ordersAhead)}</p>
      </div>

      {order.status !== ORDER_STATUS.CANCELLED && <OrderProgress status={order.status} />}
    </section>
  )
}
