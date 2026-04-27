import { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Camera } from 'lucide-react'
import { formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    toast.success('Profile updated!')
  }

  return (
    <div className="page-container max-w-2xl">
      <h1 className="text-3xl font-display font-bold text-white mb-8">My Profile</h1>

      {/* Avatar section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-900/40">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center border-2 border-dark-800 hover:bg-primary-500 transition-colors">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`badge border ${user?.role === 'admin' ? 'bg-primary-500/20 text-primary-400 border-primary-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                <Shield size={11} className="mr-1" />
                {user?.role?.toUpperCase()}
              </span>
              <span className="text-slate-500 text-xs">Member since {formatDate(user?.createdAt)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <h3 className="text-white font-bold mb-5 flex items-center gap-2"><User size={18} className="text-primary-400" /> Edit Profile</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-11" placeholder="Your full name" />
            </div>
          </div>
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="input-field pl-11" placeholder="your@email.com" />
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
