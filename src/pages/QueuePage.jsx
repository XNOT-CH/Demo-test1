import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Confetti from '@/components/common/Confetti'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import OrderSummary from '@/components/queue/OrderSummary'
import QueueTicket from '@/components/queue/QueueTicket'
import { ORDER_STATUS, canCancelOrder } from '@/constants/orderStatus'
import { useOrders } from '@/hooks/useOrders'
import { cancelOrder } from '@/services/orderService'
import { countOrdersAhead } from '@/utils/orders'

const READY_VIBRATION_PATTERN = [200, 100, 200]

export default function QueuePage() {
  const { orderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const justOrdered = Boolean(location.state?.justOrdered)
  // Captured once on mount, so confetti keeps playing after the state is cleared below.
  const [showConfetti] = useState(justOrdered)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  const orders = useOrders()
  const order = orders.find((item) => item.id === orderId)
  const status = order?.status
  const previousStatusRef = useRef(status)
  const isCancellable = canCancelOrder(status)

  // Clear the navigation state so a page refresh doesn't replay the celebration.
  useEffect(() => {
    if (justOrdered) navigate(location.pathname, { replace: true, state: null })
  }, [justOrdered, navigate, location.pathname])

  // Vibrate the phone when the drink becomes ready.
  useEffect(() => {
    if (status === ORDER_STATUS.READY && previousStatusRef.current !== ORDER_STATUS.READY) {
      navigator.vibrate?.(READY_VIBRATION_PATTERN)
    }
    previousStatusRef.current = status
  }, [status])

  function handleConfirmCancel() {
    cancelOrder(orderId)
    setIsCancelDialogOpen(false)
  }

  return (
    <div className="page">
      {showConfetti && <Confetti />}

      <header className="page-header">
        <Link to="/" className="icon-btn" aria-label="กลับไปเมนู">
          ←
        </Link>
        <h1 className="page-header__title">คิวของฉัน</h1>
        <span className="icon-btn" style={{ visibility: 'hidden' }} aria-hidden="true" />
      </header>

      {order ? (
        <>
          <QueueTicket order={order} ordersAhead={countOrdersAhead(orders, order)} />
          <OrderSummary order={order} />
          <Link to="/" className="btn btn--secondary btn--block">
            {status === ORDER_STATUS.CANCELLED ? 'สั่งใหม่ 🐾' : 'สั่งเพิ่ม 🐾'}
          </Link>
          {isCancellable && (
            <footer className="page-footer">
              <button
                type="button"
                className="link-btn link-btn--danger"
                onClick={() => setIsCancelDialogOpen(true)}
              >
                ยกเลิกออเดอร์
              </button>
            </footer>
          )}

          <ConfirmDialog
            // Closes by itself if the barista starts the order while it's open.
            isOpen={isCancelDialogOpen && isCancellable}
            icon="😿"
            title={`ยกเลิกออเดอร์ ${order.queueNumber} ใช่ไหม?`}
            message="บาริสต้ายังไม่ได้เริ่มชง ยกเลิกได้เลย แต่ยกเลิกแล้วจะกู้คืนไม่ได้นะ"
            confirmLabel="ยกเลิกออเดอร์"
            cancelLabel="ไม่ยกเลิก"
            onConfirm={handleConfirmCancel}
            onClose={() => setIsCancelDialogOpen(false)}
          />
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">🙀</div>
          <p>ไม่พบออเดอร์นี้แล้ว</p>
          <Link to="/" className="btn btn--primary">
            กลับไปหน้าเมนู
          </Link>
        </div>
      )}
    </div>
  )
}
