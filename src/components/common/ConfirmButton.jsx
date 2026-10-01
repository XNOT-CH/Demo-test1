import { useEffect, useRef, useState } from 'react'

const RESET_AFTER_MS = 3000

/**
 * Two-tap confirmation for destructive actions — avoids a blocking `window.confirm`.
 * First tap arms the button, second tap (within 3s) runs `onConfirm`.
 */
export default function ConfirmButton({
  onConfirm,
  children,
  confirmLabel = 'กดอีกครั้งเพื่อยืนยัน',
}) {
  const [isArmed, setIsArmed] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function handleClick() {
    clearTimeout(timerRef.current)
    if (isArmed) {
      setIsArmed(false)
      onConfirm()
      return
    }
    setIsArmed(true)
    timerRef.current = setTimeout(() => setIsArmed(false), RESET_AFTER_MS)
  }

  return (
    <button
      type="button"
      className={`link-btn link-btn--danger ${isArmed ? 'link-btn--armed' : ''}`}
      onClick={handleClick}
    >
      {isArmed ? confirmLabel : children}
    </button>
  )
}
