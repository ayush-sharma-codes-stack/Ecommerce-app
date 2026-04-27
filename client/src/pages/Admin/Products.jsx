import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Image, Package } from 'lucide-react'
import { fetchProducts, deleteProduct } from '../../store/slices/productSlice'
import { formatPrice } from '../../utils/helpers'
import { ProductCardSkeleton } from '../../components/Skeleton'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((s) => s.products)

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }))
  }, [dispatch])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    const res = await dispatch(deleteProduct(id))
    if (deleteProduct.fulfilled.match(res)) toast.success('Product deleted')
    else toast.error(res.payload || 'Delete failed')
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Products</h1>
          <p className="text-slate-400 mt-1">{products.length} products in catalogue</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-700 border-b border-dark-500">
                <tr>
                  {['Image', 'Name', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map((h) => (
                    <th key={h} className="py-3.5 px-4 text-left text-slate-400 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <motion.tr key={p._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-dark-600 hover:bg-dark-700/50 transition-colors">
                    <td className="py-3 px-4">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-dark-500" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-dark-500 flex items-center justify-center">
                          <Image size={18} className="text-slate-500" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-white font-medium max-w-48 truncate">{p.name}</p>
                      <p className="text-slate-500 text-xs font-mono">{p._id.slice(-8)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge bg-primary-500/20 text-primary-400 border border-primary-500/20 text-xs">{p.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-white font-semibold">{formatPrice(p.discountPrice > 0 ? p.discountPrice : p.price)}</p>
                      {p.discountPrice > 0 && <p className="text-slate-500 text-xs line-through">{formatPrice(p.price)}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${p.stock > 10 ? 'text-emerald-400' : p.stock > 0 ? 'text-yellow-400' : 'text-rose-400'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-amber-400 font-semibold">★ {p.ratings?.toFixed(1) || '0.0'}</span>
                      <span className="text-slate-500 text-xs ml-1">({p.numReviews})</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/products/${p._id}/edit`}
                          className="w-8 h-8 bg-primary-500/20 hover:bg-primary-500/40 border border-primary-500/30 rounded-lg flex items-center justify-center text-primary-400 transition-colors">
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => handleDelete(p._id, p.name)}
                          className="w-8 h-8 bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 rounded-lg flex items-center justify-center text-rose-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="py-16 text-center">
                <Package size={48} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No products yet. <Link to="/admin/products/new" className="text-primary-400 hover:underline">Add one</Link></p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
