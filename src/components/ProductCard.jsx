import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, showDiscount = false }) => {
  const { addToCart } = useCart();

  // Helper function to get image URL (handles both base64 data URLs and file paths)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-product.jpg';
    // Check if it's already a base64 data URL or full URL
    if (imagePath.startsWith('data:image/') || imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, assume it's a file path stored in DB (e.g., /uploads/image.jpg) - let Proxy handle it
    return imagePath;
  };

  const imageUrl = getImageUrl(product.main_image);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const success = await addToCart(product.id, 1);
    if (success) {
      alert('Product added to cart!');
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

  // Calculate discount (example: 10-30% random for demo)
  const discountPercent = showDiscount ? Math.floor(Math.random() * 20) + 10 : 0;
  const originalPrice = discountPercent > 0 ? product.price * (1 + discountPercent / 100) : product.price;

  return (
    <div className="card group relative overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discountPercent > 0 && (
          <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-md font-bold">
            -{discountPercent}%
          </span>
        )}
        {product.is_featured && (
          <span className="bg-accent-500 text-white text-xs px-3 py-1 rounded-md font-bold">
            NEW
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="bg-white p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition">
          <FaHeart />
        </button>
        <Link
          to={`/products/${product.id}`}
          className="bg-white p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition"
        >
          <FaEye />
        </Link>
      </div>

      {/* Image */}
      <Link to={`/products/${product.id}`}>
        <div className="product-image-wrapper h-56 bg-gray-50 flex items-center justify-center p-4">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-red-600 transition">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xl font-bold text-red-600">
            {formatPrice(product.price)}
          </span>
          {discountPercent > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {'★'.repeat(5)}
          </div>
          <span className="text-sm text-gray-600">({Math.floor(Math.random() * 100) + 50})</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-black hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300 flex items-center justify-center gap-2 font-medium"
          disabled={product.stock === 0}
        >
          <FaShoppingCart />
          <span>{product.stock > 0 ? 'Add To Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;


