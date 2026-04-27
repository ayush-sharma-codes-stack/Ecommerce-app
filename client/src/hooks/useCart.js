import { useSelector, useDispatch } from 'react-redux'
import { fetchCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice'
import { openCartDrawer } from '../store/slices/uiSlice'
import toast from 'react-hot-toast'

export const useCart = () => {
  const dispatch = useDispatch()
  const { items, totalItems, totalPrice, loading } = useSelector((s) => s.cart)
  const { isAuthenticated } = useSelector((s) => s.auth)

  const handleAddToCart = async (productId, qty = 1) => {
    if (!isAuthenticated) { toast.error('Please login to add items to cart'); return }
    const result = await dispatch(addToCart({ productId, qty }))
    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart!')
      dispatch(openCartDrawer())
    } else {
      toast.error(result.payload || 'Failed to add to cart')
    }
  }

  return {
    items, totalItems, totalPrice, loading,
    fetchCart: () => dispatch(fetchCart()),
    addToCart: handleAddToCart,
    updateCartItem: (productId, qty) => dispatch(updateCartItem({ productId, qty })),
    removeFromCart: (productId) => dispatch(removeFromCart(productId)),
    clearCart: () => dispatch(clearCart()),
  }
}
