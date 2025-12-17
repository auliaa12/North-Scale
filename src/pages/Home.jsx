import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';
import ServicesSection from '../components/ServicesSection';
import { FaArrowRight, FaTrophy, FaStar, FaCar, FaTruck, FaMotorcycle, FaBus, FaTaxi, FaShuttleVan, FaQuestionCircle } from 'react-icons/fa';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [jenisCategories, setJenisCategories] = useState([]);
  const [merkCategories, setMerkCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch featured products
        const featuredRes = await productsAPI.getAll({ featured: true, per_page: 4 });
        setFeaturedProducts(featuredRes.data.data);

        // Fetch bestseller products
        const bestsellerRes = await productsAPI.getAll({ bestseller: true, per_page: 4 });
        setBestsellerProducts(bestsellerRes.data.data);

        // Fetch categories
        const jenisRes = await categoriesAPI.getAll({ type: 'jenis' });
        setJenisCategories(jenisRes.data.data || []);

        const merkRes = await categoriesAPI.getAll({ type: 'merk' });
        setMerkCategories(merkRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Calculate flash sale end date (24 hours from now)
  const flashSaleEnd = new Date();
  flashSaleEnd.setHours(flashSaleEnd.getHours() + 24);

  return (
    <div className="fade-in">
      {/* Hero Banner */}
      <section className="bg-black text-white py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FaCar className="text-red-500 text-3xl" />
                <span className="text-lg font-medium">EXCLUSIVE COLLECTION</span>
              </div>
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                Up to 10%<br />
                <span className="text-red-500">off Voucher</span>
              </h1>
              <Link
                to="/products"
                className="inline-flex items-center gap-3 text-white border-b-2 border-white pb-1 hover:border-red-500 hover:text-red-500 transition group"
              >
                <span className="text-lg font-medium">Shop Now</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl p-8">
                <img
                  src="/hero-banner.jpg"
                  alt="Nissan Skyline R34 GT-R - Exclusive Collection"
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sales */}
      <section className="py-16 border-b">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-10 bg-red-500 rounded"></div>
                <span className="text-red-500 font-semibold text-lg">Today's</span>
              </div>
              <h2 className="text-4xl font-bold">Flash Sales</h2>
            </div>
            <CountdownTimer targetDate={flashSaleEnd} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} showDiscount={true} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/products" className="inline-block bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded transition font-medium">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories - Jenis */}
      <section className="py-16 border-b">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-5 h-10 bg-red-500 rounded"></div>
            <span className="text-red-500 font-semibold text-lg">Categories</span>
          </div>
          <h2 className="text-4xl font-bold mb-12">Browse By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {jenisCategories.map((category, index) => {
              // Get icon based on category name (case-insensitive)
              const categoryName = category.name.toLowerCase();
              let Icon;

              // For "other" category, use question mark icon
              if (categoryName.includes('other') || categoryName.includes('lainnya') || categoryName.includes('lain-lain')) {
                Icon = FaQuestionCircle;
              } else {
                // Map different car icons for different categories
                // Use index as fallback for variety
                const carIcons = [FaCar, FaTruck, FaMotorcycle, FaBus, FaTaxi, FaShuttleVan];
                // Try to match category name with specific icon
                if (categoryName.includes('truck') || categoryName.includes('suv') || categoryName.includes('pickup')) {
                  Icon = FaTruck;
                } else if (categoryName.includes('motorcycle') || categoryName.includes('motor') || categoryName.includes('sepeda')) {
                  Icon = FaMotorcycle;
                } else if (categoryName.includes('bus') || categoryName.includes('bis')) {
                  Icon = FaBus;
                } else if (categoryName.includes('taxi') || categoryName.includes('taksi')) {
                  Icon = FaTaxi;
                } else if (categoryName.includes('van') || categoryName.includes('minibus')) {
                  Icon = FaShuttleVan;
                } else {
                  // Default: use variety of car icons based on index
                  Icon = carIcons[index % carIcons.length];
                }
              }

              return (
                <Link
                  key={category.id}
                  to={`/products?category_jenis=${category.id}`}
                  className="bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-500 hover:text-white p-8 rounded-lg text-center transition group"
                >
                  <Icon className="text-5xl mb-4 mx-auto" />
                  <h3 className="font-semibold">
                    {category.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories - Brand (Merk) */}
      {merkCategories.length > 0 && (
        <section className="py-16 border-b">
          <div className="container-custom">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-5 h-10 bg-red-500 rounded"></div>
              <span className="text-red-500 font-semibold text-lg">Brands</span>
            </div>
            <h2 className="text-4xl font-bold mb-12">Shop By Brand</h2>
            <div className="flex flex-wrap gap-3">
              {merkCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category_merk=${category.id}`}
                  className="bg-gray-100 hover:bg-red-500 hover:text-white text-gray-700 px-6 py-3 rounded-full font-medium transition"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Selling - This Month */}
      <section className="py-16 border-b">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-10 bg-red-500 rounded"></div>
                <span className="text-red-500 font-semibold text-lg">This Month</span>
              </div>
              <h2 className="text-4xl font-bold">Best Selling Products</h2>
            </div>
            <Link
              to="/products?bestseller=true"
              className="bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded transition font-medium"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* NASCAR Featured Banner */}
      <section className="py-16 bg-black text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-accent-500 text-white px-4 py-2 rounded-full mb-6 font-semibold">
                Categories
              </div>
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Scale Your<br />
                <span className="text-red-500">NASCAR</span> World
              </h2>
              <CountdownTimer targetDate={flashSaleEnd} />
              {(() => {
                // Find NASCAR category by name (case-insensitive)
                const nascarCategory = jenisCategories.find(cat =>
                  cat.name.toLowerCase().includes('nascar')
                );
                const nascarLink = nascarCategory
                  ? `/products?category_jenis=${nascarCategory.id}`
                  : '/products';

                return (
                  <Link
                    to={nascarLink}
                    className="inline-block mt-8 bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded font-medium transition"
                  >
                    Buy Now!
                  </Link>
                );
              })()}
            </div>
            <div className="relative">
              <img
                src="/nascar-banner.jpg"
                alt="NASCAR Collection - Hunt Brothers Pizza"
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Explore Our Products */}
      <section className="py-16 border-b">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-10 bg-red-500 rounded"></div>
            <span className="text-red-500 font-semibold text-lg">Our Products</span>
          </div>
          <h2 className="text-4xl font-bold mb-12">Explore Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...featuredProducts, ...bestsellerProducts].slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/products" className="inline-block bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded transition font-medium">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Collection?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of collectors who trust us for their diecast needs
          </p>
          <Link to="/products" className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            Start Shopping Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;


