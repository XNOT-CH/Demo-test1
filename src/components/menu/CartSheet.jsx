import { useState } from 'react'
import QuantityStepper from '@/components/common/QuantityStepper'
import { ORDER_TYPE, ORDER_TYPE_META } from '@/constants/orderType'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { useCart } from '@/hooks/useCart'
import { getLineTotal } from '@/utils/cart'
import { formatPrice } from '@/utils/format'
import { readJSON, writeJSON } from '@/utils/storage'
import './CartSheet.css'

const SUBMIT_DELAY_MS = 450

/** Content of the cart bottom sheet: line items + checkout form. */
export default function CartSheet({ onCheckout }) {
  const { lines, totalPrice, changeQuantity } = useCart()
  const [customerName, setCustomerName] = useState(() => readJSON(STORAGE_KEYS.CUSTOMER_NAME, ''))
  const [orderType, setOrderType] = useState(ORDER_TYPE.DINE_IN)
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (lines.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">😿</div>
        <p>ตะกร้ายังว่างอยู่เลยเมี๊ยว</p>
      </div>
    )
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    writeJSON(STORAGE_KEYS.CUSTOMER_NAME, customerName.trim())
    // Short delay so the loading state is visible — replace with the real API call later.
    setTimeout(() => onCheckout({ customerName, orderType, note }), SUBMIT_DELAY_MS)
  }

  return (
    <form className="cart-sheet" onSubmit={handleSubmit}>
      <h2 className="cart-sheet__title">ตะกร้าของฉัน</h2>

      <ul className="cart-sheet__lines">
        {lines.map((line) => (
          <li key={line.id} className="cart-line">
            <span className="cart-line__thumb" style={{ '--item-color': line.color }}>
              {line.emoji}
            </span>
            <div className="cart-line__info">
              <strong className="cart-line__name">{line.name}</strong>
              {line.options.length > 0 && (
                <small className="cart-line__options">{line.options.join(' · ')}</small>
              )}
              <span className="cart-line__price">{formatPrice(getLineTotal(line))}</span>
            </div>
            <QuantityStepper
              size="sm"
              removable
              label={line.name}
              value={line.quantity}
              onDecrease={() => changeQuantity(line.id, -1)}
              onIncrease={() => changeQuantity(line.id, 1)}
            />
          </li>
        ))}
      </ul>

      <div className="segmented-control" role="radiogroup" aria-label="รูปแบบการรับ">
        {Object.values(ORDER_TYPE).map((type) => {
          const isSelected = orderType === type
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`segmented-control__option ${isSelected ? 'segmented-control__option--selected' : ''}`}
              onClick={() => setOrderType(type)}
            >
              {ORDER_TYPE_META[type].icon} {ORDER_TYPE_META[type].label}
            </button>
          )
        })}
      </div>

      <label className="form-field">
        <span>ชื่อเล่น (ไว้เรียกตอนเครื่องดื่มเสร็จ)</span>
        <input
          className="form-field__input"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          placeholder="เช่น ส้มโอ"
          maxLength={20}
          autoComplete="nickname"
        />
      </label>

      <label className="form-field">
        <span>หมายเหตุถึงบาริสต้า</span>
        <input
          className="form-field__input"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="เช่น ไม่ใส่หลอด"
          maxLength={80}
        />
      </label>

      <div className="cart-sheet__total">
        <span>ยอดรวม</span>
        <strong>{formatPrice(totalPrice)}</strong>
      </div>

      <button
        type="submit"
        className={`btn btn--primary btn--block ${isSubmitting ? 'btn--loading' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'กำลังส่งออเดอร์…' : 'ยืนยันสั่งเลย 🐾'}
      </button>
    </form>
  )
}
