import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { FaCheckCircle, FaBox } from 'react-icons/fa';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await ordersAPI.getById(orderNumber);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="py-16 fade-in">
      <div className="container-custom max-w-3xl text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <FaCheckCircle className="text-8xl text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-xl text-gray-600">Thank you for your order</p>
        </div>

        {/* Order Info */}
        <div className="card p-8 mb-8 text-left">
          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-red-600">{orderNumber}</p>
            </div>
            <FaBox className="text-4xl text-gray-400" />
          </div>

          {order && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-gray-600">{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Shipping Method</p>
                  <p className="font-medium">{order.shipping_name || 'Standard Shipping'}</p>
                  {order.shipping_cost > 0 && (
                    <p className="text-sm text-gray-600">{formatPrice(order.shipping_cost)}</p>
                  )}
                </div>
              </div>

              <div className="mb-6 pb-6 border-b">
                <p className="text-sm text-gray-500 mb-2">Order Summary</p>
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product_name} x{item.quantity}
                      </span>
                      <span className="font-medium">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(order.subtotal || order.total)}</span>
                  </div>
                  {order.shipping_cost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span>{formatPrice(order.shipping_cost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              <strong>What's Next?</strong><br />
              We'll process your order and send you a confirmation email with tracking details soon.
            </p>
          </div>

          <div className="space-y-3 text-gray-600">
            <p>✓ Order confirmation sent to your email</p>
            <p>✓ We'll notify you when your order is shipped</p>
            <p>✓ You can contact us if you have any questions</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-gray-600">
          <p className="mb-2">Need help with your order?</p>
          <p className="text-red-600 font-medium">Contact us via live chat or email at admin@diecast.com</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;



