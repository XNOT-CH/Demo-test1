import { STORAGE_KEYS } from '@/constants/storageKeys'
import { CATEGORIES, CATEGORY_DEFAULTS, MENU_ITEMS } from '@/data/menu'
import { generateId } from '@/utils/id'
import { readJSON, writeJSON } from '@/utils/storage'

/**
 * Menu data layer.
 *
 * Built-in items come from `data/menu.js`; items added on the staff page are kept in
 * localStorage and listed after them. Like `orderService`, tabs on the same device stay
 * in sync through the `storage` event.
 *
 * @typedef {import('@/data/menu').MenuItem & { isCustom?: boolean }} MenuItem
 */

/** @type {MenuItem[]} */
let customItems = readJSON(STORAGE_KEYS.CUSTOM_MENU_ITEMS, [])
let menuItems = [...MENU_ITEMS, ...customItems]
const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener())
}

function setCustomItems(nextItems) {
  customItems = nextItems
  menuItems = [...MENU_ITEMS, ...nextItems]
}

function saveCustomItems(nextItems) {
  setCustomItems(nextItems)
  writeJSON(STORAGE_KEYS.CUSTOM_MENU_ITEMS, nextItems)
  notify()
}

window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEYS.CUSTOM_MENU_ITEMS) {
    setCustomItems(readJSON(STORAGE_KEYS.CUSTOM_MENU_ITEMS, []))
    notify()
  }
})

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getMenuItems() {
  return menuItems
}

/**
 * @param {Object} input
 * @param {string} input.name
 * @param {string} [input.description]
 * @param {number} input.price
 * @param {string} input.categoryId
 * @param {string} [input.emoji]   Falls back to the category icon.
 * @param {string} [input.image]   Photo as a data URL (see utils/image.js).
 * @param {string} [input.badge]   see BADGES
 * @returns {MenuItem}
 */
export function addMenuItem({
  name,
  description = '',
  price,
  categoryId,
  emoji = '',
  image,
  badge,
}) {
  const category = CATEGORIES.find((c) => c.id === categoryId)
  /** @type {MenuItem} */
  const item = {
    id: generateId(),
    categoryId,
    name: name.trim(),
    description: description.trim(),
    price,
    emoji: emoji.trim() || category.icon,
    ...CATEGORY_DEFAULTS[categoryId],
    ...(image && { image }),
    ...(badge && { badge }),
    isCustom: true,
  }
  saveCustomItems([...customItems, item])
  return item
}

/** Only items added on the staff page can be removed. */
export function removeMenuItem(itemId) {
  saveCustomItems(customItems.filter((item) => item.id !== itemId))
}
