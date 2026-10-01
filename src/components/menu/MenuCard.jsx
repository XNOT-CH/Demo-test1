import { BADGES } from '@/data/menu'
import { formatPrice } from '@/utils/format'
import './MenuCard.css'

export default function MenuCard({ item, index, onSelect }) {
  return (
    <li className="menu-card" style={{ '--stagger-index': index }}>
      <button type="button" className="menu-card__button" onClick={() => onSelect(item)}>
        <span className="menu-card__art" style={{ '--item-color': item.color }}>
          <span className="menu-card__emoji" aria-hidden="true">
            {item.emoji}
          </span>
          {item.badge && (
            <span className={`menu-card__badge menu-card__badge--${item.badge}`}>
              {BADGES[item.badge].label}
            </span>
          )}
        </span>
        <span className="menu-card__name">{item.name}</span>
        <span className="menu-card__description">{item.description}</span>
        <span className="menu-card__footer">
          <span className="menu-card__price">{formatPrice(item.price)}</span>
          <span className="menu-card__add-icon" aria-hidden="true">
            +
          </span>
        </span>
      </button>
    </li>
  )
}
