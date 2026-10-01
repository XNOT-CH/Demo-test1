export const CART_ACTIONS = Object.freeze({
  ADD_LINE: 'cart/addLine',
  CHANGE_QUANTITY: 'cart/changeQuantity',
  CLEAR: 'cart/clear',
})

export const initialCartState = {
  lines: [],
  /** Increments on every add — lets the UI replay the "added" animation. */
  addCount: 0,
}

export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_LINE: {
      const { line } = action.payload
      const exists = state.lines.some((item) => item.id === line.id)
      const lines = exists
        ? state.lines.map((item) =>
            item.id === line.id ? { ...item, quantity: item.quantity + line.quantity } : item,
          )
        : [...state.lines, line]
      return { lines, addCount: state.addCount + 1 }
    }

    case CART_ACTIONS.CHANGE_QUANTITY: {
      const { lineId, delta } = action.payload
      const lines = state.lines
        .map((item) => (item.id === lineId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
      return { ...state, lines }
    }

    case CART_ACTIONS.CLEAR:
      return { ...state, lines: [] }

    default:
      return state
  }
}
