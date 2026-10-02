import { useEffect, useRef, useState } from 'react'

const HIGHLIGHT_DURATION_MS = 4000

/**
 * Detects orders that arrive after the component mounted.
 * Returns the ids to highlight.
 */
export function useNewOrderAlert(orders) {
  const seenIdsRef = useRef(null)
  const [highlightedIds, setHighlightedIds] = useState(() => new Set())
  const timersRef = useRef([])

  useEffect(() => {
    const ids = orders.map((order) => order.id)

    // First run: everything already on screen counts as "seen".
    if (seenIdsRef.current === null) {
      seenIdsRef.current = new Set(ids)
      return
    }

    const newIds = ids.filter((id) => !seenIdsRef.current.has(id))
    if (newIds.length === 0) return

    newIds.forEach((id) => seenIdsRef.current.add(id))
    setHighlightedIds((current) => new Set([...current, ...newIds]))

    const timer = setTimeout(() => {
      setHighlightedIds((current) => new Set([...current].filter((id) => !newIds.includes(id))))
    }, HIGHLIGHT_DURATION_MS)
    timersRef.current.push(timer)
  }, [orders])

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach(clearTimeout)
  }, [])

  return highlightedIds
}
