// LocalStorage Service Layer
// This service manages all data persistence using browser localStorage

const STORAGE_KEYS = {
  PRODUCTS: 'ecommerce_products',
  CATEGORIES: 'ecommerce_categories',
  CART: 'ecommerce_cart',
  ORDERS: 'ecommerce_orders',
  ADMIN_USER: 'ecommerce_admin',
  USERS: 'ecommerce_users',
  WISHLIST: 'ecommerce_wishlist',
  CHAT_CONVERSATIONS: 'ecommerce_chat_conversations',
  CHAT_MESSAGES: 'ecommerce_chat_messages',
  SESSION_ID: 'session_id',
  ADMIN_TOKEN: 'admin_token',
  USER_TOKEN: 'user_token',
  CURRENT_USER: 'current_user', // Keep for backward compatibility if needed, but prefer below
  CURRENT_ADMIN_USER: 'ecommerce_current_admin',
  CURRENT_CUSTOMER_USER: 'ecommerce_current_customer',
  INITIALIZED: 'ecommerce_initialized'
};

// Initialize default data
const initializeData = () => {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

  if (!initialized) {
    // Default admin user
    const adminUser = {
      id: 1,
      name: 'Admin',
      email: 'admin@diecast.com',
      password: 'admin123', // In production, this should be hashed
      role: 'admin'
    };
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(adminUser));

    // Default categories
    const categories = [
      { id: 1, name: 'Smartphone', slug: 'smartphone', description: 'Latest smartphones', created_at: new Date().toISOString() },
      { id: 2, name: 'Laptop', slug: 'laptop', description: 'High-performance laptops', created_at: new Date().toISOString() },
      { id: 3, name: 'Tablet', slug: 'tablet', description: 'Portable tablets', created_at: new Date().toISOString() },
      { id: 4, name: 'Accessories', slug: 'accessories', description: 'Mobile accessories', created_at: new Date().toISOString() }
    ];
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

    // Default products with multiple images
    const products = [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Latest iPhone with A17 Pro chip',
        price: 15999000,
        stock: 50,
        category_jenis_id: 1,
        category_merk_id: 1,
        is_featured: true,
        is_bestseller: false,
        weight: 187,
        images: [
          { id: 1, image_path: 'https://via.placeholder.com/600x600/4A90E2/ffffff?text=iPhone+15+Pro', is_main: true },
          { id: 11, image_path: 'https://via.placeholder.com/600x600/FF6B6B/ffffff?text=iPhone+15+Pro+Red', is_main: false },
          { id: 12, image_path: 'https://via.placeholder.com/600x600/50C878/ffffff?text=iPhone+15+Pro+Green', is_main: false }
        ],
        main_image: 'https://via.placeholder.com/600x600/4A90E2/ffffff?text=iPhone+15+Pro',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24',
        slug: 'samsung-galaxy-s24',
        description: 'Flagship Samsung with AI features',
        price: 12999000,
        stock: 30,
        category_jenis_id: 1,
        category_merk_id: 2,
        is_featured: false,
        is_bestseller: true,
        weight: 168,
        images: [
          { id: 2, image_path: 'https://via.placeholder.com/600x600/50C878/ffffff?text=Galaxy+S24', is_main: true },
          { id: 21, image_path: 'https://via.placeholder.com/600x600/9B59B6/ffffff?text=Galaxy+S24+Purple', is_main: false }
        ],
        main_image: 'https://via.placeholder.com/600x600/50C878/ffffff?text=Galaxy+S24',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'MacBook Pro M3',
        slug: 'macbook-pro-m3',
        description: 'Powerful laptop with M3 chip',
        price: 25999000,
        stock: 20,
        category_jenis_id: 2,
        category_merk_id: 1,
        is_featured: true,
        is_bestseller: true,
        weight: 1600,
        images: [
          { id: 3, image_path: 'https://via.placeholder.com/600x600/FF6B6B/ffffff?text=MacBook+Pro', is_main: true }
        ],
        main_image: 'https://via.placeholder.com/600x600/FF6B6B/ffffff?text=MacBook+Pro',
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        name: 'iPad Air',
        slug: 'ipad-air',
        description: 'Lightweight and powerful tablet',
        price: 8999000,
        stock: 40,
        category_jenis_id: 3,
        category_merk_id: 1,
        is_featured: false,
        is_bestseller: false,
        weight: 461,
        images: [
          { id: 4, image_path: 'https://via.placeholder.com/600x600/9B59B6/ffffff?text=iPad+Air', is_main: true },
          { id: 41, image_path: 'https://via.placeholder.com/600x600/4A90E2/ffffff?text=iPad+Air+Blue', is_main: false },
          { id: 42, image_path: 'https://via.placeholder.com/600x600/FF6B6B/ffffff?text=iPad+Air+Pink', is_main: false }
        ],
        main_image: 'https://via.placeholder.com/600x600/9B59B6/ffffff?text=iPad+Air',
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        name: 'AirPods Pro',
        slug: 'airpods-pro',
        description: 'Active noise cancellation earbuds',
        price: 3499000,
        stock: 100,
        category_jenis_id: 4,
        category_merk_id: 1,
        is_featured: true,
        is_bestseller: true,
        weight: 56,
        images: [
          { id: 5, image_path: 'https://via.placeholder.com/600x600/F39C12/ffffff?text=AirPods+Pro', is_main: true }
        ],
        main_image: 'https://via.placeholder.com/600x600/F39C12/ffffff?text=AirPods+Pro',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    // Initialize empty cart
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));

    // Initialize with sample orders
    const sampleOrders = [
      {
        id: 1,
        order_number: 'ORD-' + (Date.now() - 86400000), // 1 day ago
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: '081234567890',
        customer_address: 'Jl. Sudirman No. 123, Jakarta',
        shipping_address: 'Jl. Sudirman No. 123, Jakarta',
        notes: 'Please deliver in the morning',
        items: [
          {
            id: 1,
            product_id: 1,
            product_name: 'iPhone 15 Pro',
            product_price: 15999000,
            quantity: 1,
            subtotal: 15999000,
            product: products[0]
          }
        ],
        total: 15999000,
        total_amount: 15999000,
        status: 'completed',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 2,
        order_number: 'ORD-' + (Date.now() - 43200000), // 12 hours ago
        customer_name: 'Jane Smith',
        customer_email: 'jane@example.com',
        customer_phone: '081234567891',
        customer_address: 'Jl. Thamrin No. 456, Jakarta',
        shipping_address: 'Jl. Thamrin No. 456, Jakarta',
        notes: '',
        items: [
          {
            id: 2,
            product_id: 3,
            product_name: 'MacBook Pro M3',
            product_price: 25999000,
            quantity: 1,
            subtotal: 25999000,
            product: products[2]
          },
          {
            id: 3,
            product_id: 5,
            product_name: 'AirPods Pro',
            product_price: 3499000,
            quantity: 2,
            subtotal: 6998000,
            product: products[4]
          }
        ],
        total: 32997000,
        total_amount: 32997000,
        status: 'processing',
        created_at: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: 3,
        order_number: 'ORD-' + Date.now(),
        customer_name: 'Bob Johnson',
        customer_email: 'bob@example.com',
        customer_phone: '081234567892',
        customer_address: 'Jl. Gatot Subroto No. 789, Jakarta',
        shipping_address: 'Jl. Gatot Subroto No. 789, Jakarta',
        notes: 'Call before delivery',
        items: [
          {
            id: 4,
            product_id: 2,
            product_name: 'Samsung Galaxy S24',
            product_price: 12999000,
            quantity: 1,
            subtotal: 12999000,
            product: products[1]
          }
        ],
        total: 12999000,
        total_amount: 12999000,
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sampleOrders));

    // Initialize empty users array
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));

    // Initialize chat
    localStorage.setItem(STORAGE_KEYS.CHAT_CONVERSATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify([]));

    // Mark as initialized
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
};

