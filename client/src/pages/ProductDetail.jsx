import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Share2, ChevronLeft, Package, Truck, Shield } from 'lucide-react'
import { fetchProduct } from '../store/slices/productSlice'
import { submitReview } from '../store/slices/productSlice'
import { useCart } from '../hooks/useCart'
import StarRating from '../components/StarRating'
import { formatPrice, formatDate, getDiscount } from '../utils/helpers'
import { ProductCardSkeleton } from '../components/Skeleton'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { product, loading } = useSelector((s) => s.products)
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const { addToCart, loading: cartLoading } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchProduct(id))
    setSelectedImage(0)
  }, [id, dispatch])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return toast.error('Please write a comment')
    setReviewSubmitting(true)
    const res = await dispatch(submitReview({ id, data: { rating, comment } }))
    if (submitReview.fulfilled.match(res)) {
      toast.success('Review submitted!')
      setComment('')
      setRating(5)
      dispatch(fetchProduct(id))
    } else {
      toast.error(res.payload || 'Failed to submit review')
    }
    setReviewSubmitting(false)
  }

  if (loading || !product) {
    return (
      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="bg-dark-500 rounded-2xl h-96" />
          <div className="space-y-4">
            <div className="bg-dark-500 h-8 rounded-xl w-3/4" />
            <div className="bg-dark-500 h-4 rounded-lg w-1/2" />
            <div className="bg-dark-500 h-12 rounded-xl w-1/3" />
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="bg-dark-500 h-4 rounded-lg" />)}
          </div>
        </div>
      </div>
    )
  }

  const discount = getDiscount(product.price, product.discountPrice)
  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price
  const alreadyReviewed = product.reviews?.some((r) => r.user?._id === user?._id || r.user === user?._id)

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors mb-6 text-sm">
        <ChevronLeft size={16} /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-dark-700 rounded-2xl overflow-hidden aspect-square mb-3 border border-dark-500">
            <img
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 badge bg-rose-500 text-white text-sm">-{discount}%</span>
            )}
          </motion.div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary-500' : 'border-dark-500 opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <span className="text-primary-400 text-sm font-medium uppercase tracking-wide">{product.category}</span>
            <h1 className="text-3xl font-display font-bold text-white mt-1">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={product.ratings} numReviews={product.numReviews} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold gradient-text">{formatPrice(effectivePrice)}</span>
            {discount > 0 && (
              <div className="flex flex-col">
                <span className="text-slate-500 line-through text-lg">{formatPrice(product.price)}</span>
                <span className="text-rose-400 text-sm font-semibold">Save {discount}%</span>
              </div>
            )}
          </div>

          <p className="text-slate-300 leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <Package size={16} className={product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Qty + Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-dark-700 border border-dark-400 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-11 flex items-center justify-center text-white hover:bg-dark-500 transition-colors text-lg">−</button>
                <span className="w-12 text-center text-white font-bold">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-10 h-11 flex items-center justify-center text-white hover:bg-dark-500 transition-colors text-lg">+</button>
              </div>
              <button
                onClick={() => addToCart(product._id, qty)}
                disabled={cartLoading}
                className="btn-primary flex-1 py-3 text-base">
                <ShoppingCart size={18} />
                {cartLoading ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className="btn-secondary p-3">
                <Heart size={20} />
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'On $50+' },
              { icon: Shield, label: 'Secure Pay', sub: 'Stripe' },
              { icon: Package, label: 'Easy Returns', sub: '30 days' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="bg-dark-700 border border-dark-500 rounded-xl p-3 text-center">
                <Icon size={18} className="text-primary-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-white">{label}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6">Customer Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review list */}
          <div className="lg:col-span-2 space-y-4">
            {product.reviews?.length === 0 ? (
              <div className="card p-8 text-center text-slate-400">
                <p className="text-lg mb-1">No reviews yet</p>
                <p className="text-sm">Be the first to review this product!</p>
              </div>
            ) : (
              product.reviews?.map((r) => (
                <div key={r._id} className="card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {r.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{r.name}</p>
                      <p className="text-slate-500 text-xs">{formatDate(r.createdAt)}</p>
                    </div>
                    <div className="ml-auto">
                      <StarRating rating={r.rating} size={14} />
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{r.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Submit review */}
          <div className="card p-5 h-fit">
            <h3 className="text-white font-semibold mb-4">Write a Review</h3>
            {!isAuthenticated ? (
              <p className="text-slate-400 text-sm">
                <Link to="/login" className="text-primary-400 hover:underline">Login</Link> to write a review
              </p>
            ) : alreadyReviewed ? (
              <p className="text-emerald-400 text-sm">✓ You've already reviewed this product</p>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="label">Your Rating</label>
                  <StarRating rating={rating} interactive onRate={setRating} size={28} />
                </div>
                <div>
                  <label className="label">Your Review</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="input-field resize-none"
                  />
                </div>
                <button type="submit" disabled={reviewSubmitting} className="btn-primary w-full">
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
