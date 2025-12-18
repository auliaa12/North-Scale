import { useEffect, useState } from 'react';
import { ordersAPI, productsAPI } from '../../services/api';
import { FaDollarSign, FaShoppingCart, FaBox, FaUsers, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch orders
      const ordersResponse = await ordersAPI.getAll({});
      const orders = ordersResponse.data.data || [];

      // Fetch products
      const productsResponse = await productsAPI.getAll({});
      const products = productsResponse.data.data || [];

      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const totalRevenue = orders.reduce((sum, order) => {
        return sum + Number(order.total_amount || order.total || 0);
      }, 0);

      const todayRevenue = orders
        .filter(order => new Date(order.created_at) >= today)
        .reduce((sum, order) => sum + Number(order.total_amount || order.total || 0), 0);

      const weekRevenue = orders
        .filter(order => new Date(order.created_at) >= weekAgo)
        .reduce((sum, order) => sum + Number(order.total_amount || order.total || 0), 0);

      const monthRevenue = orders
        .filter(order => new Date(order.created_at) >= monthAgo)
        .reduce((sum, order) => sum + Number(order.total_amount || order.total || 0), 0);

      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      // Get recent orders (last 5)
      const recentOrders = orders.slice(0, 5);

      // Calculate top selling products
      const productSales = {};
      orders.forEach(order => {
        order.items?.forEach(item => {
          if (!productSales[item.product_id]) {
            productSales[item.product_id] = {
              name: item.product_name,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[item.product_id].quantity += item.quantity;
          productSales[item.product_id].revenue += item.subtotal;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - b.quantity)
        .slice(0, 5);

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        pendingOrders,
        todayRevenue,
        weekRevenue,
        monthRevenue,
        recentOrders,
        topProducts
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics & Revenue</h1>
        <button onClick={fetchAnalytics} className="btn-primary">
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FaDollarSign className="text-2xl" />
            </div>
            <FaChartLine className="text-3xl opacity-20" />
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
          <p className="text-xs mt-2 opacity-75">All time earnings</p>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FaShoppingCart className="text-2xl" />
            </div>
            <FaArrowUp className="text-3xl opacity-20" />
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
          <p className="text-xs mt-2 opacity-75">
            {stats.pendingOrders} pending orders
          </p>
        </div>

        {/* Total Products */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FaBox className="text-2xl" />
            </div>
            <FaBox className="text-3xl opacity-20" />
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Products</h3>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
          <p className="text-xs mt-2 opacity-75">In catalog</p>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FaChartLine className="text-2xl" />
            </div>
            <FaDollarSign className="text-3xl opacity-20" />
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">This Month</h3>
          <p className="text-2xl font-bold">{formatPrice(stats.monthRevenue)}</p>
          <p className="text-xs mt-2 opacity-75">Last 30 days</p>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Today's Revenue</h3>
            <FaDollarSign className="text-green-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatPrice(stats.todayRevenue)}</p>
          <p className="text-sm text-gray-500 mt-2">Revenue for today</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">This Week</h3>
            <FaChartLine className="text-blue-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatPrice(stats.weekRevenue)}</p>
          <p className="text-sm text-gray-500 mt-2">Last 7 days</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Pending Orders</h3>
            <FaShoppingCart className="text-yellow-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
          <p className="text-sm text-gray-500 mt-2">Awaiting processing</p>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{order.order_number}</p>
                    <p className="text-xs text-gray-500">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatPrice(order.total_amount || order.total)}</p>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {stats.topProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sales data yet</p>
            ) : (
              stats.topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.quantity} units sold</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-gray-900">
                    {formatPrice(product.revenue)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;




