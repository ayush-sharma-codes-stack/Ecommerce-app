import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AdminRoute() {
  const { user, isAuthenticated, initialized } = useSelector((s) => s.auth)
  if (!initialized) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}
