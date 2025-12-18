import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // Only add token if not already set (allows overriding)
    if (!config.headers['Authorization']) {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle InfinityFree/Bot HTML responses
api.interceptors.response.use(
  (response) => {
    // If response is a string (HTML) but we expected JSON, it's likely a blockage or 403
    if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
      console.error("API Blocked: Received HTML instead of JSON. InfinityFree is likely blocking the request.");
      return Promise.reject({
        message: 'API Error: The free hosting server is blocking the request (Bot Protection).',
        isHtmlError: true
      });
    }
    return response;
  },
  (error) => {
    console.error("API Error Details:", error);
    return Promise.reject(error);
  }
);

// Helper to handle FormData for updates (Method Spoofing)
const createFormDataForPut = (data) => {
  if (data instanceof FormData) {
    data.append('_method', 'PUT');
    return data;
  }
  return data;
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getUser: (config) => api.get('/auth/user', config),
};

// User API (Customer)
export const userAPI = {
  register: (data) => api.post('/auth/register', data), // utilizing same auth endpoint or specific
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: (config) => api.get('/auth/user', config),
  updateProfile: (id, data) => api.post(`/users/${id}`, createFormDataForPut(data)),
  getUserOrders: (id) => api.get(`/orders?user_id=${id}`),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.post(`/products/${id}`, createFormDataForPut(data), {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/products/${id}`),
  setMainImage: (productId, imageId) => api.post(`/products/${productId}/set-main`, { image_id: imageId }),
};

// Categories API
export const categoriesAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: (userId) => api.get(`/cart?user_id=${userId}`),
  addToCart: (productId, quantity, userId) => api.post('/cart', { product_id: productId, quantity, user_id: userId }),
  updateCart: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  removeFromCart: (id) => api.delete(`/cart/${id}`),
  clearCart: (userId) => api.delete(`/cart?user_id=${userId}`),
};

// Orders API
export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.post(`/orders/${id}`, { status }), // simplified
  delete: (id) => api.delete(`/orders/${id}`),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: (userId) => api.get(`/wishlist?user_id=${userId}`),
  addToWishlist: (userId, productId) => api.post('/wishlist', { user_id: userId, product_id: productId }),
  removeFromWishlist: (userId, productId) => api.delete(`/wishlist?user_id=${userId}&product_id=${productId}`),
  checkWishlist: (userId, productId) => api.get(`/wishlist?user_id=${userId}&check_product_id=${productId}`),
};

// Chat API (Placeholder)
export const chatAPI = {
  getConversations: () => Promise.resolve({ data: [] }),
  getMessages: () => Promise.resolve({ data: [] }),
  sendMessage: () => Promise.resolve({}),
};

export const getSessionId = () => {
  // Keep internal session ID logic if needed or fetch from server
  return 'session_' + Date.now();
};

export default { authAPI, userAPI, productsAPI, categoriesAPI, cartAPI, ordersAPI, wishlistAPI, chatAPI };
