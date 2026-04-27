import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalPrice, totalItems, loading } = useSelector((s) => s.cart)

  useEffect(() => { dispatch(fetchCart()) }, [dispatch])

  const handleRemove = async (productId) => {
    await dispatch(removeFromCart(productId))
    toast.success('Item removed')
  }

  const handleClear = async () => {
    await dispatch(clearCart())
    toast.success('Cart cleared')
  }

  if (items.length === 0) return (
    <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
      <ShoppingBag size={80} className="text-slate-600 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
      <p className="text-slate-400 mb-6">Looks like you haven't added anything yet</p>
      <Link to="/products" className="btn-primary">Start Shopping</Link>
    </div>
  )

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Shopping Cart</h1>
          <p className="text-slate-400 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={handleClear} className="text-slate-400 hover:text-rose-400 text-sm transition-colors flex items-center gap-1">
          <Trash2 size={15} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div key={item.product} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="card p-4 flex gap-4">
              <Link to={`/products/${item.product}`}>
                <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-dark-500" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product}`} className="text-white font-semibold hover:text-primary-400 transition-colors line-clamp-2">{item.name}</Link>
                <p className="text-primary-400 font-bold text-lg mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center bg-dark-700 border border-dark-400 rounded-lg overflow-hidden">
                    <button onClick={() => dispatch(updateCartItem({ productId: item.product, qty: item.qty - 1 }))} disabled={loading || item.qty <= 1} className="w-8 h-9 flex items-center justify-center text-white hover:bg-dark-500 disabled:opacity-40">
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-white font-bold text-sm">{item.qty}</span>
                    <button onClick={() => dispatch(updateCartItem({ productId: item.product, qty: item.qty + 1 }))} disabled={loading} className="w-8 h-9 flex items-center justify-center text-white hover:bg-dark-500 disabled:opacity-40">
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-slate-400 text-sm">= {formatPrice(item.price * item.qty)}</span>
                  <button onClick={() => handleRemove(item.product)} className="ml-auto text-slate-500 hover:text-rose-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-20">
          <h3 className="text-lg font-bold text-white mb-5">Order Summary</h3>
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-slate-300"><span>Subtotal ({totalItems} items)</span><span>{formatPrice(totalPrice)}</span></div>
            <div className="flex justify-between text-slate-300"><span>Shipping</span><span className="text-emerald-400">Free</span></div>
            <div className="flex justify-between text-slate-300"><span>Tax</span><span>{formatPrice(totalPrice * 0.08)}</span></div>
            <div className="border-t border-dark-500 pt-3 flex justify-between text-white font-bold text-lg">
              <span>Total</span>
              <span className="gradient-text">{formatPrice(totalPrice * 1.08)}</span>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-3.5 text-base">
            Proceed to Checkout <ArrowRight size={18} />
          </button>
          <Link to="/products" className="btn-ghost w-full justify-center mt-2 text-sm">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
