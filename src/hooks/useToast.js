import { useCallback, useEffect, useRef, useState } from 'react'

export function useToast(durationMs = 1800) {
  const [message, setMessage] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback(
    (text) => {
      clearTimeout(timerRef.current)
      setMessage(text)
      timerRef.current = setTimeout(() => setMessage(null), durationMs)
    },
    [durationMs],
  )

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return { message, showToast }
}
