import { BADGES } from '@/data/menu'
import './PromoSlide.css'

const DEFAULT_CTA_LABEL = 'สั่งเลย'

/**
 * A single promo banner. Rendered as one big button, so only phrasing
 * elements (span) are used inside it.
 */
export default function PromoSlide({ slide, isActive, onSelect }) {
  const { item } = slide

  return (
    <button
      type="button"
      className={`promo-slide ${isActive ? 'promo-slide--active' : ''}`}
      style={{ '--slide-color': slide.color }}
      onClick={() => onSelect(item)}
      // Only the visible slide is tabbable; the dots handle keyboard navigation.
      tabIndex={isActive ? 0 : -1}
    >
      <span className="promo-slide__content">
        <span className="pill pill--accent promo-slide__label">{slide.label}</span>
        <span className="promo-slide__title">{item.name}</span>
        <span className="promo-slide__description">
          {item.description} · {item.price} บาท
        </span>
        <span className="promo-slide__actions">
          <span className="btn btn--primary btn--sm">{slide.ctaLabel ?? DEFAULT_CTA_LABEL}</span>
          {item.badge && (
            <span className="pill pill--accent promo-slide__badge">{BADGES[item.badge].label}</span>
          )}
        </span>
      </span>
      <span className="promo-slide__emoji" aria-hidden="true">
        {item.emoji}
      </span>
    </button>
  )
}
