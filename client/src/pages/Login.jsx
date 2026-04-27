import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { login } from '../store/slices/authSlice'
import { fetchCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(login(form))
    if (login.fulfilled.match(res)) {
      dispatch(fetchCart())
      toast.success(`Welcome back, ${res.payload.user.name}!`)
      navigate(res.payload.user.role === 'admin' ? '/admin' : '/')
    } else {
      toast.error(res.payload || 'Login failed')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-900/40 float">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-2">Sign in to your ShopElite account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-11"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-11 pr-11"
                  placeholder="Your password"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          {/* Demo creds */}
          <div className="mt-5 p-3 bg-primary-500/5 border border-primary-500/20 rounded-xl text-xs text-slate-400 space-y-1">
            <p className="text-primary-400 font-semibold">Demo Credentials:</p>
            <p>Admin: admin@shopelite.com / Admin@123</p>
            <p>User: user@shopelite.com / User@123</p>
          </div>
        </div>

        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">Sign up</Link>
        </p>
      </motion.div>
    </div>
  )
}
