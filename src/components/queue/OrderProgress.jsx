import { ORDER_STATUS, ORDER_STATUS_FLOW, ORDER_STATUS_META } from '@/constants/orderStatus'
import './OrderProgress.css'

// "Done" isn't shown as its own step — it's the state after "ready".
const VISIBLE_STEPS = ORDER_STATUS_FLOW.filter((status) => status !== ORDER_STATUS.DONE)

export default function OrderProgress({ status }) {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(status)
  const progress = Math.min(currentIndex, VISIBLE_STEPS.length - 1) / (VISIBLE_STEPS.length - 1)

  return (
    <ol className="order-progress" style={{ '--progress': progress }}>
      {VISIBLE_STEPS.map((step, index) => {
        const isReached = index <= currentIndex
        const isPassed = index < currentIndex
        return (
          <li
            key={step}
            className={`order-progress__step ${isReached ? 'order-progress__step--reached' : ''}`}
            aria-current={index === currentIndex ? 'step' : undefined}
          >
            <span className="order-progress__dot">{isPassed ? '✓' : index + 1}</span>
            <span>{ORDER_STATUS_META[step].shortLabel}</span>
          </li>
        )
      })}
    </ol>
  )
}
