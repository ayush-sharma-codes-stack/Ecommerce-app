import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { formatPrice, getDiscount, truncate } from '../utils/helpers'
import StarRating from './StarRating'

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const { addToCart, loading } = useCart()

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price
  const discount = getDiscount(product.price, product.discountPrice)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="card group relative flex flex-col overflow-hidden hover:border-primary-700/60 hover:shadow-2xl hover:shadow-primary-900/20 transition-all duration-300"
    >
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden bg-dark-700 h-56">
        <img
          src={imgErr ? 'https://via.placeholder.com/400x300/1a1a2e/8b5cf6?text=No+Image' : (product.images?.[0] || 'https://via.placeholder.com/400x300/1a1a2e/8b5cf6?text=No+Image')}
          alt={product.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge bg-rose-500 text-white text-xs">-{discount}%</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-dark-500/90 text-slate-300 border border-dark-400">Out of Stock</span>
          )}
        </div>
        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted) }}
          className="absolute top-2 right-2 w-8 h-8 bg-dark-800/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart size={16} className={wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
        </button>
        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-dark-900/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product._id) }}
            disabled={loading || product.stock === 0}
            className="w-full py-2 bg-primary-600/90 hover:bg-primary-500 text-white text-sm font-semibold rounded-lg backdrop-blur-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <ShoppingCart size={15} /> Quick Add
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-xs text-primary-400 font-medium uppercase tracking-wide">{product.category}</span>
        <Link to={`/products/${product._id}`} className="font-semibold text-white hover:text-primary-300 transition-colors line-clamp-2 text-sm leading-snug">
          {product.name}
        </Link>
        <StarRating rating={product.ratings} numReviews={product.numReviews} size={14} />
        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="text-primary-400 font-bold text-lg">{formatPrice(effectivePrice)}</span>
          {discount > 0 && (
            <span className="text-slate-500 text-sm line-through">{formatPrice(product.price)}</span>
          )}
        </div>
        <button
          onClick={() => addToCart(product._id)}
          disabled={loading || product.stock === 0}
          className="btn-primary w-full py-2.5 text-sm mt-1 disabled:opacity-50">
          <ShoppingCart size={16} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  )
}
