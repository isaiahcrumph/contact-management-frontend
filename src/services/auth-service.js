// src/services/auth-service.js - Enhanced version
import apiClient from './api-client';

const TOKEN_KEY = 'contact_app_token';

const authService = {
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', { 
        username, 
        password 
      });
      
      const token = response.data.token;
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Store token securely
      localStorage.setItem(TOKEN_KEY, token);
      
      // Set token for future requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return {
        success: true,
        user: response.data.user || { username } // Use user data if available
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  },
  
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
    // Optionally call logout endpoint if your API has one
    // return apiClient.post('/api/auth/logout');
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },
  
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  initializeAuth: () => {
    // Initialize token from localStorage if exists
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    return false;
  }
};

// Initialize auth on import
authService.initializeAuth();

export default authService;