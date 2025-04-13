// src/services/api.js
import apiClient from './api-client';
import authService from './auth-service';
import contactsService from './contacts-service';

// Automatically attach token to API calls on load
const token = localStorage.getItem('contact_app_token');
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Export everything from one place
export {
  apiClient,
  authService,
  contactsService
};
