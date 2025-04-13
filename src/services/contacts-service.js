// src/services/contacts-service.js
import apiClient from './api-client';


// You can choose which API version to use
const API_VERSION = 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

const contactsService = {
  getContacts: async ({ name = '', city = '', state = '', sortby = '', order = 'asc', page = 1, pageSize = 10 } = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/contacts/paged`, {
        params: {
          name,     // ✅ must match what the backend expects
          city,
          state,
          sortby,
          order,
          pageNumber: page,  // ✅ must match backend param
          pageSize
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching paged contacts:', error);
      throw error;
    }
  },

  
  // Get a single contact by ID
  getContact: async (id) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new contact
  createContact: async (contactData) => {
    try {
      console.log("🚀 Sending contact data to backend:", contactData); // 👈 log this
      const response = await apiClient.post(`${API_PREFIX}/contacts`, contactData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating contact:', error);
      console.error('📨 Server response:', error.response?.data);
      throw error;
    }
  }
  ,
  
  // Update an existing contact
  updateContact: async (id, contactData) => {
    try {
      const response = await apiClient.put(`${API_PREFIX}/contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      console.error(`Error updating contact ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a contact
  deleteContact: async (id) => {
    try {
      const response = await apiClient.delete(`${API_PREFIX}/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error);
      throw error;
    }
  }
};

export default contactsService;
