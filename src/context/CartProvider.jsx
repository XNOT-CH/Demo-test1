import { useMemo, useReducer } from 'react'
import { CartContext } from '@/context/CartContext'
import { CART_ACTIONS, cartReducer, initialCartState } from '@/context/cartReducer'
import { getCartCount, getCartTotal } from '@/utils/cart'

export default function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

  const value = useMemo(
    () => ({
      lines: state.lines,
      addCount: state.addCount,
      totalQuantity: getCartCount(state.lines),
      totalPrice: getCartTotal(state.lines),
      addLine: (line) => dispatch({ type: CART_ACTIONS.ADD_LINE, payload: { line } }),
      changeQuantity: (lineId, delta) =>
        dispatch({ type: CART_ACTIONS.CHANGE_QUANTITY, payload: { lineId, delta } }),
      clearCart: () => dispatch({ type: CART_ACTIONS.CLEAR }),
    }),
    [state],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
