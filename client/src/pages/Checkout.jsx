import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { MapPin, CreditCard, Lock } from 'lucide-react'
import { createOrder } from '../store/slices/orderSlice'
import { createCheckoutSession } from '../store/slices/orderSlice'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function Checkout() {
  const dispatch = useDispatch()
  const { items, totalPrice } = useSelector((s) => s.cart)
  const { loading } = useSelector((s) => s.orders)
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState({ fullName: '', address: '', city: '', postalCode: '', country: '', phone: '' })

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    const required = ['fullName', 'address', 'city', 'postalCode', 'country']
    if (required.some((f) => !address[f].trim())) return toast.error('Please fill all required fields')
    setStep(2)
  }

  const handlePlaceOrder = async () => {
    const orderRes = await dispatch(createOrder({ shippingAddress: address, paymentMethod: 'stripe' }))
    if (!createOrder.fulfilled.match(orderRes)) return toast.error(orderRes.payload || 'Failed to create order')
    const orderId = orderRes.payload._id
    const payRes = await dispatch(createCheckoutSession(orderId))
    if (createCheckoutSession.fulfilled.match(payRes)) {
      window.location.href = payRes.payload.url
    } else {
      toast.error(payRes.payload || 'Payment session failed')
    }
  }

  return (
    <div className="page-container max-w-4xl">
      <h1 className="text-3xl font-display font-bold text-white mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[{ n: 1, label: 'Shipping' }, { n: 2, label: 'Payment' }].map(({ n, label }) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= n ? 'bg-primary-600 text-white' : 'bg-dark-500 text-slate-400'}`}>{n}</div>
            <span className={`text-sm font-medium ${step >= n ? 'text-white' : 'text-slate-500'}`}>{label}</span>
            {n < 2 && <div className={`h-px w-12 ${step > n ? 'bg-primary-500' : 'bg-dark-500'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <MapPin size={20} className="text-primary-400" /> Shipping Address
              </h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="input-field" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="input-field" placeholder="+1 234 567 8900" />
                  </div>
                </div>
                <div>
                  <label className="label">Street Address *</label>
                  <input value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} className="input-field" placeholder="123 Main Street, Apt 4B" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">City *</label>
                    <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="input-field" placeholder="New York" required />
                  </div>
                  <div>
                    <label className="label">Postal Code *</label>
                    <input value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} className="input-field" placeholder="10001" required />
                  </div>
                  <div>
                    <label className="label">Country *</label>
                    <input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="input-field" placeholder="United States" required />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-3.5">Continue to Payment</button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-primary-400" /> Payment
                </h2>
                <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center gap-3">
                  <Lock size={20} className="text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">Secure payment with Stripe</p>
                    <p className="text-slate-400 text-xs mt-0.5">You'll be redirected to Stripe's secure checkout to complete payment.</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-dark-700 rounded-xl">
                  <p className="text-slate-400 text-sm mb-2 font-semibold">Shipping to:</p>
                  <p className="text-white text-sm">{address.fullName}</p>
                  <p className="text-slate-300 text-sm">{address.address}, {address.city} {address.postalCode}, {address.country}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 py-3.5">
                  {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Lock size={16} /> Pay with Stripe</>}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="card p-5 h-fit sticky top-20">
          <h3 className="text-white font-bold mb-4">Order Summary</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.product} className="flex items-center gap-3">
                <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{item.name}</p>
                  <p className="text-slate-400 text-xs">Qty: {item.qty}</p>
                </div>
                <p className="text-primary-400 text-sm font-semibold">{formatPrice(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-dark-500 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-slate-300 text-sm"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
            <div className="flex justify-between text-slate-300 text-sm"><span>Shipping</span><span className="text-emerald-400">Free</span></div>
            <div className="flex justify-between text-white font-bold"><span>Total</span><span className="gradient-text text-lg">{formatPrice(totalPrice)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
