import { useCallback, useMemo, useState } from 'react'
import BottomSheet from '@/components/common/BottomSheet'
import ConfirmButton from '@/components/common/ConfirmButton'
import Toast from '@/components/common/Toast'
import AddMenuItemForm from '@/components/staff/AddMenuItemForm'
import OrderCard from '@/components/staff/OrderCard'
import StaffHeader from '@/components/staff/StaffHeader'
import StatusFilterTabs from '@/components/staff/StatusFilterTabs'
import { ORDER_STATUS, isActiveStatus } from '@/constants/orderStatus'
import { useMenuItems } from '@/hooks/useMenuItems'
import { useNewOrderAlert } from '@/hooks/useNewOrderAlert'
import { useNow } from '@/hooks/useNow'
import { useOrders } from '@/hooks/useOrders'
import { useToast } from '@/hooks/useToast'
import { signOut } from '@/services/authService'
import { addMenuItem, removeMenuItem } from '@/services/menuService'
import { advanceOrderStatus, clearAllOrders } from '@/services/orderService'
import { countByStatus, getSalesTotal, getTodayOrders } from '@/utils/orders'
import './StaffPage.css'

const FILTER_ACTIVE = 'active'

const FILTER_TABS = [
  { id: FILTER_ACTIVE, label: 'ต้องทำ' },
  { id: ORDER_STATUS.NEW, label: 'ใหม่' },
  { id: ORDER_STATUS.MAKING, label: 'กำลังชง' },
  { id: ORDER_STATUS.READY, label: 'พร้อมรับ' },
  { id: ORDER_STATUS.DONE, label: 'เสร็จแล้ว' },
  { id: ORDER_STATUS.CANCELLED, label: 'ยกเลิก' },
]

function filterAndSortOrders(orders, filter) {
  if (filter === ORDER_STATUS.DONE || filter === ORDER_STATUS.CANCELLED) {
    // Most recently completed / cancelled first
    return orders
      .filter((order) => order.status === filter)
      .sort((a, b) => b.updatedAt - a.updatedAt)
  }
  // Oldest first — first come, first served
  return orders
    .filter((order) =>
      filter === FILTER_ACTIVE ? isActiveStatus(order.status) : order.status === filter,
    )
    .sort((a, b) => a.createdAt - b.createdAt)
}

export default function StaffPage() {
  const orders = useOrders()
  const now = useNow()
  const [filter, setFilter] = useState(FILTER_ACTIVE)
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const { message: toastMessage, showToast } = useToast()

  const menuItems = useMenuItems()
  const customMenuItems = useMemo(() => menuItems.filter((item) => item.isCustom), [menuItems])
  const closeAddMenu = useCallback(() => setIsAddMenuOpen(false), [])

  const highlightedIds = useNewOrderAlert(orders)

  const todayOrders = getTodayOrders(orders)
  const counts = countByStatus(todayOrders)
  const visibleOrders = filterAndSortOrders(todayOrders, filter)

  function handleAddMenuItem(input) {
    const item = addMenuItem(input)
    setIsAddMenuOpen(false)
    showToast(`${item.emoji} เพิ่ม ${item.name} ลงเมนูแล้ว`)
  }

  return (
    <div className="page staff-page">
      <StaffHeader
        orderCount={todayOrders.length - counts.cancelled}
        pendingCount={counts.new + counts.making}
        salesTotal={getSalesTotal(todayOrders)}
        onSignOut={signOut}
      />

      <StatusFilterTabs tabs={FILTER_TABS} counts={counts} activeId={filter} onChange={setFilter} />

      {visibleOrders.length > 0 ? (
        <ul className="staff-page__orders">
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              now={now}
              isHighlighted={highlightedIds.has(order.id)}
              onAdvance={advanceOrderStatus}
            />
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">😴</div>
          <p>
            {todayOrders.length === 0 ? 'ยังไม่มีออเดอร์เข้ามาวันนี้' : 'ไม่มีออเดอร์ในสถานะนี้'}
          </p>
        </div>
      )}

      <footer className="page-footer staff-page__footer">
        <button type="button" className="link-btn" onClick={() => setIsAddMenuOpen(true)}>
          + เพิ่มเมนู
        </button>
        <ConfirmButton onConfirm={clearAllOrders}>ล้างข้อมูลเดโม</ConfirmButton>
      </footer>

      <Toast message={toastMessage} />

      <BottomSheet isOpen={isAddMenuOpen} onClose={closeAddMenu} ariaLabel="เพิ่มเมนู">
        <AddMenuItemForm
          customItems={customMenuItems}
          onAdd={handleAddMenuItem}
          onRemove={removeMenuItem}
        />
      </BottomSheet>
    </div>
  )
}
