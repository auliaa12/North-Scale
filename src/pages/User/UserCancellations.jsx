import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import AccountLayout from '../../components/Layout/AccountLayout';
import { FaTimesCircle } from 'react-icons/fa';

const UserCancellations = () => {
    const { user } = useAuth();
    const [cancellations, setCancellations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCancellations = async () => {
            try {
                if (user?.id) {
                    // Assuming we reuse getUserOrders but filter client-side or add API param
                    const response = await userAPI.getUserOrders(user.id);
                    const cancelled = response.data.data.filter(order => order.status === 'cancelled');
                    setCancellations(cancelled);
                }
            } catch (error) {
                console.error('Failed to fetch cancellations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCancellations();
    }, [user]);

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
                    <h1 className="text-xl font-bold">My Cancellations</h1>
                </div>

                {loading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : cancellations.length === 0 ? (
                    <div className="p-12 text-center">
                        <FaTimesCircle className="mx-auto text-4xl text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No cancellations</h3>
                        <p className="text-gray-500">You don't have any cancelled orders.</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {cancellations.map((order) => (
                            <div key={order.order_number} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold">Order #{order.order_number}</span>
                                    <span className="text-red-500 font-medium capitalize">{order.status}</span>
                                </div>
                                <div className="text-sm text-gray-500 mb-2">
                                    Cancelled on {new Date(order.updated_at || order.created_at).toLocaleDateString()}
                                </div>
                                <div className="text-right font-bold">
                                    {formatPrice(order.total_amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AccountLayout>
    );
};

export default UserCancellations;
