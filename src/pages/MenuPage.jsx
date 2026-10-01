import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BottomSheet from '@/components/common/BottomSheet'
import Toast from '@/components/common/Toast'
import CartBar from '@/components/menu/CartBar'
import CartSheet from '@/components/menu/CartSheet'
import CategoryTabs from '@/components/menu/CategoryTabs'
import ItemOptionsSheet from '@/components/menu/ItemOptionsSheet'
import MenuCard from '@/components/menu/MenuCard'
import MenuHeader from '@/components/menu/MenuHeader'
import PromoCarousel from '@/components/menu/PromoCarousel'
import { ALL_CATEGORY_ID, CATEGORIES, MENU_ITEMS } from '@/data/menu'
import { PROMOTION_TYPE, PROMOTIONS } from '@/data/promotions'
import { useCart } from '@/hooks/useCart'
import { useMyActiveOrder } from '@/hooks/useOrders'
import { useToast } from '@/hooks/useToast'
import { createOrder } from '@/services/orderService'
import { getMenuItemById } from '@/utils/menu'
import './MenuPage.css'

// Resolve each promo's menu item once. Item slides need a valid item; image slides don't.
const promoSlides = PROMOTIONS.map((promo) => ({
  ...promo,
  item: promo.itemId ? getMenuItemById(promo.itemId) : undefined,
})).filter((slide) => slide.type === PROMOTION_TYPE.IMAGE || slide.item)

export default function MenuPage() {
  const navigate = useNavigate()
  const cart = useCart()
  const activeOrder = useMyActiveOrder()
  const { message: toastMessage, showToast } = useToast()

  const [categoryId, setCategoryId] = useState(ALL_CATEGORY_ID)
  // The selected item is kept separately from the open flag so the sheet
  // still has content to show while its close animation plays.
  const [selectedItem, setSelectedItem] = useState(null)
  const [isItemSheetOpen, setIsItemSheetOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const visibleItems = useMemo(
    () =>
      categoryId === ALL_CATEGORY_ID
        ? MENU_ITEMS
        : MENU_ITEMS.filter((item) => item.categoryId === categoryId),
    [categoryId],
  )

  const openItem = useCallback((item) => {
    setSelectedItem(item)
    setIsItemSheetOpen(true)
  }, [])

  const closeItemSheet = useCallback(() => setIsItemSheetOpen(false), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  function handleAddToCart(line) {
    cart.addLine(line)
    setIsItemSheetOpen(false)
    showToast(`${line.emoji} เพิ่ม ${line.name} ×${line.quantity} แล้ว`)
  }

  function handleCheckout({ customerName, orderType, note }) {
    const order = createOrder({ items: cart.lines, customerName, orderType, note })
    cart.clearCart()
    setIsCartOpen(false)
    navigate(`/queue/${order.id}`, { state: { justOrdered: true } })
  }

  return (
    <div className="page">
      <MenuHeader activeOrder={activeOrder} />

      <section className="menu-page__hero">
        <p className="menu-page__greeting">สวัสดีเมี๊ยว~ วันนี้รับอะไรดี?</p>
        <PromoCarousel slides={promoSlides} onSelectItem={openItem} />
      </section>

      <CategoryTabs categories={CATEGORIES} activeId={categoryId} onChange={setCategoryId} />

      {/* key re-mounts the grid so the stagger animation replays on category change */}
      <ul key={categoryId} className="menu-page__grid">
        {visibleItems.map((item, index) => (
          <MenuCard key={item.id} item={item} index={index} onSelect={openItem} />
        ))}
      </ul>

      <footer className="page-footer">
        <Link to="/staff" className="link-btn">
          สำหรับพนักงาน →
        </Link>
      </footer>

      <CartBar
        totalQuantity={cart.totalQuantity}
        totalPrice={cart.totalPrice}
        addCount={cart.addCount}
        onOpen={() => setIsCartOpen(true)}
      />

      <Toast message={toastMessage} />

      <BottomSheet isOpen={isItemSheetOpen} onClose={closeItemSheet} ariaLabel={selectedItem?.name}>
        {selectedItem && (
          <ItemOptionsSheet
            key={selectedItem.id}
            item={selectedItem}
            onAddToCart={handleAddToCart}
          />
        )}
      </BottomSheet>

      <BottomSheet isOpen={isCartOpen} onClose={closeCart} ariaLabel="ตะกร้า">
        <CartSheet onCheckout={handleCheckout} />
      </BottomSheet>
    </div>
  )
}
