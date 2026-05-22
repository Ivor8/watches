// API base URL - update based on your deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth utilities
export const getAuthToken = () => localStorage.getItem('admin_token');
export const setAuthToken = (token) => localStorage.setItem('admin_token', token);
export const removeAuthToken = () => localStorage.removeItem('admin_token');

// Helper for API requests
const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  const headers = {
    'Authorization': `Bearer ${getAuthToken()}`,
  };
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (response.status === 401) {
    removeAuthToken();
    window.location.href = '/admin';
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'API error');
  }

  return data;
};

// ============ AUTH API ============
export const authApi = {
  login: (email, password) => 
    apiCall('/auth/admins/login', 'POST', { email, password }),
  
  getAdmins: () => 
    apiCall('/auth/admins'),
  
  createAdmin: (email, password, name, role) => 
    apiCall('/auth/admins', 'POST', { email, password, name, role }),
  
  deleteAdmin: (id) => 
    apiCall(`/auth/admins/${id}`, 'DELETE'),
  
  updateAdmin: (id, name, role) => 
    apiCall(`/auth/admins/${id}`, 'PUT', { name, role }),
};

// ============ PRODUCTS API ============
export const productsApi = {
  getAll: () => 
    apiCall('/products'),
  
  getById: (id) => 
    apiCall(`/products/${id}`),
  
  getByHandle: (handle) => 
    apiCall(`/products/by-handle/${handle}`),
  
  search: (query) => {
    const params = new URLSearchParams(query).toString();
    return apiCall(`/products/search?${params}`);
  },
  
  create: (formData) => 
    apiCall('/products', 'POST', formData, true),
  
  update: (id, formData) => 
    apiCall(`/products/${id}`, 'PUT', formData, true),
  
  delete: (id) => 
    apiCall(`/products/${id}`, 'DELETE'),
};

// ============ ORDERS API ============
export const ordersApi = {
  getAll: () => 
    apiCall('/orders'),
  
  getById: (id) => 
    apiCall(`/orders/${id}`),
  
  create: (order) => 
    apiCall('/orders', 'POST', order),
  
  updateStatus: (id, status) => 
    apiCall(`/orders/${id}/status`, 'PUT', { status }),
  
  delete: (id) => 
    apiCall(`/orders/${id}`, 'DELETE'),
  
  getByCustomerEmail: (email) => 
    apiCall(`/orders/customer?email=${encodeURIComponent(email)}`),
  
  getDashboardStats: () => 
    apiCall('/orders/stats/dashboard'),
};

// ============ CONTACT API ============
export const contactApi = {
  send: (form) =>
    apiCall('/contact', 'POST', form),
};

// ============ COLLECTIONS API ============
export const collectionsApi = {
  getAll: () => 
    apiCall('/collections'),
  
  getByHandle: (handle) => 
    apiCall(`/collections/${handle}`),
  
  create: (collection) => 
    apiCall('/collections', 'POST', collection),
  
  update: (id, collection) => 
    apiCall(`/collections/${id}`, 'PUT', collection),
  
  delete: (id) => 
    apiCall(`/collections/${id}`, 'DELETE'),
};

// ============ SETTINGS API ============
export const settingsApi = {
  get: () => 
    apiCall('/settings'),
  
  update: (settings) => 
    apiCall('/settings', 'PUT', settings),
};

// ============ CHAT API ============
export const chatApi = {
  getAll: () => 
    apiCall('/chat'),
  
  getBySession: (sessionId) => 
    apiCall(`/chat/session/${sessionId}`),
  
  send: (session_id, sender, message) => 
    apiCall('/chat', 'POST', { session_id, sender, message }),
};

export default apiCall;
