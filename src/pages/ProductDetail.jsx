import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsAPI, wishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaArrowLeft, FaMinus, FaPlus, FaBox, FaWeight, FaHeart } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (user && product) {
      checkWishlistStatus();
    }
  }, [user, product]);

  const checkWishlistStatus = async () => {
    try {
      const response = await wishlistAPI.checkWishlist(user.id, product.id);
      setIsWishlisted(response.data.exists);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      alert('Please login to use wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        await wishlistAPI.removeFromWishlist(user.id, product.id);
        setIsWishlisted(false);
        alert('Removed from wishlist');
      } else {
        await wishlistAPI.addToWishlist(user.id, product.id);
        setIsWishlisted(true);
        alert('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist');
    }
  };

  const handleAddToCart = async () => {
    if (quantity > product.stock) {
      alert('Quantity exceeds available stock');
      return;
    }

    const success = await addToCart(product.id, quantity);
    if (success) {
      alert('Product added to cart!');
      setQuantity(1);
    } else {
      alert('Failed to add product to cart');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-xl text-gray-500">Product not found</p>
        <Link to="/products" className="btn-primary mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 fade-in">
      <div className="container-custom">
        {/* Back Button */}
        <Link to="/products" className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 mb-8 transition">
          <FaArrowLeft />
          <span>Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {product.images && product.images.length > 0 ? (
              <div className="flex gap-4">
                {/* Thumbnails Sidebar */}
                {product.images.length > 1 && (
                  <div className="flex flex-col gap-3">
                    {product.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-24 h-24 rounded-lg border-2 overflow-hidden transition-all hover:border-red-500 ${selectedImage === index ? 'border-red-600 ring-2 ring-red-300' : 'border-gray-300'
                          }`}
                      >
                        <img
                          src={image.image_path?.startsWith('data:image/') || image.image_path?.startsWith('http://') || image.image_path?.startsWith('https://')
                            ? image.image_path
                            : image.image_path
                              ? image.image_path
                              : '/placeholder-product.jpg'}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Image */}
                <div className="flex-1">
                  <div className="card overflow-hidden bg-gray-50">
                    <div className="aspect-square bg-white flex items-center justify-center p-8">
                      <img
                        src={product.images[selectedImage].image_path?.startsWith('data:image/') || product.images[selectedImage].image_path?.startsWith('http://') || product.images[selectedImage].image_path?.startsWith('https://')
                          ? product.images[selectedImage].image_path
                          : product.images[selectedImage].image_path
                            ? product.images[selectedImage].image_path
                            : '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card aspect-square bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">No image available</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.is_featured && (
                <span className="bg-yellow-500 text-white text-sm px-3 py-1 rounded font-bold">
                  NEW
                </span>
              )}
              {product.is_bestseller && (
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded font-bold">
                  BESTSELLER
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>

            {/* Categories */}
            <div className="flex gap-3 mb-6">
              {product.category_jenis && (
                <Link
                  to={`/products?category_jenis=${product.category_jenis.id}`}
                  className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-200 transition"
                >
                  {product.category_jenis.name}
                </Link>
              )}
              {product.category_merk && (
                <Link
                  to={`/products?category_merk=${product.category_merk.id}`}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  {product.category_merk.name}
                </Link>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400 text-lg">
                {'★'.repeat(5)}
              </div>
              <span className="text-sm text-gray-600">({Math.floor(Math.random() * 100) + 50} reviews)</span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-green-600 font-medium">In Stock</span>
            </div>

            {/* Price */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-1">Price</p>
              <p className="text-4xl font-bold text-red-600">{formatPrice(product.price)}</p>
            </div>

            {/* Stock & Weight */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <FaBox className="text-2xl text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Stock</p>
                  <p className="text-lg font-bold">{product.stock} units</p>
                </div>
              </div>
              {product.weight && (
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <FaWeight className="text-2xl text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-lg font-bold">{product.weight}g</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded flex items-center justify-center transition"
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                  className="input-field w-20 text-center"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded flex items-center justify-center transition"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary text-lg py-4 flex items-center justify-center space-x-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FaShoppingCart className="text-xl" />
                <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>

              {/* Buy Now Button */}
              <button
                onClick={async () => {
                  if (quantity > product.stock) {
                    alert('Quantity exceeds available stock');
                    return;
                  }
                  const success = await addToCart(product.id, quantity);
                  if (success) {
                    navigate('/checkout');
                  } else {
                    alert('Failed to process buy now');
                  }
                }}
                disabled={product.stock === 0}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 flex items-center justify-center space-x-3 rounded transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FaShoppingCart className="text-xl" />
                <span>Buy Now</span>
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`px-6 border-2 rounded-lg flex items-center justify-center transition ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'}`}
              >
                <FaHeart className="text-xl" />
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-8 border-t pt-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;



