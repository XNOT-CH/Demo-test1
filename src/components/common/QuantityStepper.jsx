import './QuantityStepper.css'

/**
 * − value + control.
 * When `removable` is true, the decrease button shows a bin icon at quantity 1.
 */
export default function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  size = 'md',
  removable = false,
  label = 'จำนวน',
}) {
  const showRemove = removable && value === 1

  return (
    <div className={`quantity-stepper quantity-stepper--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="quantity-stepper__button"
        onClick={onDecrease}
        aria-label={showRemove ? `ลบ ${label}` : `ลด ${label}`}
      >
        {showRemove ? '🗑' : '−'}
      </button>
      {/* key forces a re-mount so the number animates on every change */}
      <span key={value} className="quantity-stepper__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="quantity-stepper__button"
        onClick={onIncrease}
        aria-label={`เพิ่ม ${label}`}
      >
        +
      </button>
    </div>
  )
}
