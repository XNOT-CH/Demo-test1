import { BADGES, MENU_ITEMS, OPTION_GROUPS } from '@/data/menu'

export function getMenuItemById(id) {
  return MENU_ITEMS.find((item) => item.id === id)
}

/** @returns {Record<string, number>} option group key → selected choice index */
export function getDefaultSelections(item) {
  return Object.fromEntries(
    item.optionGroups.map((groupKey) => [groupKey, OPTION_GROUPS[groupKey].defaultIndex]),
  )
}

export function getSelectedChoices(item, selections) {
  return item.optionGroups.map((groupKey) => OPTION_GROUPS[groupKey].choices[selections[groupKey]])
}

export function calculateUnitPrice(item, selections) {
  const extras = getSelectedChoices(item, selections).reduce((sum, choice) => sum + choice.price, 0)
  return item.price + extras
}

/** Items whose name or description contains the query (case-insensitive). */
export function searchMenuItems(items, query) {
  const needle = query.trim().toLowerCase()
  if (!needle) return items
  return items.filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(needle))
}

// Badged items go first, in the order BADGES is declared (new, then bestseller).
const BADGE_ORDER = Object.keys(BADGES)

function getBadgeRank(item) {
  return item.badge ? BADGE_ORDER.indexOf(item.badge) : BADGE_ORDER.length
}

/** Returns a copy with badged items first; otherwise keeps the original order. */
export function sortByBadge(items) {
  return [...items].sort((a, b) => getBadgeRank(a) - getBadgeRank(b))
}