// Helper function to get next ID
const getNextId = (items) => {
  if (!items || items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
};

// Generate or get session ID
export const getSessionId = () => {
  let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
    // Keep SESSION_ID in localStorage for cart persistence, but tokens move to sessionStorage
  }
  return sessionId;
};

// Auth Service
// Auth Service (Admin)
export const authService = {
  login: async (credentials) => {
    initializeData();
    const adminUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_USER));

    if (credentials.email === adminUser.email && credentials.password === adminUser.password) {
      const token = 'admin_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN_USER, JSON.stringify({
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: 'admin'
      }));

      return {
        data: {
          user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, role: 'admin' },
          token
        }
      };
    }

    throw new Error('Invalid credentials');
  },

  logout: async () => {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN_USER);
    return { data: { message: 'Logged out successfully' } };
  },

  getUser: async () => {
    const token = sessionStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    const user = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN_USER));

    if (token && user) {
      return { data: user };
    }
    throw new Error('Not authenticated');
  }
};

// Products Service
export const productsService = {
  getAll: async (params = {}) => {
    initializeData();
    let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];

    // Filter by category jenis
    if (params.category_jenis) {
      products = products.filter(p => p.category_jenis_id === parseInt(params.category_jenis));
    }

    // Filter by category merk
    if (params.category_merk) {
      products = products.filter(p => p.category_merk_id === parseInt(params.category_merk));
    }

    // Filter by featured
    if (params.featured) {
      products = products.filter(p => p.is_featured);
    }

    // Filter by bestseller
    if (params.bestseller) {
      products = products.filter(p => p.is_bestseller);
    }

    // Search
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }

    // Add category info
    products = products.map(p => ({
      ...p,
      category_jenis: categories.find(c => c.id === p.category_jenis_id),
      category_merk: categories.find(c => c.id === p.category_merk_id)
    }));

    // Return in paginated format to match API response
    return {
      data: {
        data: products,
        total: products.length,
        per_page: params.per_page || products.length,
        current_page: 1,
        last_page: 1
      }
    };
  },

  getById: async (id) => {
    initializeData();
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      data: {
        ...product,
        category_jenis: categories.find(c => c.id === product.category_jenis_id),
        category_merk: categories.find(c => c.id === product.category_merk_id)
      }
    };
  },

  create: async (formData) => {
    try {
      initializeData();
      const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];

      // Extract data from FormData
      const name = formData.get('name');
      if (!name) {
        throw new Error('Product name is required');
      }

      const productData = {
        id: getNextId(products),
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.get('description') || '',
        price: parseFloat(formData.get('price')) || 0,
        stock: parseInt(formData.get('stock')) || 0,
        weight: formData.get('weight') ? parseInt(formData.get('weight')) : null,
        category_jenis_id: parseInt(formData.get('category_jenis_id')) || null,
        category_merk_id: parseInt(formData.get('category_merk_id')) || null,
        is_featured: formData.get('is_featured') === 'true',
        is_bestseller: formData.get('is_bestseller') === 'true',
        images: [],
        created_at: new Date().toISOString()
      };

      // Validate required fields
      if (!productData.category_jenis_id) {
        throw new Error('Type category (Category Jenis) is required');
      }
      if (!productData.category_merk_id) {
        throw new Error('Brand category (Category Merk) is required');
      }
      if (isNaN(productData.category_jenis_id)) {
        throw new Error('Invalid type category. Please select a valid type category.');
      }
      if (isNaN(productData.category_merk_id)) {
        throw new Error('Invalid brand category. Please select a valid brand category.');
      }

      // Handle multiple images (up to 5)
      const imageFiles = formData.getAll('images[]');
      console.log('Image files:', imageFiles, imageFiles.length);

      if (imageFiles && imageFiles.length > 0) {
        // Convert files to base64 data URLs
        const imagePromises = [];
        Array.from(imageFiles).slice(0, 5).forEach((file, index) => {
          if (file && file.size > 0 && file instanceof File) {
            imagePromises.push(
              new Promise((resolve) => {
                try {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    if (reader.result && reader.result.length > 0) {
                      // Compress image to reduce storage size
                      const img = new Image();
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const maxWidth = 800; // Max width for optimization
                        const maxHeight = 800; // Max height for optimization
                        let width = img.width;
                        let height = img.height;

                        // Calculate new dimensions (reduce size more aggressively)
                        const maxSize = 600; // Reduced from 800 to save space
                        if (width > height) {
                          if (width > maxSize) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                          }
                        } else {
                          if (height > maxSize) {
                            width = (width * maxSize) / height;
                            height = maxSize;
                          }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        // Convert to base64 with higher compression (quality 0.5 = 50% to save space)
                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);

                        resolve({
                          id: Date.now() + index + Math.random() * 1000,
                          image_path: compressedBase64, // compressed base64 data URL
                          is_main: index === 0 // First image is main
                        });
                      };
                      img.onerror = () => {
                        // If image load fails, use original but warn
                        console.warn('Failed to compress image, using original');
                        resolve({
                          id: Date.now() + index + Math.random() * 1000,
                          image_path: reader.result, // original base64
                          is_main: index === 0
                        });
                      };
                      img.src = reader.result;
                    } else {
                      // Fallback to placeholder if read fails
                      const colors = ['FF6B6B', '4A90E2', '50C878', '9B59B6', 'F39C12'];
                      resolve({
                        id: Date.now() + index + Math.random() * 1000,
                        image_path: `https://via.placeholder.com/600x600/${colors[index % colors.length]}/ffffff?text=${encodeURIComponent(productData.name)}+${index + 1}`,
                        is_main: index === 0
                      });
                    }
                  };
                  reader.onerror = (err) => {
                    console.error('FileReader error:', err);
                    // Fallback to placeholder if read fails
                    const colors = ['FF6B6B', '4A90E2', '50C878', '9B59B6', 'F39C12'];
                    resolve({
                      id: Date.now() + index + Math.random() * 1000,
                      image_path: `https://via.placeholder.com/600x600/${colors[index % colors.length]}/ffffff?text=${encodeURIComponent(productData.name)}+${index + 1}`,
                      is_main: index === 0
                    });
                  };
                  reader.readAsDataURL(file);
                } catch (error) {
                  console.error('Error reading file:', error);
                  // Fallback to placeholder
                  const colors = ['FF6B6B', '4A90E2', '50C878', '9B59B6', 'F39C12'];
                  resolve({
                    id: Date.now() + index + Math.random() * 1000,
                    image_path: `https://via.placeholder.com/600x600/${colors[index % colors.length]}/ffffff?text=${encodeURIComponent(productData.name)}+${index + 1}`,
                    is_main: index === 0
                  });
                }
              })
            );
          }
        });

        if (imagePromises.length > 0) {
          try {
            const images = await Promise.all(imagePromises);
            productData.images = images.filter(img => img !== null && img !== undefined);
            console.log('Images processed:', productData.images.length);
          } catch (error) {
            console.error('Error processing images:', error);
            // Continue without images if processing fails
            productData.images = [];
          }
        }
      }

      // Set main_image for backward compatibility
      if (productData.images && productData.images.length > 0) {
        productData.main_image = productData.images[0].image_path;
      } else {
        // Set default placeholder if no images
        productData.main_image = '/placeholder-product.jpg';
        productData.images = [{
          id: Date.now(),
          image_path: '/placeholder-product.jpg',
          is_main: true
        }];
      }

      console.log('Product data to save:', {
        id: productData.id,
        name: productData.name,
        images_count: productData.images.length
      });

      products.push(productData);

      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        console.log('Product saved successfully');
      } catch (storageError) {
        console.error('localStorage error:', storageError);
        // Check if storage is full
        if (storageError.name === 'QuotaExceededError') {
          throw new Error('Storage quota exceeded. Please clear some data or use a different browser.');
        }
        throw storageError;
      }

      return { data: productData };
    } catch (error) {
      console.error('Error creating product:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },

  update: async (id, formData) => {
    initializeData();
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      throw new Error('Product not found');
    }

    // Update product data
    const updatedProduct = {
      ...products[index],
      name: formData.get('name') || products[index].name,
      slug: (formData.get('name') || products[index].name).toLowerCase().replace(/\s+/g, '-'),
      description: formData.get('description') || products[index].description,
      price: formData.get('price') ? parseFloat(formData.get('price')) : products[index].price,
      stock: formData.get('stock') ? parseInt(formData.get('stock')) : products[index].stock,
      weight: formData.get('weight') ? parseInt(formData.get('weight')) : products[index].weight,
      category_jenis_id: formData.get('category_jenis_id') ? parseInt(formData.get('category_jenis_id')) : products[index].category_jenis_id,
      category_merk_id: formData.get('category_merk_id') ? parseInt(formData.get('category_merk_id')) : products[index].category_merk_id,
      is_featured: formData.get('is_featured') === 'true',
      is_bestseller: formData.get('is_bestseller') === 'true',
      updated_at: new Date().toISOString()
    };

    // Handle new images if provided
    const imageFiles = formData.getAll('images[]');
    if (imageFiles && imageFiles.length > 0) {
      // Keep existing images or start fresh
      const existingImages = (updatedProduct.images || []).filter(img => {
        // Remove images marked for deletion
        const removeImages = formData.getAll('remove_images[]').map(id => parseInt(id));
        return !removeImages.includes(img.id);
      });

      // Convert new files to base64 data URLs
      const imagePromises = Array.from(imageFiles)
        .slice(0, 5 - existingImages.length)
        .map((file, index) => {
          if (file && file.size > 0 && file instanceof File) {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  id: Date.now() + index,
                  image_path: reader.result, // base64 data URL
                  is_main: existingImages.length === 0 && index === 0
                });
              };
              reader.onerror = () => {
                // Fallback to placeholder if read fails
                const colors = ['FF6B6B', '4A90E2', '50C878', '9B59B6', 'F39C12'];
                resolve({
                  id: Date.now() + index,
                  image_path: `https://via.placeholder.com/600x600/${colors[(existingImages.length + index) % colors.length]}/ffffff?text=${encodeURIComponent(updatedProduct.name)}+${existingImages.length + index + 1}`,
                  is_main: existingImages.length === 0 && index === 0
                });
              };
              reader.readAsDataURL(file);
            });
          }
          return null;
        }).filter(p => p !== null);

      const newImages = await Promise.all(imagePromises);
      updatedProduct.images = [...existingImages, ...newImages];

      // Ensure first image is main
      if (updatedProduct.images.length > 0) {
        updatedProduct.images = updatedProduct.images.map((img, idx) => ({
          ...img,
          is_main: idx === 0
        }));
      }
    } else {
      // Handle removal of existing images
      const removeImages = formData.getAll('remove_images[]').map(id => parseInt(id));
      if (removeImages.length > 0) {
        updatedProduct.images = (updatedProduct.images || []).filter(img => !removeImages.includes(img.id));
        // Ensure first image is main after removal
        if (updatedProduct.images.length > 0) {
          updatedProduct.images = updatedProduct.images.map((img, idx) => ({
            ...img,
            is_main: idx === 0
          }));
        }
      }
    }

    // Update main_image for backward compatibility
    if (updatedProduct.images && updatedProduct.images.length > 0) {
      updatedProduct.main_image = updatedProduct.images[0].image_path;
    }

    products[index] = updatedProduct;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    return { data: updatedProduct };
  },

  delete: async (id) => {
    initializeData();
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    const filteredProducts = products.filter(p => p.id !== parseInt(id));

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filteredProducts));

    return { data: { message: 'Product deleted successfully' } };
  },

  setMainImage: async (productId, imageId) => {
    initializeData();
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    const product = products.find(p => p.id === parseInt(productId));

    if (!product) {
      throw new Error('Product not found');
    }

    // Set all images to not main
    product.images.forEach(img => img.is_main = false);

    // Set selected image as main
    const image = product.images.find(img => img.id === parseInt(imageId));
    if (image) {
      image.is_main = true;
    }

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    return { data: { message: 'Main image updated' } };
  }
};

