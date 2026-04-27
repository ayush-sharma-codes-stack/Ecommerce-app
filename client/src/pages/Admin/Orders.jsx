import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Truck, Eye, CheckCircle } from 'lucide-react'
import { fetchAllOrders, markOrderDelivered } from '../../store/slices/orderSlice'
import { formatPrice, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
}

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((s) => s.orders)

  useEffect(() => { dispatch(fetchAllOrders()) }, [dispatch])

  const handleDeliver = async (id) => {
    const res = await dispatch(markOrderDelivered(id))
    if (markOrderDelivered.fulfilled.match(res)) toast.success('Order marked as delivered')
    else toast.error(res.payload || 'Failed')
  }

  return (
    <div className="page-container">
      <div className="flex items-center gap-3 mb-8">
        <Truck size={28} className="text-primary-400" />
        <div>
          <h1 className="text-3xl font-display font-bold text-white">All Orders</h1>
          <p className="text-slate-400 mt-1">{orders.length} total orders</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-700 border-b border-dark-500">
              <tr>
                {['Order ID', 'Customer', 'Date', 'Items', 'Amount', 'Payment', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="py-3.5 px-4 text-left text-slate-400 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-dark-600">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="py-3 px-4"><div className="shimmer h-4 rounded w-24" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.map((o, i) => (
                <motion.tr key={o._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-dark-600 hover:bg-dark-700/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-primary-400 text-xs">#{o._id.slice(-6).toUpperCase()}</td>
                  <td className="py-3 px-4">
                    <p className="text-white font-medium">{o.user?.name}</p>
                    <p className="text-slate-500 text-xs">{o.user?.email}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                  <td className="py-3 px-4 text-slate-300">{o.items?.length}</td>
                  <td className="py-3 px-4 text-white font-semibold">{formatPrice(o.totalAmount)}</td>
                  <td className="py-3 px-4">
                    <span className={`badge border text-xs ${o.isPaid ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                      {o.isPaid ? '✓ Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge border text-xs ${STATUS_COLORS[o.status] || 'bg-dark-500 text-slate-400'}`}>
                      {o.status?.charAt(0).toUpperCase() + o.status?.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/orders/${o._id}`}
                        className="w-8 h-8 bg-primary-500/20 hover:bg-primary-500/40 border border-primary-500/30 rounded-lg flex items-center justify-center text-primary-400 transition-colors">
                        <Eye size={14} />
                      </Link>
                      {!o.isDelivered && o.isPaid && (
                        <button onClick={() => handleDeliver(o._id)}
                          className="w-8 h-8 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400 transition-colors"
                          title="Mark as Delivered">
                          <CheckCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-400">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
