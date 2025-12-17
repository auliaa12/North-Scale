import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/localStorage';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await userService.register(formData);
            navigate('/login', { replace: true, state: { registered: true } });
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header Navigation */}
            <header className="border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="text-2xl font-bold">
                            North<span className="text-red-600">Scale</span>
                        </Link>
                        <nav className="flex items-center space-x-8">
                            <Link to="/" className="text-gray-700 hover:text-red-600">Home</Link>
                            <Link to="/products" className="text-gray-700 hover:text-red-600">Products</Link>
                            <Link to="/about" className="text-gray-700 hover:text-red-600">About</Link>
                            <Link to="/register" className="text-gray-700 hover:text-red-600 underline">Sign Up</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side - Image */}
                    <div className="hidden lg:block h-[600px] overflow-hidden rounded-lg shadow-xl">
                        <img
                            src="/register-banner.jpg"
                            alt="Nissan Skyline R34 GT-R"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/placeholder-product.jpg';
                            }}
                        />
                    </div>

                    {/* Right Side - Form */}
                    <div className="max-w-md">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold mb-3">Create an account</h1>
                            <p className="text-gray-600">Enter your details below</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    required
                                    className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:border-red-500 focus:ring-0 placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email or Phone Number"
                                    required
                                    className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:border-red-500 focus:ring-0 placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    required
                                    className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:border-red-500 focus:ring-0 placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium px-12 py-3 rounded transition disabled:opacity-50"
                                >
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </button>
                            </div>

                            <div>
                                <button
                                    type="button"
                                    className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-12 py-3 rounded transition flex items-center justify-center gap-3"
                                >
                                    <FcGoogle className="text-xl" />
                                    Sign up with Google
                                </button>
                            </div>

                            <div className="text-center">
                                <span className="text-gray-600">Already have account? </span>
                                <Link to="/login" className="text-gray-900 hover:text-red-600 underline">
                                    Log in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
