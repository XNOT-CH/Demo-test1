import { Link } from 'react-router-dom'
import './MenuHeader.css'

export default function MenuHeader({ activeOrder }) {
  return (
    <header className="page-header menu-header">
      <div className="menu-header__brand">
        <span className="menu-header__logo" aria-hidden="true">
          🐱
        </span>
        <div>
          <strong className="menu-header__name">Gachi Café</strong>
          <small className="menu-header__tagline">คาเฟ่แมวบาริสต้า</small>
        </div>
      </div>

      {activeOrder && (
        <Link to={`/queue/${activeOrder.id}`} className="my-queue-chip">
          <span className={`status-dot status-dot--${activeOrder.status}`} />
          คิว {activeOrder.queueNumber}
        </Link>
      )}
    </header>
  )
}
