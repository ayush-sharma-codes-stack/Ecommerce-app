import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, ExternalLink } from 'lucide-react'
import api from '../../services/api'
import { useState } from 'react'
import { formatPrice, formatDate } from '../../utils/helpers'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PIE_COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e']

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card p-5 relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-6 translate-x-6 ${color}`} />
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${color} bg-opacity-20`}>
      <Icon size={22} className="text-white" />
    </div>
    <p className="text-slate-400 text-sm">{label}</p>
    <p className="text-2xl font-display font-bold text-white mt-1">{value}</p>
    {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
  </motion.div>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats').then((r) => { setStats(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const chartData = stats?.monthlySales?.map((m) => ({
    name: MONTHS[m._id.month - 1],
    revenue: m.revenue,
    orders: m.orders,
  })) || []

  const pieData = stats?.orderStatus?.map((s) => ({
    name: s._id?.charAt(0).toUpperCase() + s._id?.slice(1),
    value: s.count,
  })) || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-dark-700 border border-dark-400 rounded-xl p-3 shadow-xl">
        <p className="text-slate-300 text-sm font-semibold mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.fill || p.stroke }} className="text-sm">
            {p.name}: {p.dataKey === 'revenue' ? formatPrice(p.value) : p.value}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back — here's what's happening today</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products/new" className="btn-primary text-sm">+ Add Product</Link>
          <Link to="/admin/orders" className="btn-secondary text-sm">View Orders</Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="shimmer h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={DollarSign} label="Total Revenue" value={formatPrice(stats?.stats?.totalRevenue || 0)} sub="From paid orders" color="bg-primary-500" delay={0} />
          <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.stats?.totalOrders || 0} sub="All time" color="bg-cyan-500" delay={0.05} />
          <StatCard icon={Users} label="Customers" value={stats?.stats?.totalUsers || 0} sub="Registered users" color="bg-emerald-500" delay={0.1} />
          <StatCard icon={Package} label="Products" value={stats?.stats?.totalProducts || 0} sub="In catalogue" color="bg-amber-500" delay={0.15} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 card p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-primary-400" />Monthly Revenue</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d52" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">No sales data yet</div>
          )}
        </motion.div>

        {/* Order Status Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
          <h3 className="text-white font-bold mb-4">Order Status</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={80} paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">No orders yet</div>
          )}
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Recent Orders</h3>
          <Link to="/admin/orders" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1">View all <ExternalLink size={13} /></Link>
        </div>
        {stats?.recentOrders?.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500">
                  <th className="text-left py-3 px-2 text-slate-400 font-medium">Order</th>
                  <th className="text-left py-3 px-2 text-slate-400 font-medium">Customer</th>
                  <th className="text-left py-3 px-2 text-slate-400 font-medium">Date</th>
                  <th className="text-right py-3 px-2 text-slate-400 font-medium">Amount</th>
                  <th className="text-right py-3 px-2 text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((o) => (
                  <tr key={o._id} className="border-b border-dark-600 hover:bg-dark-700/50 transition-colors">
                    <td className="py-3 px-2 font-mono text-primary-400 text-xs">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 px-2 text-white">{o.user?.name}</td>
                    <td className="py-3 px-2 text-slate-400">{formatDate(o.createdAt)}</td>
                    <td className="py-3 px-2 text-right text-white font-semibold">{formatPrice(o.totalAmount)}</td>
                    <td className="py-3 px-2 text-right">
                      <span className={`badge text-xs border ${o.isPaid ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                        {o.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Top Products */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Top Products by Sales</h3>
          <Link to="/admin/products" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1">Manage <ExternalLink size={13} /></Link>
        </div>
        {stats?.topProducts?.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No sales data yet</p>
        ) : (
          <div className="space-y-3">
            {stats?.topProducts?.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-primary-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center text-primary-400 text-xs font-bold">
                  {i + 1}
                </div>
                <p className="text-slate-200 text-sm flex-1 truncate">{p.name}</p>
                <span className="text-slate-400 text-sm">{p.totalSold} sold</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
