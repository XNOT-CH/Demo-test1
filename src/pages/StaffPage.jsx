import { useState } from 'react'
import ConfirmButton from '@/components/common/ConfirmButton'
import OrderCard from '@/components/staff/OrderCard'
import StaffHeader from '@/components/staff/StaffHeader'
import StatusFilterTabs from '@/components/staff/StatusFilterTabs'
import { ORDER_STATUS, isActiveStatus } from '@/constants/orderStatus'
import { useNewOrderAlert } from '@/hooks/useNewOrderAlert'
import { useNow } from '@/hooks/useNow'
import { useOrders } from '@/hooks/useOrders'
import { advanceOrderStatus, clearAllOrders, createOrder } from '@/services/orderService'
import { createDemoOrderInput } from '@/utils/demoData'
import { countByStatus, getSalesTotal, getTodayOrders } from '@/utils/orders'
import { playNotificationSound } from '@/utils/sound'
import './StaffPage.css'

const FILTER_ACTIVE = 'active'

const FILTER_TABS = [
  { id: FILTER_ACTIVE, label: 'ต้องทำ' },
  { id: ORDER_STATUS.NEW, label: 'ใหม่' },
  { id: ORDER_STATUS.MAKING, label: 'กำลังชง' },
  { id: ORDER_STATUS.READY, label: 'พร้อมรับ' },
  { id: ORDER_STATUS.DONE, label: 'เสร็จแล้ว' },
]

function filterAndSortOrders(orders, filter) {
  if (filter === ORDER_STATUS.DONE) {
    // Most recently completed first
    return orders
      .filter((order) => order.status === ORDER_STATUS.DONE)
      .sort((a, b) => b.updatedAt - a.updatedAt)
  }
  // Oldest first — first come, first served
  return orders
    .filter((order) =>
      filter === FILTER_ACTIVE ? isActiveStatus(order.status) : order.status === filter,
    )
    .sort((a, b) => a.createdAt - b.createdAt)
}

function addDemoOrder() {
  createOrder(createDemoOrderInput())
}

export default function StaffPage() {
  const orders = useOrders()
  const now = useNow()
  const [filter, setFilter] = useState(FILTER_ACTIVE)
  const [isSoundOn, setIsSoundOn] = useState(false)

  const highlightedIds = useNewOrderAlert(orders, () => {
    if (isSoundOn) playNotificationSound()
  })

  const todayOrders = getTodayOrders(orders)
  const counts = countByStatus(todayOrders)
  const visibleOrders = filterAndSortOrders(todayOrders, filter)

  function toggleSound() {
    // Play once when turning on — also unlocks audio on mobile browsers.
    if (!isSoundOn) playNotificationSound()
    setIsSoundOn(!isSoundOn)
  }

  return (
    <div className="page staff-page">
      <StaffHeader
        orderCount={todayOrders.length}
        pendingCount={counts.new + counts.making}
        salesTotal={getSalesTotal(todayOrders)}
        isSoundOn={isSoundOn}
        onToggleSound={toggleSound}
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
          <button type="button" className="btn btn--secondary btn--sm" onClick={addDemoOrder}>
            + สร้างออเดอร์ตัวอย่าง
          </button>
        </div>
      )}

      <footer className="page-footer staff-page__footer">
        <button type="button" className="link-btn" onClick={addDemoOrder}>
          + ออเดอร์ตัวอย่าง
        </button>
        <ConfirmButton onConfirm={clearAllOrders}>ล้างข้อมูลเดโม</ConfirmButton>
      </footer>
    </div>
  )
}
