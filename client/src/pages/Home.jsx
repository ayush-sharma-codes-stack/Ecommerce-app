import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Truck, RotateCcw } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/slices/productSlice'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/Skeleton'

const CATEGORIES = [
  { name: 'Electronics', emoji: '💻', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
  { name: 'Clothing', emoji: '👕', color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30' },
  { name: 'Books', emoji: '📚', color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30' },
  { name: 'Home', emoji: '🏠', color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30' },
  { name: 'Sports', emoji: '⚽', color: 'from-orange-500/20 to-red-500/20 border-orange-500/30' },
  { name: 'Beauty', emoji: '✨', color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30' },
]

const FEATURES = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: Shield, title: 'Secure Payment', desc: 'Powered by Stripe' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Zap, title: 'Fast Delivery', desc: '2-3 business days' },
]

export default function Home() {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((s) => s.products)

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, sortBy: 'ratings', order: 'desc' }))
  }, [dispatch])

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/10 rounded-full blur-3xl" />
        </div>
        <div className="page-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm font-medium mb-6">
                <Zap size={14} className="fill-primary-400" /> New arrivals every week
              </span>
              <h1 className="text-5xl sm:text-7xl font-display font-bold leading-tight mb-6">
                Shop the{' '}
                <span className="gradient-text">Future</span>
                <br />of Retail
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-xl mx-auto">
                Discover premium products curated for modern lifestyles. From cutting-edge electronics to timeless fashion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="btn-primary text-lg px-8 py-4 glow">
                  Shop Now <ArrowRight size={20} />
                </Link>
                <Link to="/products?category=Electronics" className="btn-secondary text-lg px-8 py-4">
                  Browse Electronics
                </Link>
              </div>
            </motion.div>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-16 pt-10 border-t border-dark-500">
              {[['10K+', 'Happy Customers'], ['500+', 'Products'], ['99%', 'Satisfaction']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-display font-bold gradient-text">{num}</div>
                  <div className="text-slate-400 text-sm mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-dark-800/50 border-y border-dark-500">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-primary-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="section-title">Shop by Category</h2>
            <p className="text-slate-400">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(({ name, emoji, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}>
                <Link
                  to={`/products?category=${name}`}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${color} border backdrop-blur-sm hover:shadow-lg transition-all duration-300`}>
                  <span className="text-3xl">{emoji}</span>
                  <span className="text-white font-medium text-sm text-center">{name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-dark-800/30">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-slate-400">Top-rated picks for you</p>
            </div>
            <Link to="/products" className="btn-secondary hidden sm:flex">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)
            }
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/products" className="btn-primary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-purple-700 p-12 text-center">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl font-display font-bold text-white mb-4">Ready to start shopping?</h2>
              <p className="text-primary-100 mb-8 text-lg max-w-md mx-auto">Join thousands of satisfied customers and experience premium shopping today.</p>
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors shadow-xl text-lg">
                Get Started Free <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