// Categories Service
export const categoriesService = {
  getAll: async (params = {}) => {
    initializeData();
    let categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];

    // Migrate old categories: add 'type' field if missing (default to 'jenis')
    let needsUpdate = false;
    categories = categories.map(c => {
      if (!c.type) {
        needsUpdate = true;
        return { ...c, type: 'jenis' };
      }
      return c;
    });

    if (needsUpdate) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }

    // Filter by type
    if (params.type) {
      categories = categories.filter(c => c.type === params.type);
    }

    // Search
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      categories = categories.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower)
      );
    }

    return { data: categories };
  },

  getById: async (id) => {
    initializeData();
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    const category = categories.find(c => c.id === parseInt(id));

    if (!category) {
      throw new Error('Category not found');
    }

    return { data: category };
  },

  create: async (data) => {
    initializeData();
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];

    const newCategory = {
      id: getNextId(categories),
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      type: data.type || 'jenis',
      description: data.description || '',
      created_at: new Date().toISOString()
    };

    categories.push(newCategory);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

    return { data: newCategory };
  },

  update: async (id, data) => {
    initializeData();
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    const index = categories.findIndex(c => c.id === parseInt(id));

    if (index === -1) {
      throw new Error('Category not found');
    }

    const updatedCategory = {
      ...categories[index],
      name: data.name || categories[index].name,
      slug: (data.name || categories[index].name).toLowerCase().replace(/\s+/g, '-'),
      type: data.type !== undefined ? data.type : (categories[index].type || 'jenis'),
      description: data.description !== undefined ? data.description : categories[index].description,
      updated_at: new Date().toISOString()
    };

    categories[index] = updatedCategory;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

    return { data: updatedCategory };
  },

  delete: async (id) => {
    initializeData();
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    const filteredCategories = categories.filter(c => c.id !== parseInt(id));

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filteredCategories));

    return { data: { message: 'Category deleted successfully' } };
  }
};

