import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/orders/create', data)
    return res.data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchMyOrders = createAsyncThunk('orders/myOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders/my-orders')
    return res.data.orders
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/orders/${id}`)
    return res.data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders', { params })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const markOrderDelivered = createAsyncThunk('orders/deliver', async (id, { rejectWithValue }) => {
  try {
    const res = await api.put(`/orders/${id}/deliver`)
    return res.data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const createCheckoutSession = createAsyncThunk('orders/checkout', async (orderId, { rejectWithValue }) => {
  try {
    const res = await api.post('/payment/create-checkout-session', { orderId })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], order: null, loading: false, error: null },
  reducers: {
    clearOrder: (state) => { state.order = null },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }
    builder
      .addCase(createOrder.pending, pending)
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.order = action.payload })
      .addCase(createOrder.rejected, rejected)
      .addCase(fetchMyOrders.pending, pending)
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload })
      .addCase(fetchMyOrders.rejected, rejected)
      .addCase(fetchOrder.pending, pending)
      .addCase(fetchOrder.fulfilled, (state, action) => { state.loading = false; state.order = action.payload })
      .addCase(fetchOrder.rejected, rejected)
      .addCase(fetchAllOrders.pending, pending)
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload.orders })
      .addCase(fetchAllOrders.rejected, rejected)
      .addCase(markOrderDelivered.fulfilled, (state, action) => {
        state.order = action.payload
        state.orders = state.orders.map(o => o._id === action.payload._id ? action.payload : o)
      })
      .addCase(createCheckoutSession.pending, pending)
      .addCase(createCheckoutSession.fulfilled, (state) => { state.loading = false })
      .addCase(createCheckoutSession.rejected, rejected)
  },
})

export const { clearOrder } = orderSlice.actions
export default orderSlice.reducer
