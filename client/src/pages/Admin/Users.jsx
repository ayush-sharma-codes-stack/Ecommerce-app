import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Shield } from 'lucide-react'
import api from '../../services/api'
import { formatDate } from '../../utils/helpers'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/users').then((r) => { setUsers(r.data.users); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="page-container">
      <div className="flex items-center gap-3 mb-8">
        <Users size={28} className="text-primary-400" />
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Users</h1>
          <p className="text-slate-400 mt-1">{users.length} registered users</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-700 border-b border-dark-500">
              <tr>
                {['User', 'Email', 'Role', 'Joined', 'ID'].map((h) => (
                  <th key={h} className="py-3.5 px-4 text-left text-slate-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-dark-600">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="py-3 px-4"><div className="shimmer h-4 rounded w-28" /></td>
                    ))}
                  </tr>
                ))
              ) : users.map((u, i) => (
                <motion.tr key={u._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-dark-600 hover:bg-dark-700/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`badge border text-xs ${u.role === 'admin' ? 'bg-primary-500/20 text-primary-400 border-primary-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                      <Shield size={10} className="mr-1" />
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{formatDate(u.createdAt)}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-xs">{u._id.slice(-8)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {!loading && users.length === 0 && (
            <div className="py-16 text-center"><p className="text-slate-400">No users found</p></div>
          )}
        </div>
      </div>
    </div>
  )
}