// Cart Service
export const cartService = {
  getCart: async (userId) => {
    initializeData();
    const sessionId = getSessionId();
    const cartItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];

    // Filter cart items by session OR user_id
    let userCartItems;
    if (userId) {
      userCartItems = cartItems.filter(item => item.user_id === parseInt(userId) || item.session_id === sessionId);
    } else {
      userCartItems = cartItems.filter(item => item.session_id === sessionId && !item.user_id);
    }

    // Populate with product details
    const items = userCartItems.map(item => {
      const product = products.find(p => p.id === item.product_id);
      return {
        ...item,
        product: product || null
      };
    }).filter(item => item.product !== null);

    // Calculate totals
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const item_count = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      data: {
        items,
        total,
        item_count
      }
    };
  },

  addToCart: async (productId, quantity, sessionId, userId) => {
    initializeData();
    const sid = sessionId || getSessionId();
    const cartItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];

    // Check if item already exists in cart (match session OR user)
    let existingItemIndex = -1;

    if (userId) {
      existingItemIndex = cartItems.findIndex(
        item => item.product_id === productId && (item.user_id === userId || item.session_id === sid)
      );
    } else {
      existingItemIndex = cartItems.findIndex(
        item => item.product_id === productId && item.session_id === sid
      );
    }

    if (existingItemIndex !== -1) {
      // Update quantity
      cartItems[existingItemIndex].quantity += quantity;
      // Ensure user_id is set if logged in
      if (userId) cartItems[existingItemIndex].user_id = userId;
    } else {
      // Add new item
      cartItems.push({
        id: getNextId(cartItems),
        product_id: productId,
        quantity,
        session_id: sid,
        user_id: userId || null, // Store user_id
        created_at: new Date().toISOString()
      });
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));

    return { data: { message: 'Added to cart' } };
  },

  updateCart: async (id, quantity) => {
    initializeData();
    const cartItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    const index = cartItems.findIndex(item => item.id === parseInt(id));

    if (index !== -1) {
      cartItems[index].quantity = quantity;
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    }

    return { data: { message: 'Cart updated' } };
  },

  removeFromCart: async (id) => {
    initializeData();
    const cartItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    const filteredItems = cartItems.filter(item => item.id !== parseInt(id));

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(filteredItems));

    return { data: { message: 'Item removed from cart' } };
  },

  clearCart: async (sessionId, userId) => {
    initializeData();
    const sid = sessionId || getSessionId();
    const cartItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];

    // Remove items matching session OR user
    const filteredItems = cartItems.filter(item => {
      if (userId) {
        return !(item.user_id === userId || item.session_id === sid);
      }
      return item.session_id !== sid;
    });

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(filteredItems));

    return { data: { message: 'Cart cleared' } };
  },

  mergeCart: async (userId) => {
    initializeData();
    const sessionId = getSessionId();
    let cartItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];

    // Find items belonging to this session but no user_id (Guest Cart)
    cartItems = cartItems.map(item => {
      if (item.session_id === sessionId && !item.user_id) {
        return { ...item, user_id: userId }; // Link to user
      }
      return item;
    });

    // Optional deduplication could go here (if user already has same item)

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    return { data: { message: 'Cart merged' } };
  }
};

