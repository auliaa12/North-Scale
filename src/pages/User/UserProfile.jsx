import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import AccountLayout from '../../components/Layout/AccountLayout';

const UserProfile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
                throw new Error('New passwords do not match');
            }

            await userAPI.updateProfile(user.id, formData);
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AccountLayout>
            <div className="bg-white rounded-lg p-8 shadow-sm border">
                <h1 className="text-2xl font-bold text-red-500 mb-8">Edit Your Profile</h1>

                {message.text && (
                    <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="input-field bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <textarea
                                name="address"
                                rows="3"
                                value={formData.address}
                                onChange={handleChange}
                                className="input-field"
                            ></textarea>
                        </div>
                    </div>

                    <div className="border-t pt-8 mb-8">
                        <h2 className="text-lg font-bold mb-6">Password Changes</h2>
                        <div className="space-y-4 max-w-md">
                            <input
                                type="password"
                                name="currentPassword"
                                placeholder="Current Password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="input-field"
                            />
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="New Password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="input-field"
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm New Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" className="text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded font-medium disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AccountLayout>
    );
};

export default UserProfile;
