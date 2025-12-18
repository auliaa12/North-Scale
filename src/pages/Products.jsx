import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [jenisCategories, setJenisCategories] = useState([]);
  const [merkCategories, setMerkCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryJenis, setCategoryJenis] = useState(searchParams.get('category_jenis') || '');
  const [categoryMerk, setCategoryMerk] = useState(searchParams.get('category_merk') || '');
  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'created_at');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort_order') || 'desc');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const jenisRes = await categoriesAPI.getAll({ type: 'jenis' });
      setJenisCategories(jenisRes.data);

      const merkRes = await categoriesAPI.getAll({ type: 'merk' });
      setMerkCategories(merkRes.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(searchParams);
      const response = await productsAPI.getAll(params);
      setProducts(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.isHtmlError) {
        alert("Connection Failed: The free hosting server blocked the request. Please check the console.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    const params = {};
    if (search) params.search = search;
    if (categoryJenis) params.category_jenis = categoryJenis;
    if (categoryMerk) params.category_merk = categoryMerk;
    if (priceMin) params.price_min = priceMin;
    if (priceMax) params.price_max = priceMax;
    params.sort_by = sortBy;
    params.sort_order = sortOrder;

    setSearchParams(params);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategoryJenis('');
    setCategoryMerk('');
    setPriceMin('');
    setPriceMax('');
    setSortBy('created_at');
    setSortOrder('desc');
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    const params = Object.fromEntries(searchParams);
    params.page = page;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Products</h1>
          <p className="text-gray-600">
            Showing {pagination?.total || 0} products
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
            <button onClick={handleApplyFilters} className="btn-primary">
              Search
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <FaTimes className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Category Jenis */}
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={categoryJenis}
                  onChange={(e) => setCategoryJenis(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  {jenisCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Merk */}
              <div>
                <label className="block text-sm font-medium mb-2">Brand</label>
                <select
                  value={categoryMerk}
                  onChange={(e) => setCategoryMerk(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Brands</option>
                  {merkCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Min */}
              <div>
                <label className="block text-sm font-medium mb-2">Min Price</label>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="0"
                  className="input-field"
                />
              </div>

              {/* Price Max */}
              <div>
                <label className="block text-sm font-medium mb-2">Max Price</label>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="1000000"
                  className="input-field"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                >
                  <option value="created_at">Latest</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="input-field"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleApplyFilters} className="btn-primary flex-1">
                Apply Filters
              </button>
              <button onClick={handleClearFilters} className="btn-secondary">
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="loading-spinner"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex justify-center space-x-2">
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded ${page === pagination.current_page
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;



