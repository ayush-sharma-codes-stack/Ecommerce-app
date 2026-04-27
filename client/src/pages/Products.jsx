import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, ChevronDown, Search, Grid, List } from 'lucide-react'
import { fetchProducts, setFilters, clearFilters } from '../store/slices/productSlice'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/Skeleton'
import { useDebounce } from '../hooks/useDebounce'

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other']
const SORT_OPTIONS = [
  { label: 'Newest', value: 'createdAt:desc' },
  { label: 'Price: Low to High', value: 'price:asc' },
  { label: 'Price: High to Low', value: 'price:desc' },
  { label: 'Top Rated', value: 'ratings:desc' },
]

export default function Products() {
  const dispatch = useDispatch()
  const { products, loading, page, pages, total, filters } = useSelector((s) => s.products)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [localKeyword, setLocalKeyword] = useState(searchParams.get('keyword') || '')
  const debouncedKeyword = useDebounce(localKeyword, 400)

  const getPage = () => Number(searchParams.get('page') || 1)

  const buildQuery = useCallback(() => {
    const q = {}
    if (filters.keyword) q.keyword = filters.keyword
    if (filters.category) q.category = filters.category
    if (filters.minPrice) q.minPrice = filters.minPrice
    if (filters.maxPrice) q.maxPrice = filters.maxPrice
    if (filters.minRating) q.minRating = filters.minRating
    q.sortBy = filters.sortBy
    q.order = filters.order
    q.page = getPage()
    q.limit = 12
    return q
  }, [filters, searchParams])

  useEffect(() => {
    const cat = searchParams.get('category')
    const kw = searchParams.get('keyword')
    if (cat) dispatch(setFilters({ category: cat }))
    if (kw) dispatch(setFilters({ keyword: kw }))
  }, [])

  useEffect(() => {
    dispatch(setFilters({ keyword: debouncedKeyword }))
  }, [debouncedKeyword])

  useEffect(() => {
    dispatch(fetchProducts(buildQuery()))
  }, [filters, searchParams])

  const handleSort = (val) => {
    const [sortBy, order] = val.split(':')
    dispatch(setFilters({ sortBy, order }))
  }

  const handleCategoryToggle = (cat) => {
    dispatch(setFilters({ category: filters.category === cat ? '' : cat }))
    setSearchParams({ page: '1' })
  }

  const handleReset = () => {
    dispatch(clearFilters())
    setLocalKeyword('')
    setSearchParams({})
  }

  const setPage = (p) => setSearchParams({ ...Object.fromEntries(searchParams), page: String(p) })

  return (
    <div className="page-container">
      <title>Products — ShopElite</title>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">All Products</h1>
          <p className="text-slate-400 mt-1">{total} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-secondary gap-2 sm:hidden">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <select
            onChange={(e) => handleSort(e.target.value)}
            defaultValue="createdAt:desc"
            className="input-field py-2 text-sm w-48">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters — Desktop always visible, mobile toggle */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} sm:block w-full sm:w-64 flex-shrink-0`}>
          <div className="card p-5 sticky top-20 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2"><SlidersHorizontal size={16} className="text-primary-400" />Filters</h3>
              <button onClick={handleReset} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"><X size={12} /> Reset</button>
            </div>

            {/* Search */}
            <div>
              <label className="label">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={localKeyword}
                  onChange={(e) => setLocalKeyword(e.target.value)}
                  className="input-field pl-9 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="label">Category</label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-slate-300 hover:bg-dark-500'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="label">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => dispatch(setFilters({ minPrice: e.target.value }))}
                  className="input-field py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => dispatch(setFilters({ maxPrice: e.target.value }))}
                  className="input-field py-2 text-sm"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="label">Min Rating</label>
              <div className="space-y-1">
                {[4, 3, 2, 1].map((r) => (
                  <button
                    key={r}
                    onClick={() => dispatch(setFilters({ minRating: filters.minRating === String(r) ? '' : String(r) }))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${filters.minRating === String(r) ? 'bg-primary-500/20 text-primary-400' : 'text-slate-300 hover:bg-dark-500'}`}>
                    {'★'.repeat(r)}{'☆'.repeat(5 - r)} <span className="text-xs">& up</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
              <p className="text-slate-400 mb-6">Try adjusting your filters or search terms</p>
              <button onClick={handleReset} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={filters.category + filters.keyword + page}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button onClick={() => setPage(page - 1)} disabled={page === 1} className="btn-secondary px-4 py-2 disabled:opacity-40">←</button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30' : 'btn-secondary'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(page + 1)} disabled={page === pages} className="btn-secondary px-4 py-2 disabled:opacity-40">→</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
