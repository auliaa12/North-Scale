import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaCar, FaHeart, FaUser, FaTimesCircle, FaStar, FaSignOutAlt, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

const Header = () => {
  const { cart } = useCart();
  const { user, logout, checkAuth } = useAuth(); // Explicitly use 'user' (customer)
  const navigate = useNavigate();
  const location = useLocation(); // Need this for dependency
  const [searchQuery, setSearchQuery] = useState('');

  // Force re-check auth on route change to ensure UI stays in sync
  useEffect(() => {
    if (checkAuth) checkAuth();
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-black text-white py-2">
        <div className="container-custom">
          <div className="flex items-center justify-between text-sm">
            <p>Summer Sale For All Diecast Models And Free Express Delivery - OFF 50%!</p>
            <Link to="/products" className="font-semibold underline hover:text-red-400 transition">
              ShopNow
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom">
        <div className="flex items-center justify-between py-4 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-2xl font-bold text-gray-800">
              North<span className="text-red-600">Scale</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-red-600 font-medium transition border-b-2 border-transparent hover:border-red-600">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-red-600 font-medium transition border-b-2 border-transparent hover:border-red-600">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-red-600 font-medium transition border-b-2 border-transparent hover:border-red-600">
              About
            </Link>
            {!user ? (
              <Link to="/login" className="text-gray-700 hover:text-red-600 font-medium transition border-b-2 border-transparent hover:border-red-600">
                Sign In
              </Link>
            ) : (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium transition">
                  <span>{user?.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg py-2 border border-gray-100">
                    <Link to="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-black/5 hover:text-black transition">
                      <FaUser className="mr-3" /> Manage My Account
                    </Link>
                    <Link to="/account/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-black/5 hover:text-black transition">
                      <FaShoppingBag className="mr-3" /> My Orders
                    </Link>
                    <Link to="/account/cancellations" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-black/5 hover:text-black transition">
                      <FaTimesCircle className="mr-3" /> My Cancellations
                    </Link>
                    <Link to="/account/reviews" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-black/5 hover:text-black transition">
                      <FaStar className="mr-3" /> My Reviews
                    </Link>
                    <button onClick={logout} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-black/5 hover:text-black transition text-left">
                      <FaSignOutAlt className="mr-3" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Search & Icons */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 px-4 py-2 pr-10 rounded w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <FaSearch className="text-gray-600" />
              </button>
            </form>

            {/* Wishlist */}
            <Link to="/wishlist" className="text-gray-700 hover:text-red-600 transition relative">
              <FaHeart className="text-2xl" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-700 hover:text-red-600 transition">
              <FaShoppingCart className="text-2xl" />
              {cart.item_count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart.item_count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-100 px-4 py-2 pr-10 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <FaSearch className="text-gray-600" />
            </button>
          </div>
        </form>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center space-x-6 pb-4 border-t pt-4">
          <Link to="/" className="text-gray-700 hover:text-red-600 font-medium transition">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-red-600 font-medium transition">
            Products
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-red-600 font-medium transition">
            About
          </Link>
          <Link to="/login" className="text-gray-700 hover:text-red-600 font-medium transition">
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;


