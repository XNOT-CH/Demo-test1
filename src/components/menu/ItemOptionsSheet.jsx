import { useState } from 'react'
import QuantityStepper from '@/components/common/QuantityStepper'
import { OPTION_GROUPS } from '@/data/menu'
import { createCartLine } from '@/utils/cart'
import { formatPrice } from '@/utils/format'
import { calculateUnitPrice, getDefaultSelections } from '@/utils/menu'
import './ItemOptionsSheet.css'

const MAX_QUANTITY = 20

/** Content of the bottom sheet for choosing options of a single menu item. */
export default function ItemOptionsSheet({ item, onAddToCart }) {
  const [selections, setSelections] = useState(() => getDefaultSelections(item))
  const [quantity, setQuantity] = useState(1)

  const unitPrice = calculateUnitPrice(item, selections)

  function selectChoice(groupKey, choiceIndex) {
    setSelections((current) => ({ ...current, [groupKey]: choiceIndex }))
  }

  return (
    <div className="item-options">
      <div className="item-options__hero" style={{ '--item-color': item.color }}>
        <span className="item-options__emoji" aria-hidden="true">
          {item.emoji}
        </span>
      </div>

      <div className="item-options__header">
        <div>
          <h2 className="item-options__title">{item.name}</h2>
          <p className="text-muted">{item.description}</p>
        </div>
        <span className="item-options__price">{formatPrice(item.price)}</span>
      </div>

      {item.optionGroups.map((groupKey) => {
        const group = OPTION_GROUPS[groupKey]
        return (
          <fieldset key={groupKey} className="option-group">
            <legend className="option-group__legend">{group.label}</legend>
            <div className="option-group__choices">
              {group.choices.map((choice, index) => {
                const isSelected = selections[groupKey] === index
                return (
                  <button
                    key={choice.label}
                    type="button"
                    className={`chip ${isSelected ? 'chip--selected' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => selectChoice(groupKey, index)}
                  >
                    {choice.icon && <span aria-hidden="true">{choice.icon}</span>}
                    {choice.label}
                    {choice.price > 0 && <small className="chip__extra">+{choice.price}</small>}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )
      })}

      <div className="item-options__footer">
        <QuantityStepper
          value={quantity}
          onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          onIncrease={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
        />
        <button
          type="button"
          className="btn btn--primary item-options__submit"
          onClick={() => onAddToCart(createCartLine(item, selections, quantity))}
        >
          ใส่ตะกร้า · {formatPrice(unitPrice * quantity)}
        </button>
      </div>
    </div>
  )
}
