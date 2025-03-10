import axios from 'axios';

const API_URL = 'https://localhost:7091'; // Update this with your actual API URL

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set auth token for subsequent requests
const setAuthToken = (token) => {
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
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  },
};

// Placeholder for contact API functions (to be implemented in Period 3)
export const contactService = {
  getAllContacts: async () => {
    try {
      const response = await apiClient.get('/api/v2/contacts');
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },
  // Other CRUD operations will be added here
};

// Initialize auth token from localStorage on page load
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

export default apiClient;