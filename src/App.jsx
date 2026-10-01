import { Route, Routes, useLocation } from 'react-router-dom'
import ScrollToTop from '@/components/common/ScrollToTop'
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
          <Route path="/staff" element={<StaffPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}
