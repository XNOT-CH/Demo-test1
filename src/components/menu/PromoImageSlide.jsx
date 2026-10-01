import { useState } from 'react'
import './PromoImageSlide.css'

/**
 * Full-bleed banner image slide.
 * Clickable only when the promotion links to a menu item; falls back to the
 * alt text if the image fails to load.
 */
export default function PromoImageSlide({ slide, isActive, isFirst, onSelect }) {
  const [hasError, setHasError] = useState(false)
  const className = `promo-image-slide ${isActive ? 'promo-image-slide--active' : ''}`

  const content = hasError ? (
    <span className="promo-image-slide__fallback">
      <span aria-hidden="true">🐾</span>
      {slide.alt}
    </span>
  ) : (
    <img
      className="promo-image-slide__image"
      src={slide.image}
      alt={slide.alt}
      width={slide.width}
      height={slide.height}
      // Load every banner up front (they're small) so autoplay never lands on a blank
      // slide, but let the first, visible one win the bandwidth race.
      loading="eager"
      fetchPriority={isFirst ? 'high' : 'low'}
      decoding="async"
      draggable={false}
      onError={() => setHasError(true)}
    />
  )

  if (!slide.item) {
    return <div className={className}>{content}</div>
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => onSelect(slide.item)}
      tabIndex={isActive ? 0 : -1}
    >
      {content}
    </button>
  )
}
