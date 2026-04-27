import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Package, ChevronRight, CheckCircle } from 'lucide-react'
import { fetchMyOrders } from '../store/slices/orderSlice'
import { formatPrice, formatDate } from '../utils/helpers'
import { OrderCardSkeleton } from '../components/Skeleton'

const STATUS_COLORS = {
  processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
}

export default function Orders() {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((s) => s.orders)
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')

  useEffect(() => { dispatch(fetchMyOrders()) }, [dispatch])

  return (
    <div className="page-container max-w-3xl">
      {success && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
          <CheckCircle size={22} className="text-emerald-400" />
          <div>
            <p className="text-emerald-400 font-semibold">Payment successful!</p>
            <p className="text-slate-400 text-sm">Your order is being processed. A confirmation email has been sent.</p>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-3 mb-8">
        <Package size={28} className="text-primary-400" />
        <div>
          <h1 className="text-3xl font-display font-bold text-white">My Orders</h1>
          <p className="text-slate-400 mt-1">{orders.length} orders total</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <OrderCardSkeleton key={i} />)}</div>
      ) : orders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package size={60} className="text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No orders yet</h2>
          <p className="text-slate-400 mb-6">When you place an order, it will appear here</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/orders/${order._id}`} className="card p-5 block hover:border-primary-600/50 transition-all duration-200 group">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-white font-semibold">{formatDate(order.createdAt)}</p>
                    <p className="text-slate-400 text-sm mt-1">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-primary-400 font-bold text-lg">{formatPrice(order.totalAmount)}</p>
                      <span className={`badge border ${STATUS_COLORS[order.status] || 'bg-dark-500 text-slate-400'}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </div>
                    <ChevronRight size={20} className="text-slate-500 group-hover:text-primary-400 transition-colors" />
                  </div>
                </div>
                {/* Item thumbnails */}
                <div className="flex gap-2 mt-4">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <img key={idx} src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-dark-400" />
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-10 h-10 rounded-lg bg-dark-500 border border-dark-400 flex items-center justify-center text-xs text-slate-400">+{order.items.length - 4}</div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
