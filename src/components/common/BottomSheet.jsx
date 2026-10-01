import { useEffect, useState } from 'react'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import './BottomSheet.css'

const CLOSE_ANIMATION_MS = 320

/**
 * Modal sheet that slides up from the bottom.
 * Stays mounted until the close animation finishes.
 */
export default function BottomSheet({ isOpen, onClose, ariaLabel, children }) {
  const [isMounted, setIsMounted] = useState(isOpen)
  const [hasEntered, setHasEntered] = useState(false)

  // Mount immediately when opened (state adjusted during render, not in an effect).
  if (isOpen && !isMounted) {
    setIsMounted(true)
  }

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (isOpen) {
      // Wait two frames so the hidden state is painted before animating in.
      let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setHasEntered(true))
      })
      return () => cancelAnimationFrame(frame)
    }

    // Unmount after the slide-down animation has finished.
    const timer = setTimeout(() => {
      setIsMounted(false)
      setHasEntered(false)
    }, CLOSE_ANIMATION_MS)
    return () => clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isMounted) return null

  const isVisible = isOpen && hasEntered

  return (
    <div className={`bottom-sheet ${isVisible ? 'bottom-sheet--visible' : ''}`}>
      <div className="bottom-sheet__backdrop" onClick={onClose} />
      <div className="bottom-sheet__panel" role="dialog" aria-modal="true" aria-label={ariaLabel}>
        <div className="bottom-sheet__grabber" />
        {children}
      </div>
    </div>
  )
}
