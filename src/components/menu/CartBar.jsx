import { formatPrice } from '@/utils/format'
import './CartBar.css'

/** Floating bar at the bottom of the menu, visible when the cart has items. */
export default function CartBar({ totalQuantity, totalPrice, addCount, onOpen }) {
  const isVisible = totalQuantity > 0

  return (
    <div className={`cart-bar ${isVisible ? 'cart-bar--visible' : ''}`} aria-hidden={!isVisible}>
      <button
        type="button"
        className="cart-bar__button"
        onClick={onOpen}
        tabIndex={isVisible ? 0 : -1}
      >
        {/* key changes on every add → replays the bump animation */}
        <span key={addCount} className="cart-bar__icon" aria-hidden="true">
          🛒<span className="cart-bar__count">{totalQuantity}</span>
        </span>
        <span className="cart-bar__label">ดูตะกร้า</span>
        <strong className="cart-bar__total">{formatPrice(totalPrice)}</strong>
      </button>
    </div>
  )
}
