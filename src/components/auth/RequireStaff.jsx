import { Navigate, useLocation } from 'react-router-dom'
import { useStaffSession } from '@/hooks/useStaffSession'

/** Sends visitors who aren't signed in to the login page, then back here afterwards. */
export default function RequireStaff({ children }) {
  const session = useStaffSession()
  const location = useLocation()

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}
