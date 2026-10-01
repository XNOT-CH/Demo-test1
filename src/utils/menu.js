import { MENU_ITEMS, OPTION_GROUPS } from '@/data/menu'

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
