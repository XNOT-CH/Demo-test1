import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useStaffSession } from '@/hooks/useStaffSession'
import { signIn } from '@/services/authService'
import './LoginPage.css'

export default function LoginPage() {
  const session = useStaffSession()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [error, setError] = useState('')

  // Signing in updates the session, which re-renders this page into a redirect.
  if (session) {
    return <Navigate to={location.state?.from ?? '/staff'} replace />
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!signIn(username, password)) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      setPassword('')
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <Link to="/" className="icon-btn" aria-label="กลับไปเมนู">
          ←
        </Link>
        <h1 className="page-header__title">เข้าสู่ระบบ</h1>
        <span className="icon-btn" style={{ visibility: 'hidden' }} aria-hidden="true" />
      </header>

      <form className="login-card" onSubmit={handleSubmit}>
        <span className="login-card__logo" aria-hidden="true">
          🐱
        </span>
        <h2 className="login-card__title">สำหรับพนักงาน</h2>
        <p className="login-card__subtitle">เข้าสู่ระบบเพื่อจัดการออเดอร์และเมนู</p>

        <label className="form-field">
          <span>ชื่อผู้ใช้</span>
          <input
            className="form-field__input"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)
              setError('')
            }}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
          />
        </label>

        <label className="form-field">
          <span>รหัสผ่าน</span>
          <span className="login-card__password">
            <input
              className="form-field__input"
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="login-card__toggle"
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              aria-pressed={isPasswordVisible}
            >
              {isPasswordVisible ? 'ซ่อน' : 'แสดง'}
            </button>
          </span>
        </label>

        {error && (
          <p className="login-card__error" role="alert">
            😿 {error}
          </p>
        )}

        <button type="submit" className="btn btn--primary btn--block">
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  )
}