// Orders Service
export const ordersService = {
  getAll: async (params = {}) => {
    initializeData();
    let orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];

    // Filter by status
    if (params.status) {
      orders = orders.filter(o => o.status === params.status);
    }

    // Sort by date (newest first)
    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Return in paginated format to match API response
    return {
      data: {
        data: orders,
        total: orders.length,
        per_page: params.per_page || orders.length,
        current_page: params.page || 1,
        last_page: 1
      }
    };
  },

  getById: async (id) => {
    initializeData();
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    const order = orders.find(o => o.id === parseInt(id) || o.order_number === id);

    if (!order) {
      throw new Error('Order not found');
    }

    return { data: order };
  },

  create: async (data) => {
    initializeData();
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    const sessionId = data.session_id || getSessionId();

    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];

    const userCartItems = cartItems.filter(item => item.session_id === sessionId);

    // Create order items (without full product images to save storage)
    const orderItems = userCartItems.map(item => {
      const product = products.find(p => p.id === item.product_id);
      if (!product) {
        throw new Error(`Product with id ${item.product_id} not found`);
      }
      return {
        id: item.id,
        product_id: item.product_id,
        product_name: product.name,
        product_price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
        // Only store minimal product info (no images array to save storage)
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          main_image: product.main_image, // Keep only main_image, not full images array
          price: product.price
        }
      };
    });

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const newOrder = {
      id: getNextId(orders),
      order_number: 'ORD-' + Date.now(),
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      customer_address: data.shipping_address,
      shipping_address: data.shipping_address,
      shipping_method: data.shipping_method || '',
      shipping_name: data.shipping_name || '',
      shipping_cost: data.shipping_cost || 0,
      payment_method: data.payment_method,
      payment_details: data.payment_details || {},
      notes: data.notes || '',
      items: orderItems,
      subtotal: total,
      total,
      total_amount: data.total_amount || total,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    orders.push(newOrder);

    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (storageError) {
      console.error('localStorage error when saving order:', storageError);
      // Check if storage is full
      if (storageError.name === 'QuotaExceededError') {
        // Try to clean up old orders or compress data
        throw new Error('Storage quota exceeded. Please clear old orders or use cleanupProductImages() in console.');
      }
      throw storageError;
    }

    // Clear cart after order
    await cartService.clearCart(sessionId);

    return { data: newOrder };
  },

  updateStatus: async (id, status) => {
    initializeData();
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    const index = orders.findIndex(o => o.id === parseInt(id));

    if (index === -1) {
      throw new Error('Order not found');
    }

    orders[index].status = status;
    orders[index].updated_at = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    return { data: orders[index] };
  },

  delete: async (id) => {
    initializeData();
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    const filteredOrders = orders.filter(o => o.id !== parseInt(id));

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(filteredOrders));

    return { data: { message: 'Order deleted successfully' } };
  }
};

