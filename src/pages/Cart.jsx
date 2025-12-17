import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaMinus, FaPlus, FaTrash, FaShoppingBag, FaArrowRight } from 'react-icons/fa';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(itemId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Start adding some products to your cart!</p>
        <Link to="/products" className="btn-primary inline-block">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 fade-in">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="card flex gap-4 p-4">
                {/* Image */}
                <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0">
                  <img
                    src={item.product.main_image?.startsWith('data:image/') || item.product.main_image?.startsWith('http://') || item.product.main_image?.startsWith('https://')
                      ? item.product.main_image
                      : `http://localhost:8000/storage/${item.product.main_image}`}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="font-semibold text-gray-800 hover:text-primary-600 line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-lg font-bold text-primary-600 mt-2">
                    {formatPrice(item.product.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded flex items-center justify-center transition"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-600 flex items-center space-x-1"
                    >
                      <FaTrash />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cart.item_count})</span>
                  <span className="font-medium">{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(cart.total)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full flex items-center justify-center space-x-2">
                <span>Proceed to Checkout</span>
                <FaArrowRight />
              </Link>

              <Link to="/products" className="btn-secondary w-full mt-3 text-center block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;



