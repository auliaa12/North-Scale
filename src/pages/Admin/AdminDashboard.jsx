import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { FaCar, FaBox, FaList, FaShoppingCart, FaSignOutAlt, FaChartLine, FaComments } from 'react-icons/fa';
import { useEffect } from 'react';

const AdminDashboard = () => {
  const { admin, loading, logout } = useAuth(); // Explicitly use 'admin'
  const { unreadCount } = useChat();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, loading, navigate]);

  const handleLogout = async () => {
    await logout('admin'); // Specify role to logout
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const menuItems = [
    { path: '/admin/analytics', icon: FaChartLine, label: 'Analytics', badge: null },
    { path: '/admin/products', icon: FaBox, label: 'Products', badge: null },
    { path: '/admin/categories', icon: FaList, label: 'Categories', badge: null },
    { path: '/admin/orders', icon: FaShoppingCart, label: 'Orders', badge: null },
    { path: '/admin/chat', icon: FaComments, label: 'Customer Chat', badge: unreadCount },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            <Link to="/admin" className="flex items-center space-x-2">
              <FaCar className="text-3xl text-primary-600" />
              <span className="text-2xl font-bold text-gray-800">
                Admin<span className="text-primary-600">Panel</span>
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, <strong>{admin?.name}</strong></span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${isActive
                          ? 'bg-red-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge > 0 && (
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${isActive ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 px-4 py-2"
                >
                  <span>View Website</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



