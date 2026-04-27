import { useSelector, useDispatch } from 'react-redux'
import { login, logout, register, fetchMe } from '../store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, token, isAuthenticated, loading, error, initialized } = useSelector((s) => s.auth)

  return {
    user, token, isAuthenticated, loading, error, initialized,
    login: (data) => dispatch(login(data)),
    logout: () => dispatch(logout()),
    register: (data) => dispatch(register(data)),
    fetchMe: () => dispatch(fetchMe()),
  }
}
