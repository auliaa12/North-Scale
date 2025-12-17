import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, item_count: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Get current user

  const fetchCart = async () => {
    try {
      setLoading(true);
      // Pass user.id if logged in
      const response = await cartAPI.getCart(user?.id);

      // Transform API response (array wrapped in data) to Cart Context state shape
      const cartItems = response.data.data || []; // API returns { data: [...] }

      const total = cartItems.reduce((sum, item) => sum + (Number(item.product_price) * item.quantity), 0);
      const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

      setCart({
        items: cartItems.map(item => ({
          ...item,
          id: item.id,
          price: Number(item.product_price), // Ensure price is number
          name: item.product_name,
          image: item.product_image,
          product: { // Mock product object in case UI expects nested product
            id: item.product_id,
            name: item.product_name,
            price: Number(item.product_price),
            main_image: item.product_image,
            images: [{ image_path: item.product_image }]
          }
        })),
        total: total,
        item_count: itemCount
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Fallback empty state on error to prevent undefined crashes
      setCart({ items: [], total: 0, item_count: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartAPI.addToCart(productId, quantity, user?.id);
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const updateCartItem = async (id, quantity) => {
    try {
      await cartAPI.updateCart(id, quantity);
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Error updating cart:', error);
      return false;
    }
  };

  const removeFromCart = async (id) => {
    try {
      await cartAPI.removeFromCart(id);
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart(user?.id);
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]); // Refresh cart when user changes (login/logout)

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};



