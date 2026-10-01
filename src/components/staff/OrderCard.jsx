import { ORDER_STATUS_META } from '@/constants/orderStatus'
import { ORDER_TYPE_META } from '@/constants/orderType'
import { formatPrice, formatTimeAgo } from '@/utils/format'
import './OrderCard.css'

export default function OrderCard({ order, now, isHighlighted, onAdvance }) {
  const statusMeta = ORDER_STATUS_META[order.status]
  const orderType = ORDER_TYPE_META[order.orderType]

  return (
    <li
      className={`order-card order-card--${order.status} ${isHighlighted ? 'order-card--highlighted' : ''}`}
    >
      <div className="order-card__header">
        <span className="order-card__queue">{order.queueNumber}</span>
        <div className="order-card__customer">
          <strong>{order.customerName}</strong>
          <small className="order-card__meta">
            {orderType.icon} {orderType.label} · {formatTimeAgo(order.createdAt, now)}
          </small>
        </div>
        <span className={`status-badge status-badge--${order.status}`}>
          {statusMeta.shortLabel}
        </span>
      </div>

      <ul className="order-card__items">
        {order.items.map((line) => (
          <li key={line.id} className="order-card__item">
            <span className="order-card__quantity">{line.quantity}×</span>
            <div>
              <strong className="order-card__item-name">{line.name}</strong>
              {line.options.length > 0 && (
                <small className="order-card__item-options">{line.options.join(' · ')}</small>
              )}
            </div>
          </li>
        ))}
      </ul>

      {order.note && <p className="order-card__note">📝 {order.note}</p>}

      <div className="order-card__footer">
        <span className="order-card__total">{formatPrice(order.total)}</span>
        {statusMeta.actionLabel && (
          <button
            type="button"
            className={`btn btn--sm order-card__action order-card__action--${order.status}`}
            onClick={() => onAdvance(order.id)}
          >
            {statusMeta.actionLabel} →
          </button>
        )}
      </div>
    </li>
  )
}
