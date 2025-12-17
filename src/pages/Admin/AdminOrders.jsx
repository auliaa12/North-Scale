import { useEffect, useState } from 'react';
import { ordersAPI } from '../../services/api';
import { FaEye, FaTrash, FaFilter } from 'react-icons/fa';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, per_page: 15 };
      if (statusFilter) params.status = statusFilter;

      const response = await ordersAPI.getAll(params);
      setOrders(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order) => {
    try {
      const response = await ordersAPI.getById(order.id);
      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to fetch order details');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);

      // Success message based on status
      const messages = {
        processing: 'Order marked as Processing!',
        shipped: 'Order marked as Shipped!',
        completed: 'Order completed successfully!',
        cancelled: 'Order has been cancelled.',
        pending: 'Order marked as Pending.'
      };

      alert(messages[newStatus] || 'Order status updated successfully!');
      fetchOrders();

      if (selectedOrder && selectedOrder.id === orderId) {
        const response = await ordersAPI.getById(orderId);
        setSelectedOrder(response.data);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await ordersAPI.delete(orderId);
      alert('Order deleted successfully!');
      fetchOrders();
      if (showModal) setShowModal(false);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex items-center space-x-3">
          <FaFilter className="text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-40"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Order Statistics */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-700 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-800">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Processing</p>
            <p className="text-2xl font-bold text-blue-800">
              {orders.filter(o => o.status === 'processing').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 font-medium">Shipped</p>
            <p className="text-2xl font-bold text-purple-800">
              {orders.filter(o => o.status === 'shipped').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-800">
              {orders.filter(o => o.status === 'completed').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-700 font-medium">Cancelled</p>
            <p className="text-2xl font-bold text-red-800">
              {orders.filter(o => o.status === 'cancelled').length}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="loading-spinner"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No orders found</p>
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order #</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-primary-600">{order.order_number}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-gray-600">{order.customer_email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3 font-bold">{formatPrice(order.total_amount)}</td>
                    <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {/* Quick Status Actions */}
                        {order.status?.toLowerCase().trim() === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'processing')}
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition"
                              title="Mark as Processing"
                            >
                              Process
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Cancel this order?')) {
                                  handleUpdateStatus(order.id, 'cancelled');
                                }
                              }}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition"
                              title="Cancel Order"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {order.status?.toLowerCase().trim() === 'processing' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'shipped')}
                            className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded transition"
                            title="Mark as Shipped"
                          >
                            Ship
                          </button>
                        )}
                        {order.status?.toLowerCase().trim() === 'shipped' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'completed')}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition"
                            title="Mark as Completed"
                          >
                            Complete
                          </button>
                        )}

                        {/* View & Delete Actions */}
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 ml-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchOrders(page)}
                  className={`px-4 py-2 rounded ${page === pagination.current_page
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-bold text-lg text-red-600">{selectedOrder.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment</p>
                <p className="font-medium capitalize">{selectedOrder.payment_method ? selectedOrder.payment_method.replace('_', ' ') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Shipping Method</p>
                <p className="font-medium">{selectedOrder.shipping_name || 'Standard Shipping'}</p>
                {selectedOrder.shipping_cost > 0 && (
                  <p className="text-xs text-gray-500">{formatPrice(selectedOrder.shipping_cost)}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-bold text-lg text-red-600">{formatPrice(selectedOrder.total_amount)}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-bold mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                <p><strong>Address:</strong> {selectedOrder.customer_address}</p>
                {selectedOrder.notes && (
                  <p><strong>Notes:</strong> {selectedOrder.notes}</p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 border rounded-lg">
                    {item.product && item.product.main_image && (
                      <img
                        src={item.product.main_image?.startsWith('data:image/') || item.product.main_image?.startsWith('http://') || item.product.main_image?.startsWith('https://')
                          ? item.product.main_image
                          : item.product.main_image
                            ? item.product.main_image
                            : '/placeholder-product.jpg'}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.product_price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(selectedOrder.subtotal || selectedOrder.total)}</span>
                </div>
                {selectedOrder.shipping_cost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping ({selectedOrder.shipping_name})</span>
                    <span className="font-medium">{formatPrice(selectedOrder.shipping_cost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-red-600">{formatPrice(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium mb-2">Update Order Status</label>
              <div className="flex gap-2">
                <select
                  className="input-field flex-1"
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                className="btn-danger flex-1"
              >
                Delete Order
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;



