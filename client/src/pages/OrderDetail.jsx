import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { ChevronLeft, Package, MapPin, CreditCard, CheckCircle, Clock, Truck, Home } from 'lucide-react'
import { fetchOrder } from '../store/slices/orderSlice'
import { formatPrice, formatDate } from '../utils/helpers'

const TIMELINE = [
  { key: 'processing', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
]

const STATUS_IDX = { processing: 0, confirmed: 1, shipped: 2, delivered: 3 }

export default function OrderDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { order, loading } = useSelector((s) => s.orders)

  useEffect(() => { dispatch(fetchOrder(id)) }, [id, dispatch])

  if (loading || !order) return (
    <div className="page-container max-w-3xl">
      <div className="space-y-4 animate-pulse">
        <div className="bg-dark-500 h-8 rounded-xl w-48" />
        <div className="bg-dark-500 h-32 rounded-2xl" />
        <div className="bg-dark-500 h-48 rounded-2xl" />
      </div>
    </div>
  )

  const statusIdx = STATUS_IDX[order.status] ?? 0

  return (
    <div className="page-container max-w-3xl">
      <Link to="/orders" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors mb-6 text-sm">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Order #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="text-slate-400 text-sm mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`badge text-sm px-3 py-1 ${order.isPaid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
          {order.isPaid ? '✓ Paid' : 'Payment Pending'}
        </span>
      </div>

      {/* Timeline stepper */}
      <div className="card p-6 mb-6">
        <h3 className="text-white font-semibold mb-6">Order Status</h3>
        <div className="flex items-start">
          {TIMELINE.map(({ key, label, icon: Icon }, i) => {
            const done = i <= statusIdx
            const active = i === statusIdx
            return (
              <div key={key} className="flex-1 flex flex-col items-center relative">
                {i < TIMELINE.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-0.5 transition-all ${done ? 'bg-primary-500' : 'bg-dark-500'}`} />
                )}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: active ? 1.15 : 1 }}
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-primary-600 border-primary-500 shadow-lg shadow-primary-900/40' : 'bg-dark-700 border-dark-400'} ${active ? 'glow' : ''}`}>
                  <Icon size={18} className={done ? 'text-white' : 'text-slate-500'} />
                </motion.div>
                <p className={`mt-2 text-xs font-medium text-center ${done ? 'text-white' : 'text-slate-500'}`}>{label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Items */}
      <div className="card p-5 mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Package size={18} className="text-primary-400" /> Items Ordered</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-dark-500" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{item.name}</p>
                <p className="text-slate-400 text-xs">Qty: {item.qty} × {formatPrice(item.price)}</p>
              </div>
              <p className="text-primary-400 font-bold">{formatPrice(item.price * item.qty)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-dark-500 mt-4 pt-4 flex justify-between">
          <span className="text-white font-bold">Total</span>
          <span className="text-primary-400 font-bold text-xl">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shipping */}
        <div className="card p-5">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><MapPin size={16} className="text-primary-400" /> Shipping Address</h3>
          <p className="text-white text-sm font-medium">{order.shippingAddress?.fullName}</p>
          <p className="text-slate-400 text-sm">{order.shippingAddress?.address}</p>
          <p className="text-slate-400 text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
          <p className="text-slate-400 text-sm">{order.shippingAddress?.country}</p>
        </div>

        {/* Payment */}
        <div className="card p-5">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><CreditCard size={16} className="text-primary-400" /> Payment Info</h3>
          <p className="text-slate-300 text-sm">Method: <span className="text-white font-medium capitalize">{order.paymentMethod}</span></p>
          <p className="text-slate-300 text-sm mt-1">Status: <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-yellow-400'}`}>{order.paymentStatus}</span></p>
          {order.paidAt && <p className="text-slate-400 text-xs mt-1">Paid at: {formatDate(order.paidAt)}</p>}
          
          {!order.isPaid && (
            <button
              onClick={async () => {
                const res = await fetch(`/api/payment/mock-success`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ orderId: order._id })
                });
                if (res.ok) window.location.reload();
              }}
              className="mt-4 w-full py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all">
              ⚡ Simulate Payment Success (Dev Only)
            </button>
          )}
          
          {order.stripePaymentId && <p className="text-slate-500 text-xs mt-1 font-mono truncate">ID: {order.stripePaymentId}</p>}
        </div>
      </div>
    </div>
  )
}
