import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/account';

    useEffect(() => {
        // Check if user just registered
        if (location.state?.registered) {
            setSuccess('Registration successful! Please login with your credentials.');
            // Clear the state after showing the message
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

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
        setLoading(true);

        const result = await loginUser(formData);

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.message);
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
                            src="/login-banner.jpg"
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
                            <h1 className="text-4xl font-bold mb-3">Log in to Exclusive</h1>
                            <p className="text-gray-600">Enter your details below</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                                    {success}
                                </div>
                            )}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

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

                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-12 py-3 rounded transition disabled:opacity-50"
                                >
                                    {loading ? 'Logging in...' : 'Log in'}
                                </button>
                                <Link to="/forgot-password" className="text-red-500 hover:text-red-600">
                                    Forget Password?
                                </Link>
                            </div>

                            <div className="text-center mt-4">
                                <span className="text-gray-600">Don't have an account? </span>
                                <Link to="/register" className="text-red-500 hover:text-red-600 font-medium">
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
