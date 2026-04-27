import axios from 'axios'

// Use a relative path for unified Vercel deployment
const baseURL = '/api'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

// Request interceptor — attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers['Authorization'] = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — 401 → refresh → retry
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (!original.url) return Promise.reject(error)

    const isAuthRoute = original.url.includes('/auth/me') || 
                       original.url.includes('/auth/refresh-token') || 
                       original.url.includes('/auth/login')

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            original.headers['Authorization'] = `Bearer ${token}`
            return api(original)
          })
          .catch((err) => Promise.reject(err))
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true })
        const newToken = data.accessToken
        localStorage.setItem('token', newToken)
        processQueue(null, newToken)
        original.headers['Authorization'] = `Bearer ${newToken}`
        return api(original)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        localStorage.removeItem('token')
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    if (error.response?.status === 401 && isAuthRoute) {
      localStorage.removeItem('token')
    }

    return Promise.reject(error)
  }
)

export default api