// User Service (for customers)
export const userService = {
  register: async (userData) => {
    initializeData();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];

    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: getNextId(users),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In production, hash this
      phone: userData.phone || '',
      address: userData.address || '',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Auto login after register
    const token = 'user_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_CUSTOMER_USER, JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }));

    // Merge Guest Cart with User Cart
    await cartService.mergeCart(newUser.id);

    return {
      data: {
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
        token
      }
    };
  },

  login: async (credentials) => {
    initializeData();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];

    const user = users.find(u =>
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = 'user_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_CUSTOMER_USER, JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email
    }));

    // Merge Guest Cart with User Cart
    await cartService.mergeCart(user.id);

    return {
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        token
      }
    };
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_CUSTOMER_USER);
    return { data: { message: 'Logged out successfully' } };
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    if (!token) {
      throw new Error('Not authenticated');
    }

    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_CUSTOMER_USER));
    if (!currentUser) {
      throw new Error('User not found');
    }

    return { data: currentUser };
  },

  updateProfile: async (userId, data) => {
    initializeData();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const index = users.findIndex(u => u.id === parseInt(userId));

    if (index === -1) {
      throw new Error('User not found');
    }

    users[index] = {
      ...users[index],
      name: data.name || users[index].name,
      phone: data.phone !== undefined ? data.phone : users[index].phone,
      address: data.address !== undefined ? data.address : users[index].address,
      updated_at: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Update current user in storage
    const updatedUser = { id: users[index].id, name: users[index].name, email: users[index].email };
    localStorage.setItem(STORAGE_KEYS.CURRENT_CUSTOMER_USER, JSON.stringify(updatedUser));

    return { data: updatedUser };
  },

  getUserOrders: async (userId) => {
    initializeData();
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];

    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      throw new Error('User not found');
    }

    // Filter orders by user email
    const userOrders = orders.filter(o => o.customer_email === user.email);

    // Sort by date (newest first)
    userOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return { data: userOrders };
  }
};

