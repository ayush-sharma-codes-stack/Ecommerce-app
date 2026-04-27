import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout')
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me')
    return res.data
  } catch (err) {
    return rejectWithValue(null)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.accessToken
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.accessToken)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false; state.error = action.payload
      })
    // Login
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.accessToken
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.accessToken)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false; state.error = action.payload
      })
    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null; state.token = null; state.isAuthenticated = false
        localStorage.removeItem('token')
      })
    // FetchMe
    builder
      .addCase(fetchMe.pending, (state) => { state.loading = true })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.initialized = true
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false; state.isAuthenticated = false
        state.user = null; state.initialized = true
        localStorage.removeItem('token')
      })
  },
})

export const { setToken, clearAuth } = authSlice.actions
export default authSlice.reducer
