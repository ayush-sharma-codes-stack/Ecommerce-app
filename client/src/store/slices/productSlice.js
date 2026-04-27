import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/products', { params })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/products/${id}`)
    return res.data.product
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const createProduct = createAsyncThunk('products/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data.product
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data.product
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const submitReview = createAsyncThunk('products/review', async ({ id, data }, { rejectWithValue }) => {
  try {
    await api.post(`/products/${id}/reviews`, data)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
    page: 1,
    pages: 1,
    total: 0,
    filters: { keyword: '', category: '', minPrice: '', maxPrice: '', minRating: '', sortBy: 'createdAt', order: 'desc' },
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    clearFilters: (state) => { state.filters = { keyword: '', category: '', minPrice: '', maxPrice: '', minRating: '', sortBy: 'createdAt', order: 'desc' } },
    clearProduct: (state) => { state.product = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.page = action.payload.page
        state.pages = action.payload.pages
        state.total = action.payload.total
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchProduct.pending, (state) => { state.loading = true; state.error = null; state.product = null })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.loading = false; state.product = action.payload })
      .addCase(fetchProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload)
      })
  },
})

export const { setFilters, clearFilters, clearProduct } = productSlice.actions
export default productSlice.reducer
