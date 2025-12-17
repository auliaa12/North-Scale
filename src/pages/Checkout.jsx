import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { FaShoppingBag } from 'react-icons/fa';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    payment_method: '',
    shipping_method: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  // Shipping options with prices
  const shippingOptions = [
    { id: 'regular', name: 'Regular Shipping', price: 15000, estimate: '5-7 days' },
    { id: 'express', name: 'Express Shipping', price: 25000, estimate: '2-3 days' },
    { id: 'same_day', name: 'Same Day Delivery', price: 50000, estimate: 'Same day' },
  ];

  const getShippingCost = () => {
    const selected = shippingOptions.find(opt => opt.id === formData.shipping_method);
    return selected ? selected.price : 0;
  };

  const getTotalWithShipping = () => {
    return cart.total + getShippingCost();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Email is invalid';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Phone is required';
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Address is required';
    }

    if (!formData.payment_method) {
      newErrors.payment_method = 'Please select a payment method';
    }

    if (!formData.shipping_method) {
      newErrors.shipping_method = 'Please select a shipping method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      
      // Add shipping cost to order data
      const selectedShipping = shippingOptions.find(opt => opt.id === formData.shipping_method);
      const orderData = {
        ...formData,
        shipping_cost: selectedShipping?.price || 0,
        shipping_name: selectedShipping?.name || '',
        total_amount: getTotalWithShipping()
      };
      
      const response = await ordersAPI.create(orderData);
      const orderNumber = response.data.order_number;
      navigate(`/order-confirmation/${orderNumber}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
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
        <p className="text-gray-600 mb-8">Add some products before checkout!</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 fade-in">
      <div className="container-custom max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information */}
            <div className="lg:col-span-2">
              <div className="card p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Customer Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      className={`input-field ${errors.customer_name ? 'border-red-500' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.customer_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      className={`input-field ${errors.customer_email ? 'border-red-500' : ''}`}
                      placeholder="john@example.com"
                    />
                    {errors.customer_email && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      className={`input-field ${errors.customer_phone ? 'border-red-500' : ''}`}
                      placeholder="08123456789"
                    />
                    {errors.customer_phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Shipping Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleChange}
                      rows="4"
                      className={`input-field ${errors.shipping_address ? 'border-red-500' : ''}`}
                      placeholder="Enter your complete shipping address"
                    ></textarea>
                    {errors.shipping_address && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping_address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="input-field"
                      placeholder="Any special instructions for your order?"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="card p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Shipping Method</h2>
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`border p-4 rounded-lg cursor-pointer transition ${
                        formData.shipping_method === option.id
                          ? 'border-red-500 bg-red-50'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() =>
                        handleChange({
                          target: { name: 'shipping_method', value: option.id },
                        })
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="shipping_method"
                            value={option.id}
                            checked={formData.shipping_method === option.id}
                            onChange={handleChange}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                          />
                          <div className="ml-3">
                            <label className="block text-sm font-medium text-gray-900">
                              {option.name}
                            </label>
                            <p className="text-xs text-gray-500">
                              Estimated: {option.estimate}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(option.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.shipping_method && (
                  <p className="text-red-500 text-sm mt-2">{errors.shipping_method}</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="card p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <div className={`border p-4 rounded-lg cursor-pointer transition ${formData.payment_method === 'bank_transfer' ? 'border-red-500 bg-red-50' : 'hover:border-gray-300'}`}
                    onClick={() => handleChange({ target: { name: 'payment_method', value: 'bank_transfer' } })}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bank_transfer"
                        checked={formData.payment_method === 'bank_transfer'}
                        onChange={handleChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        Bank Transfer
                      </label>
                    </div>
                    {formData.payment_method === 'bank_transfer' && (
                      <div className="mt-4 ml-7 p-3 bg-white rounded border border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Please transfer to one of the following accounts:</p>
                        <ul className="text-sm font-medium">
                          <li className="flex justify-between py-1"><span>BCA:</span> <span>123-456-7890 (NorthScale)</span></li>
                          <li className="flex justify-between py-1"><span>Mandiri:</span> <span>098-765-4321 (NorthScale)</span></li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className={`border p-4 rounded-lg cursor-pointer transition ${formData.payment_method === 'cod' ? 'border-red-500 bg-red-50' : 'hover:border-gray-300'}`}
                    onClick={() => handleChange({ target: { name: 'payment_method', value: 'cod' } })}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={formData.payment_method === 'cod'}
                        onChange={handleChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        Cash on Delivery (COD)
                      </label>
                    </div>
                  </div>
                </div>
                {errors.payment_method && (
                  <p className="text-red-500 text-sm mt-2">{errors.payment_method}</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(cart.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {formData.shipping_method ? formatPrice(getShippingCost()) : '-'}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">{formatPrice(getTotalWithShipping())}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="btn-secondary w-full mt-3"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;



