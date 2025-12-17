import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaShoppingBag, FaTimesCircle, FaStar, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';

const AccountLayout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    const menuItems = [
        { name: 'My Profile', path: '/account', icon: FaUser },
        { name: 'My Orders', path: '/account/orders', icon: FaShoppingBag },
        { name: 'My Cancellations', path: '/account/cancellations', icon: FaTimesCircle },
        { name: 'My Reviews', path: '/account/reviews', icon: FaStar },
        { name: 'Address Book', path: '/account/address', icon: FaMapMarkerAlt },
        { name: 'Payment Options', path: '/account/payment', icon: FaCreditCard },
    ];

    return (
        <div className="container-custom py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-bold mb-1">Manage My Account</h2>
                        <div className="text-sm text-gray-500 mb-6">{user?.name}</div>

                        <nav className="space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-2 rounded-md transition ${location.pathname === item.path ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <item.icon className={location.pathname === item.path ? 'text-red-500' : 'text-gray-400'} />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AccountLayout;
