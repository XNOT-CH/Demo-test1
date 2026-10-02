import { Link } from 'react-router-dom'
import { formatPrice } from '@/utils/format'
import './StaffHeader.css'

export default function StaffHeader({ orderCount, pendingCount, salesTotal, onSignOut }) {
  const stats = [
    { label: 'ออเดอร์', value: orderCount },
    { label: 'รอทำ', value: pendingCount },
    { label: 'ยอดขาย', value: formatPrice(salesTotal) },
  ]

  return (
    <header className="staff-header">
      <div className="staff-header__top">
        <Link to="/" className="icon-btn staff-header__icon-btn" aria-label="กลับหน้าลูกค้า">
          ←
        </Link>
        <div className="staff-header__heading">
          <h1 className="staff-header__title">ออเดอร์วันนี้</h1>
          <small className="staff-header__subtitle">หน้าจอพนักงาน · Gachi Café</small>
        </div>
        <button type="button" className="staff-header__sign-out" onClick={onSignOut}>
          ออกจากระบบ
        </button>
      </div>

      <dl className="staff-header__stats">
        {stats.map((stat) => (
          <div key={stat.label} className="stat">
            <dt className="stat__label">{stat.label}</dt>
            <dd className="stat__value">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </header>
  )
}
