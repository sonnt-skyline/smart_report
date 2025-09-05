import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle different error statuses
    if (response) {
      // Server returned an error response
      switch (response.status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          // Redirect to login page
          window.location.href = '/login';
          break;
        
        case 403:
          // Forbidden
          console.error('Forbidden access:', response.data?.message || 'You do not have permission to access this resource');
          break;
          
        case 404:
          // Not Found
          console.error('Resource not found:', response.data?.message || 'The requested resource was not found');
          break;
          
        case 500:
          // Server Error
          console.error('Server error:', response.data?.message || 'An unexpected error occurred');
          break;
          
        default:
          console.error(`Error ${response.status}:`, response.data?.message || 'An error occurred');
      }
    } else {
      // Network error or request cancelled
      console.error('Network error or request cancelled:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Authentication
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    refreshToken: () => api.post('/auth/refresh-token')
  },
  
  // Users
  users: {
    getCurrent: () => api.get('/users/me'),
    update: (userData) => api.put('/users/me', userData),
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
  },
  
  // Objectives
  objectives: {
    getAll: (params) => api.get('/objectives', { params }),
    getById: (id) => api.get(`/objectives/${id}`),
    create: (objective) => api.post('/objectives', objective),
    update: (id, objective) => api.put(`/objectives/${id}`, objective),
    delete: (id) => api.delete(`/objectives/${id}`),
  },
  
  // Actions
  actions: {
    getAll: (params) => api.get('/actions', { params }),
    getById: (id) => api.get(`/actions/${id}`),
    create: (action) => api.post('/actions', action),
    update: (id, action) => api.put(`/actions/${id}`, action),
    delete: (id) => api.delete(`/actions/${id}`),
    updateStatus: (id, status) => api.patch(`/actions/${id}/status`, { status }),
  },
  
  // Reports
  reports: {
    getWeekly: (params) => api.get('/reports/weekly', { params }),
    generateWeekly: (params) => api.post('/reports/weekly/generate', params),
  },
  
  // Notifications
  notifications: {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.patch(`/notifications/${id}/read`),
    markAllAsRead: () => api.patch('/notifications/read-all'),
  }
};

export default apiService;