// Wishlist Service
export const wishlistService = {
  getWishlist: async (userId) => {
    initializeData();
    const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];

    // Filter by user and map to products
    const userWishlist = wishlist
      .filter(item => item.user_id === userId)
      .map(item => {
        const product = products.find(p => p.id === item.product_id);
        return product ? { ...product, wishlist_id: item.id } : null;
      })
      .filter(item => item !== null);

    return { data: userWishlist };
  },

  addToWishlist: async (userId, productId) => {
    initializeData();
    const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];

    // Check if already in wishlist
    if (wishlist.some(item => item.user_id === userId && item.product_id === productId)) {
      throw new Error('Product already in wishlist');
    }

    const newItem = {
      id: getNextId(wishlist),
      user_id: userId,
      product_id: productId,
      created_at: new Date().toISOString()
    };

    wishlist.push(newItem);
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));

    return { data: { message: 'Added to wishlist' } };
  },

  removeFromWishlist: async (userId, productId) => {
    initializeData();
    const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
    const filteredWishlist = wishlist.filter(
      item => !(item.user_id === userId && item.product_id === productId)
    );

    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(filteredWishlist));

    return { data: { message: 'Removed from wishlist' } };
  },

  checkWishlist: async (userId, productId) => {
    initializeData();
    const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
    const exists = wishlist.some(item => item.user_id === userId && item.product_id === productId);

    return { data: { exists } };
  }
};

