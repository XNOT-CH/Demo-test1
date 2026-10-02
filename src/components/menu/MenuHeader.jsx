import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import BottomSheet from '@/components/common/BottomSheet'
import { useStaffSession } from '@/hooks/useStaffSession'
import { signOut } from '@/services/authService'
import './MenuHeader.css'

export default function MenuHeader({ activeOrder }) {
  const staffSession = useStaffSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

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

      <div className="menu-header__actions">
        {staffSession ? (
          <Link to="/staff" className="menu-header__staff-btn">
            <span aria-hidden="true">🧑‍🍳</span> พนักงาน
          </Link>
        ) : (
          <Link to="/login" className="menu-header__login-btn">
            เข้าสู่ระบบ
          </Link>
        )}

        <button
          type="button"
          className="icon-btn menu-header__menu-btn"
          onClick={() => setIsMenuOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isMenuOpen}
          aria-label="เมนู"
        >
          <span className="hamburger" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          {/* hints that there's an order to check inside the menu */}
          {activeOrder && (
            <span
              className={`status-dot status-dot--${activeOrder.status} menu-header__badge`}
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      <BottomSheet isOpen={isMenuOpen} onClose={closeMenu} ariaLabel="เมนู">
        <nav className="menu-nav">
          {activeOrder && (
            <Link to={`/queue/${activeOrder.id}`} className="menu-nav__link">
              <span className="menu-nav__icon" aria-hidden="true">
                🎫
              </span>
              <span className="menu-nav__label">คิวของฉัน</span>
              <span className="menu-nav__queue">
                <span className={`status-dot status-dot--${activeOrder.status}`} />
                {activeOrder.queueNumber}
              </span>
            </Link>
          )}
          {staffSession && (
            <button type="button" className="menu-nav__link" onClick={signOut}>
              <span className="menu-nav__icon" aria-hidden="true">
                🚪
              </span>
              <span className="menu-nav__label">
                ออกจากระบบ
                <small className="menu-nav__hint">{staffSession.displayName}</small>
              </span>
            </button>
          )}
          {!activeOrder && !staffSession && (
            <p className="menu-nav__empty">ยังไม่มีคิวที่สั่งไว้ เลือกเมนูที่ชอบได้เลย 🐾</p>
          )}
        </nav>
      </BottomSheet>
    </header>
  )
}
