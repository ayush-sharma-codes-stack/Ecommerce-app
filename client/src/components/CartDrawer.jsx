import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { closeCartDrawer } from '../store/slices/uiSlice'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/helpers'

export default function CartDrawer() {
  const dispatch = useDispatch()
  const cartDrawerOpen = useSelector((s) => s.ui.cartDrawerOpen)
  const { items, totalPrice, loading, updateCartItem, removeFromCart } = useCart()

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCartDrawer())}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-800 border-l border-dark-500 z-50 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-dark-500">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} className="text-primary-400" />
                <h2 className="text-lg font-display font-bold text-white">Shopping Cart</h2>
                {items.length > 0 && (
                  <span className="badge bg-primary-500/20 text-primary-400">{items.length}</span>
                )}
              </div>
              <button onClick={() => dispatch(closeCartDrawer())} className="btn-ghost p-2">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 bg-dark-600 rounded-full flex items-center justify-center">
                    <ShoppingBag size={36} className="text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-lg font-medium">Your cart is empty</p>
                  <p className="text-slate-500 text-sm">Add some products to get started</p>
                  <Link to="/products" onClick={() => dispatch(closeCartDrawer())} className="btn-primary">
                    Browse Products
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3 bg-dark-700 rounded-xl p-3 border border-dark-500">
                    <img
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-primary-400 font-semibold text-sm mt-0.5">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateCartItem(item.product, item.qty - 1)}
                          disabled={loading || item.qty <= 1}
                          className="w-7 h-7 bg-dark-500 hover:bg-primary-600/30 border border-dark-400 rounded-lg flex items-center justify-center text-white disabled:opacity-40 transition-all">
                          <Minus size={12} />
                        </button>
                        <span className="text-white text-sm font-bold w-6 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateCartItem(item.product, item.qty + 1)}
                          disabled={loading}
                          className="w-7 h-7 bg-dark-500 hover:bg-primary-600/30 border border-dark-400 rounded-lg flex items-center justify-center text-white disabled:opacity-40 transition-all">
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          disabled={loading}
                          className="ml-auto text-slate-500 hover:text-rose-400 transition-colors p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-dark-500 bg-dark-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Subtotal</span>
                  <span className="text-white text-xl font-bold">{formatPrice(totalPrice)}</span>
                </div>
                <p className="text-xs text-slate-500">Shipping & taxes calculated at checkout</p>
                <Link
                  to="/checkout"
                  onClick={() => dispatch(closeCartDrawer())}
                  className="btn-primary w-full justify-center text-base py-3.5">
                  Checkout <ArrowRight size={18} />
                </Link>
                <Link
                  to="/cart"
                  onClick={() => dispatch(closeCartDrawer())}
                  className="btn-secondary w-full justify-center">
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
