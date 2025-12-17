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
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
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



