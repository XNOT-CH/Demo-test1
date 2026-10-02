import { Route, Routes, useLocation } from 'react-router-dom'
import RequireStaff from '@/components/auth/RequireStaff'
import ScrollToTop from '@/components/common/ScrollToTop'
import LoginPage from '@/pages/LoginPage'
import MenuPage from '@/pages/MenuPage'
import NotFoundPage from '@/pages/NotFoundPage'
import QueuePage from '@/pages/QueuePage'
import StaffPage from '@/pages/StaffPage'

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      {/* key on pathname replays the page-enter animation on every navigation */}
      <main key={location.pathname} className="app">
        <Routes location={location}>
          <Route path="/" element={<MenuPage />} />
          <Route path="/queue/:orderId" element={<QueuePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/staff"
            element={
              <RequireStaff>
                <StaffPage />
              </RequireStaff>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}
