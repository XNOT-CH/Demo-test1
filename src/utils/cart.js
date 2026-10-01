import { calculateUnitPrice, getSelectedChoices } from '@/utils/menu'

/**
 * @typedef {Object} CartLine
 * @property {string} id         Same item + same options share one line.
 * @property {string} itemId
 * @property {string} name
 * @property {string} emoji
 * @property {string} color
 * @property {string[]} options  Human-readable option labels.
 * @property {number} unitPrice
 * @property {number} quantity
 */

/** @returns {CartLine} */
export function createCartLine(item, selections, quantity) {
  const options = getSelectedChoices(item, selections).map((choice) => choice.label)
  return {
    id: [item.id, ...options].join('|'),
    itemId: item.id,
    name: item.name,
    emoji: item.emoji,
    color: item.color,
    options,
    unitPrice: calculateUnitPrice(item, selections),
    quantity,
  }
}

export function getLineTotal(line) {
  return line.unitPrice * line.quantity
}

export function getCartTotal(lines) {
  return lines.reduce((sum, line) => sum + getLineTotal(line), 0)
}

export function getCartCount(lines) {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}
