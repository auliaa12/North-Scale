import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../services/api';
import { FaUpload, FaTimes, FaStar, FaArrowLeft } from 'react-icons/fa';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [jenisCategories, setJenisCategories] = useState([]);
  const [merkCategories, setMerkCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    weight: '',
    category_jenis_id: '',
    category_merk_id: '',
    is_featured: false,
    is_bestseller: false,
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const jenisRes = await categoriesAPI.getAll({ type: 'jenis' });
      setJenisCategories(jenisRes.data.data);

      const merkRes = await categoriesAPI.getAll({ type: 'merk' });
      setMerkCategories(merkRes.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoadingData(true);
      const response = await productsAPI.getById(id);
      const product = response.data;

      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        weight: product.weight || '',
        category_jenis_id: product.category_jenis_id,
        category_merk_id: product.category_merk_id,
        is_featured: product.is_featured,
        is_bestseller: product.is_bestseller,
      });

      setExistingImages(product.images || []);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to fetch product');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + images.length + files.length;

    if (totalImages > 5) {
      alert(`Maximum 5 images allowed. You can only add ${5 - existingImages.length - images.length} more image(s).`);
      return;
    }

    setImages([...images, ...files]);
  };

  const handleRemoveNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageId) => {
    setImagesToRemove([...imagesToRemove, imageId]);
    setExistingImages(existingImages.filter((img) => img.id !== imageId));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.category_jenis_id) newErrors.category_jenis_id = 'Type category is required';
    if (!formData.category_merk_id) newErrors.category_merk_id = 'Brand category is required';

    if (!isEdit && images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // Append form data
      Object.keys(formData).forEach((key) => {
        // Convert boolean to string for FormData
        const value = typeof formData[key] === 'boolean'
          ? formData[key].toString()
          : formData[key];
        data.append(key, value);
      });

      // Append new images
      images.forEach((image) => {
        data.append('images[]', image);
      });

      // Append images to remove (for edit)
      if (isEdit && imagesToRemove.length > 0) {
        imagesToRemove.forEach((id) => {
          data.append('remove_images[]', id);
        });
      }

      // For edit, we need to use POST with _method=PUT workaround
      if (isEdit) {
        data.append('_method', 'PUT');
        await productsAPI.update(id, data);
        alert('Product updated successfully!');
      } else {
        await productsAPI.create(data);
        alert('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to save product. Please check console for details.';
      alert(errorMessage);
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Nissan Skyline GT-R R34"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input-field"
              placeholder="Product description..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Price (IDR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`input-field ${errors.price ? 'border-red-500' : ''}`}
              placeholder="250000"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`input-field ${errors.stock ? 'border-red-500' : ''}`}
              placeholder="10"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Weight (grams)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="input-field"
              placeholder="150"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Type Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category_jenis_id"
              value={formData.category_jenis_id}
              onChange={handleChange}
              className={`input-field ${errors.category_jenis_id ? 'border-red-500' : ''}`}
            >
              <option value="">Select Type</option>
              {jenisCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_jenis_id && (
              <p className="text-red-500 text-sm mt-1">{errors.category_jenis_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Brand Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category_merk_id"
              value={formData.category_merk_id}
              onChange={handleChange}
              className={`input-field ${errors.category_merk_id ? 'border-red-500' : ''}`}
            >
              <option value="">Select Brand</option>
              {merkCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_merk_id && (
              <p className="text-red-500 text-sm mt-1">{errors.category_merk_id}</p>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Featured (New)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_bestseller"
              checked={formData.is_bestseller}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Bestseller</span>
          </label>
        </div>

        {/* Multi-Upload Images */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Images (Max 5) {!isEdit && <span className="text-red-500">*</span>}
          </label>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>📸 Important:</strong> The first image will be used as the main thumbnail. You can upload up to 5 images total.
            </p>
          </div>

          {/* Image Counter */}
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700">
              Images: {existingImages.length + images.length} / 5
            </span>
          </div>

          {/* Existing Images (Edit Mode) */}
          {isEdit && existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {existingImages.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.image_path?.startsWith('data:image/') || image.image_path?.startsWith('http://') || image.image_path?.startsWith('https://')
                        ? image.image_path
                        : image.image_path}
                      alt="Product"
                      className={`w-full h-32 object-cover rounded border-2 ${index === 0 ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-200'
                        }`}
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
                        <FaStar />
                        <span>Thumbnail</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 text-white px-2 py-1 rounded text-xs font-bold">
                      #{index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(image.id)}
                      className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          {(existingImages.length + images.length) < 5 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer">
                <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Click to upload images</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 2MB each</p>
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  Can add {5 - existingImages.length - images.length} more image(s)
                </p>
              </label>
            </div>
          )}

          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}

          {/* Preview New Images */}
          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">New Images to Upload:</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      className={`w-full h-32 object-cover rounded border-2 ${index === 0 && existingImages.length === 0
                        ? 'border-yellow-400 ring-2 ring-yellow-200'
                        : 'border-red-300'
                        }`}
                    />
                    <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 text-white px-2 py-1 rounded text-xs font-bold">
                      #{existingImages.length + index + 1}
                    </div>
                    {index === 0 && existingImages.length === 0 && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
                        <FaStar />
                        <span>Thumbnail</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn-secondary px-8"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;



