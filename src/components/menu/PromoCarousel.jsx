import { useCallback, useEffect, useRef, useState } from 'react'
import { PROMOTION_TYPE } from '@/data/promotions'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import PromoImageSlide from './PromoImageSlide'
import PromoSlide from './PromoSlide'
import './PromoCarousel.css'

const AUTOPLAY_INTERVAL_MS = 4000
/** How long scroll events are ignored after a programmatic slide change. */
const PROGRAMMATIC_SCROLL_MS = 700

/**
 * Auto-playing, swipeable banner carousel.
 *
 * - Swiping uses native horizontal scroll + CSS scroll-snap (smooth on mobile).
 * - The autoplay timer *is* the progress bar's CSS animation: when it finishes we go to
 *   the next slide. Pausing simply pauses the animation, so the bar and timer stay in sync.
 * - Pauses while hovered, touched or keyboard-focused, and has a pause button.
 * - With "reduce motion" turned on, it still auto-plays but switches slides instantly
 *   instead of sliding.
 */
export default function PromoCarousel({ slides, onSelectItem, ariaLabel = 'เมนูแนะนำ' }) {
  const trackRef = useRef(null)
  const isProgrammaticScrollRef = useRef(false)
  const programmaticScrollTimerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false)
  const [isStoppedByUser, setIsStoppedByUser] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const hasMultipleSlides = slides.length > 1
  const isAutoplayEnabled = hasMultipleSlides && !isStoppedByUser
  const isTemporarilyPaused = isHovered || isTouching || hasKeyboardFocus

  const goTo = useCallback(
    (index) => {
      const track = trackRef.current
      const slide = track?.children[index]
      if (!slide) return

      // Update the dots right away and ignore scroll events until the scroll settles —
      // otherwise wrapping from the last slide back to the first flickers through
      // every slide in between.
      setActiveIndex(index)
      isProgrammaticScrollRef.current = true
      clearTimeout(programmaticScrollTimerRef.current)
      programmaticScrollTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false
      }, PROGRAMMATIC_SCROLL_MS)

      track.scrollTo({ left: slide.offsetLeft, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    },
    [prefersReducedMotion],
  )

  useEffect(() => () => clearTimeout(programmaticScrollTimerRef.current), [])

  const goToNext = () => goTo((activeIndex + 1) % slides.length)

  // When the user swipes, the active slide is whichever one is closest to the scroll position.
  function handleScroll() {
    if (isProgrammaticScrollRef.current) return
    const track = trackRef.current
    let closestIndex = 0
    let closestDistance = Infinity
    Array.from(track.children).forEach((child, index) => {
      const distance = Math.abs(child.offsetLeft - track.scrollLeft)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })
    setActiveIndex(closestIndex)
  }

  function handleFocus(event) {
    if (event.target.matches(':focus-visible')) setHasKeyboardFocus(true)
  }

  function handleBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) setHasKeyboardFocus(false)
  }

  function handleTouchStart() {
    // A swipe takes over from any slide change still animating.
    isProgrammaticScrollRef.current = false
    setIsTouching(true)
  }

  // Mouse only — on touch devices a tap fires pointerenter without a matching leave.
  function handlePointerEnter(event) {
    if (event.pointerType === 'mouse') setIsHovered(true)
  }

  function handlePointerLeave(event) {
    if (event.pointerType === 'mouse') setIsHovered(false)
  }

  const className = [
    'promo-carousel',
    isAutoplayEnabled && 'promo-carousel--autoplay',
    isTemporarilyPaused && 'promo-carousel--paused',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section
      className={className}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={() => setIsTouching(false)}
      onTouchCancel={() => setIsTouching(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div
        ref={trackRef}
        className="promo-carousel__track"
        onScroll={handleScroll}
        // Don't announce every automatic slide change to screen readers.
        aria-live={isAutoplayEnabled ? 'off' : 'polite'}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="promo-carousel__slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} จาก ${slides.length}`}
          >
            {slide.type === PROMOTION_TYPE.IMAGE ? (
              <PromoImageSlide
                slide={slide}
                isActive={index === activeIndex}
                isFirst={index === 0}
                onSelect={onSelectItem}
              />
            ) : (
              <PromoSlide slide={slide} isActive={index === activeIndex} onSelect={onSelectItem} />
            )}
          </div>
        ))}
      </div>

      {hasMultipleSlides && (
        <div className="promo-carousel__controls">
          <div className="promo-carousel__dots">
            {slides.map((slide, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={slide.id}
                  type="button"
                  className={`promo-carousel__dot ${isActive ? 'promo-carousel__dot--active' : ''}`}
                  aria-label={`ไปสไลด์ที่ ${index + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => goTo(index)}
                >
                  <span className="promo-carousel__dot-track">
                    {isActive && isAutoplayEnabled && (
                      <span
                        className="promo-carousel__dot-progress"
                        style={{ '--autoplay-duration': `${AUTOPLAY_INTERVAL_MS}ms` }}
                        onAnimationEnd={goToNext}
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="promo-carousel__toggle"
            onClick={() => setIsStoppedByUser((stopped) => !stopped)}
            aria-label={isStoppedByUser ? 'เล่นสไลด์อัตโนมัติ' : 'หยุดสไลด์อัตโนมัติ'}
          >
            {isStoppedByUser ? '▶' : '❚❚'}
          </button>
        </div>
      )}
    </section>
  )
}
