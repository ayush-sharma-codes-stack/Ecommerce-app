import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute() {
  const { isAuthenticated, initialized } = useSelector((s) => s.auth)
  if (!initialized) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
