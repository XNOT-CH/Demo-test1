import { getLineTotal } from '@/utils/cart'
import { formatPrice } from '@/utils/format'
import './OrderSummary.css'

export default function OrderSummary({ order }) {
  return (
    <section className="order-summary">
      <h3 className="order-summary__title">รายการที่สั่ง</h3>
      <ul>
        {order.items.map((line) => (
          <li key={line.id} className="order-summary__line">
            <span>
              {line.emoji} {line.name} ×{line.quantity}
              {line.options.length > 0 && (
                <small className="text-muted"> — {line.options.join(' · ')}</small>
              )}
            </span>
            <span>{formatPrice(getLineTotal(line))}</span>
          </li>
        ))}
      </ul>
      {order.note && <p className="order-summary__note">📝 {order.note}</p>}
      <div className="order-summary__total">
        <span>ยอดรวม</span>
        <strong>{formatPrice(order.total)}</strong>
      </div>
    </section>
  )
}
