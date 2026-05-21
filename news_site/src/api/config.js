// API configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || 'http://localhost:5003/api';

// Mock data for development when backend is not available
export const MOCK_DATA_ENABLED = false; // Force use of real API

export const API_ENDPOINTS = {
  // News endpoints
  NEWS: {
    GET_ALL: '/news',
    GET_BY_ID: (id) => `/news/${id}`,
    GET_BY_CATEGORY: (category) => `/news/category/${category}`,
    GET_TRENDING: '/news/trending',
    GET_FEATURED: '/news/featured',
    SEARCH: '/news/search',
  },
  
  // Author endpoints
  AUTHORS: {
    GET_ALL: '/authors',
    GET_BY_ID: (id) => `/authors/${id}`,
    GET_BY_NAME: (name) => `/authors/name/${encodeURIComponent(name)}`,
    GET_ACTIVE: '/authors/status/active',
    // Get author's content (blogs and home content)
    GET_ARTICLES: (id) => `/authors/${id}/content`,
  },
  
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    BOOKMARKS: '/user/bookmarks',
    ADD_BOOKMARK: '/user/bookmarks',
    REMOVE_BOOKMARK: (id) => `/user/bookmarks/${id}`,
    PREFERENCES: '/user/preferences',
  },
  
  // Analytics endpoints
  ANALYTICS: {
    TRACK_VIEW: '/analytics/view',
    TRACK_SHARE: '/analytics/share',
    TRACK_CLICK: '/analytics/click',
  },
  
  // Newsletter endpoints
  NEWSLETTER: {
    SUBSCRIBE: '/newsletter/subscribe',
    UNSUBSCRIBE: '/newsletter/unsubscribe',
  }
};

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// HTTP client configuration
export const httpConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};