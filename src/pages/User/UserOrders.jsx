import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import AccountLayout from '../../components/Layout/AccountLayout';
import { FaBoxOpen } from 'react-icons/fa';

const UserOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (user?.id) {
                    const response = await userAPI.getUserOrders(user.id);
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-50';
            case 'processing': return 'text-blue-600 bg-blue-50';
            case 'shipped': return 'text-purple-600 bg-purple-50';
            case 'cancelled': return 'text-red-600 bg-red-50';
            default: return 'text-yellow-600 bg-yellow-50';
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <AccountLayout>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold">My Orders</h1>
                </div>

                {loading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                        <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {orders.map((order) => (
                            <div key={order.order_number} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                    <div>
                                        <span className="font-bold text-gray-900">Order #{order.order_number}</span>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Placed on {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="mt-2 md:mt-0">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} capitalize`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            {/* Product Image */}
                                            <div className="w-16 h-16 bg-gray-100 rounded md:w-20 md:h-20 flex-shrink-0">
                                                {item.product?.main_image ? (
                                                    <img
                                                        src={item.product.main_image?.startsWith('data:image/') || item.product.main_image?.startsWith('http://') || item.product.main_image?.startsWith('https://')
                                                            ? item.product.main_image
                                                            : item.product.main_image
                                                                ? item.product.main_image
                                                                : '/placeholder-product.jpg'}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover rounded"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-product.jpg';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatPrice(item.product_price)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center border-t pt-4">
                                    <div className="text-sm text-gray-500">
                                        Payment Method: <span className="font-medium capitalize">{order.payment_method ? order.payment_method.replace('_', ' ') : 'N/A'}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-gray-600 mr-2">Total Amount:</span>
                                        <span className="text-lg font-bold text-red-500">{formatPrice(order.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AccountLayout>
    );
};

export default UserOrders;
