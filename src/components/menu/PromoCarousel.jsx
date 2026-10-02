import { useCallback, useEffect, useRef, useState } from 'react'
import { PROMOTION_TYPE } from '@/data/promotions'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import PromoImageSlide from './PromoImageSlide'
import PromoSlide from './PromoSlide'
import './PromoCarousel.css'

const AUTOPLAY_INTERVAL_MS = 4000
/** How long scroll events are ignored after a programmatic slide change. */
const PROGRAMMATIC_SCROLL_MS = 700
/** No scroll events for this long means the scroll (including momentum) has finished. */
const SCROLL_SETTLE_MS = 150

/** Index of the track child closest to the current scroll position. */
function getClosestIndex(track) {
  let closestIndex = 0
  let closestDistance = Infinity
  Array.from(track.children).forEach((child, index) => {
    const distance = Math.abs(child.offsetLeft - track.scrollLeft)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })
  return closestIndex
}

/**
 * Auto-playing, swipeable banner carousel that loops forever.
 *
 * - Swiping uses native horizontal scroll + CSS scroll-snap (smooth on mobile).
 * - The autoplay timer *is* the progress bar's CSS animation: when it finishes we go to
 *   the next slide. Pausing simply pauses the animation, so the bar and timer stay in sync.
 * - Seamless loop: a copy of the first slide sits after the last one. Going past the last
 *   slide scrolls forward onto the copy, then jumps back to the real first slide. The two
 *   look identical, so the jump can't be seen and the carousel never rewinds.
 * - Pauses only while touched (so autoplay doesn't fight a swipe) or keyboard-focused.
 * - With "reduce motion" turned on, it still auto-plays but switches slides instantly
 *   instead of sliding.
 */
export default function PromoCarousel({ slides, onSelectItem, ariaLabel = 'เมนูแนะนำ' }) {
  const trackRef = useRef(null)
  const isProgrammaticScrollRef = useRef(false)
  const programmaticScrollTimerRef = useRef(null)
  const scrollSettleTimerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTouching, setIsTouching] = useState(false)
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const hasMultipleSlides = slides.length > 1
  const isAutoplayEnabled = hasMultipleSlides
  const isTemporarilyPaused = isTouching || hasKeyboardFocus
  // Track index of the copy of the first slide (only rendered when there's something to loop).
  const loopCopyIndex = slides.length
  const trackSlides = hasMultipleSlides ? [...slides, slides[0]] : slides

  /** @param {number} trackIndex  may be `loopCopyIndex` to continue forward past the last slide */
  const goTo = useCallback(
    (trackIndex) => {
      const track = trackRef.current
      const slide = track?.children[trackIndex]
      if (!slide) return

      // Still resting on the copy of the first slide? Hop to the real one first so we
      // scroll the short way instead of rewinding through every slide.
      if (getClosestIndex(track) === loopCopyIndex && trackIndex !== loopCopyIndex) {
        track.scrollLeft = track.children[0].offsetLeft
      }

      // Update the dots right away and ignore scroll events until the scroll settles —
      // otherwise jumping to a far-away dot flickers through every slide in between.
      setActiveIndex(trackIndex % slides.length)
      isProgrammaticScrollRef.current = true
      clearTimeout(programmaticScrollTimerRef.current)
      programmaticScrollTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false
      }, PROGRAMMATIC_SCROLL_MS)

      track.scrollTo({ left: slide.offsetLeft, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    },
    [prefersReducedMotion, loopCopyIndex, slides.length],
  )

  useEffect(
    () => () => {
      clearTimeout(programmaticScrollTimerRef.current)
      clearTimeout(scrollSettleTimerRef.current)
    },
    [],
  )

  // From the last slide, "next" is the copy of the first one.
  const goToNext = () => goTo(activeIndex + 1)

  function handleScroll() {
    clearTimeout(scrollSettleTimerRef.current)
    scrollSettleTimerRef.current = setTimeout(handleScrollSettled, SCROLL_SETTLE_MS)

    // When the user swipes, the active slide is whichever one is closest to the scroll position.
    if (isProgrammaticScrollRef.current) return
    setActiveIndex(getClosestIndex(trackRef.current) % slides.length)
  }

  function handleScrollSettled() {
    const track = trackRef.current
    if (!track || getClosestIndex(track) !== loopCopyIndex) return
    // Landed on the copy of the first slide: jump to the real one. Setting scrollLeft is
    // instant, and both slides look (and animate) the same, so the jump is invisible.
    track.scrollLeft = track.children[0].offsetLeft
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
        {trackSlides.map((slide, trackIndex) => {
          const isLoopCopy = trackIndex === loopCopyIndex
          // The copy is "active" together with the first slide so their animations stay in sync.
          const isActive = trackIndex % slides.length === activeIndex
          return (
            <div
              key={isLoopCopy ? `${slide.id}-loop-copy` : slide.id}
              className="promo-carousel__slide"
              role={isLoopCopy ? undefined : 'group'}
              aria-roledescription={isLoopCopy ? undefined : 'slide'}
              aria-label={isLoopCopy ? undefined : `${trackIndex + 1} จาก ${slides.length}`}
              aria-hidden={isLoopCopy || undefined}
              inert={isLoopCopy || undefined}
            >
              {slide.type === PROMOTION_TYPE.IMAGE ? (
                <PromoImageSlide
                  slide={slide}
                  isActive={isActive}
                  isFirst={trackIndex === 0}
                  onSelect={onSelectItem}
                />
              ) : (
                <PromoSlide slide={slide} isActive={isActive} onSelect={onSelectItem} />
              )}
            </div>
          )
        })}
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
        </div>
      )}
    </section>
  )
}
