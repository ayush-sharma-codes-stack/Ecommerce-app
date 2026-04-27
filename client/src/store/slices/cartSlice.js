import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart')
    return res.data.cart
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const addToCart = createAsyncThunk('cart/add', async ({ productId, qty }, { rejectWithValue }) => {
  try {
    const res = await api.post('/cart/add', { productId, qty })
    return res.data.cart
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, qty }, { rejectWithValue }) => {
  try {
    const res = await api.put('/cart/update', { productId, qty })
    return res.data.cart
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const removeFromCart = createAsyncThunk('cart/remove', async (productId, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/cart/remove/${productId}`)
    return res.data.cart
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart/clear')
    return null
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.items = []; state.totalItems = 0; state.totalPrice = 0
    },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.loading = false
      const cart = action.payload
      if (cart) {
        state.items = cart.items || []
        state.totalPrice = cart.totalPrice || 0
        state.totalItems = (cart.items || []).reduce((a, i) => a + i.qty, 0)
      } else {
        state.items = []; state.totalPrice = 0; state.totalItems = 0
      }
    }
    const pending = (state) => { state.loading = true; state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }

    builder
      .addCase(fetchCart.pending, pending)
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, rejected)
      .addCase(addToCart.pending, pending)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, rejected)
      .addCase(updateCartItem.pending, pending)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(updateCartItem.rejected, rejected)
      .addCase(removeFromCart.pending, pending)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(removeFromCart.rejected, rejected)
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []; state.totalItems = 0; state.totalPrice = 0; state.loading = false
      })
  },
})

export const { resetCart } = cartSlice.actions
export default cartSlice.reducer
