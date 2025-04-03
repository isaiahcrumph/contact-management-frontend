// src/services/api.js (UPDATED VERSION)
import apiClient from './api-client';

// Export the apiClient so other services can use it
export { default as apiClient } from './api-client';

// Authentication service
export const authService = {
// In src/services/api.js - update the login function
// In src/services/api.js - update the login function
login: async (username, password) => {
  try {
    console.log('Sending login request with:', { username, password });
    const response = await apiClient.post('/api/auth/login', { username, password });
    
    // Check if the response.data is a string (token)
    if (response.data && typeof response.data === 'string') {
      // The response is the token itself
      const token = response.data;
      
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      
      // Extract username from token payload (JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Store user info from token claims
      localStorage.setItem('user', JSON.stringify({
        username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || username,
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'user',
        expiration: payload.exp ? new Date(payload.exp * 1000).toISOString() : null
      }));
      
      return { token, user: { username, role: 'user' } };
    } else {
      console.error('Invalid response format:', response.data);
      throw new Error('No token received from server');
    }
  } catch (error) {
    console.error('Login error details:', error);
    throw error;
  }
},
 
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
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
      if (user.expiration) {
        const expirationDate = new Date(user.expiration);
        if (expirationDate > new Date()) {
          return true;
        }
      } else {
        return true; // No expiration info, assume valid
      }
    }
   
    // Token expired or no user info, clear it
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
    const { id, ...contactWithoutId } = contactData;
    const response = await apiClient.post('/api/v2/contacts', contactWithoutId);
    return response.data;
  } catch (error) {
    // Improved error handling with user-friendly messages
    let errorMessage = 'Failed to create contact. Please try again.';
    
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      
      // Customize message based on status codes
      if (error.response.status === 400) {
        errorMessage = 'The contact information is invalid. Please check all fields.';
        
        // If we have detailed validation errors, include them
        if (error.response.data?.errors) {
          const errorDetails = Object.entries(error.response.data.errors)
            .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
            .join('; ');
          
          errorMessage = `Validation errors: ${errorDetails}`;
        }
      } else if (error.response.status === 401) {
        errorMessage = 'You need to log in again to continue.';
      } else if (error.response.status === 403) {
        errorMessage = 'You don\'t have permission to create contacts.';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      }
    } else if (error.request) {
      errorMessage = 'Could not connect to the server. Please check your internet connection.';
    }
    
    // Attach the parsed error message to the error object
    error.userMessage = errorMessage;
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
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default apiClient;