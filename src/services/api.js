import {
  getSessionId,
  authService,
  userService,
  productsService,
  categoriesService,
  cartService,
  ordersService,
  wishlistService,
  chatService
} from './localStorage';

// Auth API (Admin)
export const authAPI = {
  login: (credentials) => authService.login(credentials),
  logout: () => authService.logout(),
  getUser: () => authService.getUser(),
};

// User API (Customer)
export const userAPI = {
  register: (data) => userService.register(data),
  login: (credentials) => userService.login(credentials),
  logout: () => userService.logout(),
  getCurrentUser: () => userService.getCurrentUser(),
  updateProfile: (id, data) => userService.updateProfile(id, data),
  getUserOrders: (id) => userService.getUserOrders(id),
};

// Products API
export const productsAPI = {
  getAll: (params) => productsService.getAll(params),
  getById: (id) => productsService.getById(id),
  create: (data) => productsService.create(data),
  update: (id, data) => productsService.update(id, data),
  delete: (id) => productsService.delete(id),
  setMainImage: (productId, imageId) => productsService.setMainImage(productId, imageId),
};

// Categories API
export const categoriesAPI = {
  getAll: (params) => categoriesService.getAll(params),
  getById: (id) => categoriesService.getById(id),
  create: (data) => categoriesService.create(data),
  update: (id, data) => categoriesService.update(id, data),
  delete: (id) => categoriesService.delete(id),
};

// Cart API
export const cartAPI = {
  getCart: (userId) => cartService.getCart(userId),
  addToCart: (productId, quantity, userId) => cartService.addToCart(productId, quantity, getSessionId(), userId),
  updateCart: (id, quantity) => cartService.updateCart(id, quantity),
  removeFromCart: (id) => cartService.removeFromCart(id),
  clearCart: (userId) => cartService.clearCart(getSessionId(), userId),
};

// Orders API
export const ordersAPI = {
  getAll: (params) => ordersService.getAll(params),
  getById: (id) => ordersService.getById(id),
  create: (data) => ordersService.create({ ...data, session_id: getSessionId() }),
  updateStatus: (id, status) => ordersService.updateStatus(id, status),
  delete: (id) => ordersService.delete(id),
};

// Wishlist API (Private)
export const wishlistAPI = {
  getWishlist: (userId) => wishlistService.getWishlist(userId),
  addToWishlist: (userId, productId) => wishlistService.addToWishlist(userId, productId),
  removeFromWishlist: (userId, productId) => wishlistService.removeFromWishlist(userId, productId),
  checkWishlist: (userId, productId) => wishlistService.checkWishlist(userId, productId),
};

// Chat API
export const chatAPI = {
  getConversations: (userId = null, sessionId = null) => chatService.getConversations(userId, sessionId),
  getMessages: (conversationId) => chatService.getMessages(conversationId),
  sendMessage: (conversationId, data) => chatService.sendMessage(conversationId, data),
  createConversation: (userId, userName, sessionId = null) => chatService.createConversation(userId, userName, sessionId),
  markAsRead: (conversationId) => chatService.markAsRead(conversationId),
};

export { getSessionId };
export default { authAPI, userAPI, productsAPI, categoriesAPI, cartAPI, ordersAPI, wishlistAPI, chatAPI };




