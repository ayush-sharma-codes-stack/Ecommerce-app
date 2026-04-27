import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, X, ChevronLeft, Save, Image, Loader } from 'lucide-react'
import { fetchProduct, createProduct, updateProduct } from '../../store/slices/productSlice'
import toast from 'react-hot-toast'

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other']

export default function AdminProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { product, loading } = useSelector((s) => s.products)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '', stock: '', category: 'Electronics',
  })
  const [previews, setPreviews] = useState([])
  const [files, setFiles] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (isEdit) dispatch(fetchProduct(id))
  }, [id, isEdit, dispatch])

  useEffect(() => {
    if (isEdit && product && product._id === id) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        stock: product.stock || '',
        category: product.category || 'Electronics',
      })
      setExistingImages(product.images || [])
    }
  }, [product, isEdit, id])

  const handleFiles = (incoming) => {
    const valid = Array.from(incoming).filter((f) => f.type.startsWith('image/') && f.size < 5 * 1024 * 1024)
    if (valid.length !== incoming.length) toast.error('Some files were skipped (max 5MB, images only)')
    setFiles((prev) => [...prev, ...valid])
    valid.forEach((f) => {
      const reader = new FileReader()
      reader.onload = (e) => setPreviews((prev) => [...prev, e.target.result])
      reader.readAsDataURL(f)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeNewFile = (i) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i))
    setPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  const removeExisting = (i) => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.price || !form.stock || !form.category)
      return toast.error('Please fill all required fields')

    setSubmitting(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    files.forEach((f) => fd.append('images', f))

    // Include remaining existing images (for edit)
    if (isEdit) fd.append('existingImages', JSON.stringify(existingImages))

    const action = isEdit ? updateProduct({ id, formData: fd }) : createProduct(fd)
    const res = await dispatch(action)

    setSubmitting(false)

    if ((isEdit ? updateProduct : createProduct).fulfilled.match(res)) {
      toast.success(isEdit ? 'Product updated!' : 'Product created!')
      navigate('/admin/products')
    } else {
      toast.error(res.payload || 'Operation failed')
    }
  }

  return (
    <div className="page-container max-w-3xl">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors mb-6 text-sm">
        <ChevronLeft size={16} /> Back to Products
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
          {isEdit ? <Save size={20} className="text-primary-400" /> : <Image size={20} className="text-primary-400" />}
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-white">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-slate-400 text-sm">{isEdit ? `Editing: ${form.name}` : 'Fill in the details below'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h3 className="text-white font-semibold border-b border-dark-500 pb-3">Basic Information</h3>
          <div>
            <label className="label">Product Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Sony WH-1000XM5 Headphones" required />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input-field resize-none" placeholder="Describe the product..." required />
          </div>
          <div>
            <label className="label">Category *</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="card p-6">
          <h3 className="text-white font-semibold border-b border-dark-500 pb-3 mb-4">Pricing & Inventory</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Price (USD) *</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="0.00" required />
            </div>
            <div>
              <label className="label">Discount Price</label>
              <input type="number" step="0.01" min="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="label">Stock Quantity *</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" placeholder="0" required />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6">
          <h3 className="text-white font-semibold border-b border-dark-500 pb-3 mb-4">Product Images</h3>

          {/* Existing images (edit mode) */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-slate-400 text-xs mb-2">Existing Images</p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-20 h-20 rounded-xl object-cover border border-dark-400" />
                    <button type="button" onClick={() => removeExisting(i)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New previews */}
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt="" className="w-20 h-20 rounded-xl object-cover border-2 border-primary-500/50" />
                  <button type="button" onClick={() => removeNewFile(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragging ? 'border-primary-500 bg-primary-500/10' : 'border-dark-400 hover:border-primary-600 hover:bg-dark-700'}`}>
            <Upload size={28} className={`mx-auto mb-2 ${dragging ? 'text-primary-400' : 'text-slate-500'}`} />
            <p className="text-slate-300 font-medium">Drop images here or <span className="text-primary-400">browse</span></p>
            <p className="text-slate-500 text-xs mt-1">PNG, JPG, WebP — Max 5MB each · Up to 5 images</p>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/admin/products" className="btn-secondary flex-1 justify-center">Cancel</Link>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
            {submitting ? <><Loader size={16} className="animate-spin" /> {isEdit ? 'Saving...' : 'Creating...'}</> : <><Save size={16} /> {isEdit ? 'Save Changes' : 'Create Product'}</>}
          </button>
        </div>
      </form>
    </div>
  )
}
