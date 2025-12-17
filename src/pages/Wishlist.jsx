import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { wishlistAPI, cartAPI } from '../services/api';
import AccountLayout from '../components/Layout/AccountLayout';
import { useCart } from '../context/CartContext';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    const fetchWishlist = async () => {
        if (user?.id) {
            try {
                const response = await wishlistAPI.getWishlist(user.id);
                setWishlistItems(response.data);
            } catch (error) {
                console.error('Failed to fetch wishlist', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!user) return;
        try {
            await wishlistAPI.removeFromWishlist(user.id, productId);
            // Optimistic update
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
        } catch (error) {
            console.error('Failed to remove from wishlist', error);
            alert('Failed to remove item');
        }
    };

    const handleAddToCart = async (product) => {
        const success = await addToCart(product.id, 1);
        if (success) {
            alert('Added to cart!');
            // Optional: remove from wishlist after adding to cart
            // removeFromWishlist(product.id);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (!user) {
        return (
            <div className="container-custom py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Please login to view your wishlist</h2>
                <Link to="/login" className="btn-primary">Login Now</Link>
            </div>
        );
    }

    return (
        <AccountLayout>
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h1 className="text-2xl font-bold mb-6 flex items-center">
                    <FaHeart className="text-red-500 mr-3" /> My Wishlist
                </h1>

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
                        <Link to="/products" className="text-red-500 hover:underline mt-2 inline-block">Browse Products</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {wishlistItems.map(product => (
                            <div key={product.id} className="flex flex-col sm:flex-row items-center border rounded-lg p-4 hover:shadow-md transition">
                                <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded overflow-hidden mb-4 sm:mb-0">
                                    {product.images && product.images[0] ? (
                                        <img src={product.images[0].image_path} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                                    )}
                                </div>

                                <div className="sm:ml-6 flex-1 text-center sm:text-left">
                                    <Link to={`/products/${product.id}`} className="text-lg font-bold text-gray-800 hover:text-red-600">
                                        {product.name}
                                    </Link>
                                    <div className="text-red-500 font-bold mt-1 text-xl">
                                        {formatPrice(product.price)}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {product.stock > 0 ? (
                                            <span className="text-green-600">In Stock</span>
                                        ) : (
                                            <span className="text-red-600">Out of Stock</span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col gap-3">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center transition disabled:opacity-50"
                                        disabled={product.stock === 0}
                                    >
                                        <FaShoppingCart className="mr-2" /> Add to Cart
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(product.id)}
                                        className="border border-gray-300 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded flex items-center justify-center transition"
                                    >
                                        <FaTrash className="mr-2" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AccountLayout>
    );
};

export default Wishlist;