// Chat Service
export const chatService = {
  getConversations: async (userId = null, sessionId = null) => {
    initializeData();
    let conversations = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_CONVERSATIONS)) || [];
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) || [];

    // Filter conversations by user_id or session_id
    if (userId) {
      conversations = conversations.filter(c => c.user_id === userId || c.user_id === `user_${userId}`);
    } else if (sessionId) {
      conversations = conversations.filter(c => c.session_id === sessionId);
    }

    // Add unread count to each conversation
    const conversationsWithUnread = conversations.map(conv => {
      const convMessages = messages.filter(m => m.conversation_id === conv.id);
      const unreadCount = convMessages.filter(m => !m.read && m.sender_role !== 'admin').length;
      const lastMessage = convMessages[convMessages.length - 1];

      return {
        ...conv,
        unread_count: unreadCount,
        last_message: lastMessage?.message || '',
        last_message_time: lastMessage?.created_at || conv.created_at
      };
    });

    // Sort by last message time
    conversationsWithUnread.sort((a, b) =>
      new Date(b.last_message_time) - new Date(a.last_message_time)
    );

    return { data: conversationsWithUnread };
  },

  getMessages: async (conversationId) => {
    initializeData();
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) || [];
    const conversationMessages = messages.filter(m => m.conversation_id === conversationId);

    // Sort by time
    conversationMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return { data: conversationMessages };
  },

  sendMessage: async (conversationId, data) => {
    initializeData();
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) || [];

    const newMessage = {
      id: getNextId(messages),
      conversation_id: conversationId,
      sender_id: data.sender_id,
      sender_name: data.sender_name,
      sender_role: data.sender_role,
      message: data.message,
      read: false,
      created_at: new Date().toISOString()
    };

    messages.push(newMessage);
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));

    // Update conversation last activity
    const conversations = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_CONVERSATIONS)) || [];
    const convIndex = conversations.findIndex(c => c.id === conversationId);
    if (convIndex !== -1) {
      conversations[convIndex].updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.CHAT_CONVERSATIONS, JSON.stringify(conversations));
    }

    return { data: newMessage };
  },

  createConversation: async (userId, userName, sessionId = null) => {
    initializeData();
    const conversations = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_CONVERSATIONS)) || [];

    // Check if conversation already exists for this user or session
    let existing = null;
    if (userId) {
      existing = conversations.find(c => c.user_id === userId || c.user_id === `user_${userId}`);
    } else if (sessionId) {
      existing = conversations.find(c => c.session_id === sessionId);
    }

    if (existing) {
      return { data: existing };
    }

    const newConversation = {
      id: getNextId(conversations),
      user_id: userId ? (typeof userId === 'number' ? userId : userId) : null,
      session_id: sessionId || (userId ? null : getSessionId()),
      user_name: userName || 'Guest User',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    conversations.push(newConversation);
    localStorage.setItem(STORAGE_KEYS.CHAT_CONVERSATIONS, JSON.stringify(conversations));

    return { data: newConversation };
  },

  markAsRead: async (conversationId) => {
    initializeData();
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) || [];

    // Mark all messages in this conversation as read
    const updatedMessages = messages.map(m => {
      if (m.conversation_id === conversationId) {
        return { ...m, read: true };
      }
      return m;
    });

    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(updatedMessages));

    return { data: { message: 'Marked as read' } };
  }
};

// Initialize data on module load
initializeData();
