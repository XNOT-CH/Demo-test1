import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-state__icon">🙀</div>
        <p>ไม่พบหน้านี้</p>
        <Link to="/" className="btn btn--primary">
          กลับไปหน้าเมนู
        </Link>
      </div>
    </div>
  )
}
