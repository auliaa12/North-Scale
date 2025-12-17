import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'

// Layout
import Layout from './components/Layout/Layout'
import ChatWidget from './components/ChatWidget'

// Route Protection
import ProtectedRoute from './components/Route/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import About from './pages/About'

import OrderConfirmation from './pages/OrderConfirmation'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import UserProfile from './pages/User/UserProfile'
import UserOrders from './pages/User/UserOrders'

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminProducts from './pages/Admin/AdminProducts'
import AdminProductForm from './pages/Admin/AdminProductForm'
import AdminCategories from './pages/Admin/AdminCategories'
import AdminOrders from './pages/Admin/AdminOrders'
import AdminAnalytics from './pages/Admin/AdminAnalytics'
import AdminChat from './pages/Admin/AdminChat'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <CartProvider>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Layout />
                <ChatWidget />
              </>
            }>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="about" element={<About />} />
              <Route path="order-confirmation/:orderNumber" element={<OrderConfirmation />} />
            </Route>

            {/* User Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/wishlist" element={<Wishlist />} />

            {/* User Dashboard Routes - Protected */}
            <Route path="/account" element={
              <ProtectedRoute requiredRole="user">
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<UserProfile />} />
              <Route path="orders" element={<UserOrders />} />
            </Route>

            {/* Admin Routes - Protected */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }>
              <Route index element={<AdminAnalytics />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/edit/:id" element={<AdminProductForm />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="chat" element={<AdminChat />} />
            </Route>
          </Routes>
          </CartProvider>
        </ChatProvider>
      </AuthProvider>
    </Router>
  )
}

export default App



