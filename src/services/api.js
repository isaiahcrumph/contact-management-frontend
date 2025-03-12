// src/services/api.js
import axios from 'axios';

// Base API URL - update this with your actual API URL
const API_URL = 'https://localhost:7091'; 

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set auth token for subsequent requests
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Authentication service
export const authService = {
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', { username, password });
      const token = response.data.token;
      setAuthToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        username: response.data.username,
        role: response.data.role,
        expiration: response.data.expiration
      }));
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Check if token is expired
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const expirationDate = new Date(user.expiration);
      if (expirationDate > new Date()) {
        return true;
      }
    }
    
    // Token expired, clear it
    authService.logout();
    return false;
  }
};

// Contact service - integrates with your existing API
export const contactService = {
  getAllContacts: async () => {
    try {
      const response = await apiClient.get('/api/v2/contacts');
      return response.data.contacts || response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },
  
  getContactById: async (id) => {
    try {
      const response = await apiClient.get(`/api/v2/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error);
      throw error;
    }
  },
  
  createContact: async (contactData) => {
    try {
      const response = await apiClient.post('/api/v2/contacts', contactData);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },
  
  updateContact: async (contactData) => {
    try {
      const response = await apiClient.put(`/api/v2/contacts/${contactData.id}`, contactData);
      return response.data;
    } catch (error) {
      console.error(`Error updating contact ${contactData.id}:`, error);
      throw error;
    }
  },
  
  deleteContact: async (id) => {
    try {
      await apiClient.delete(`/api/v2/contacts/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error);
      throw error;
    }
  }
};

// Initialize auth token from localStorage on page load
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

export default apiClient;