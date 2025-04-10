// src/services/contacts-service.js
import apiClient from './api-client';

// You can choose which API version to use
const API_VERSION = 'v1';

const contactsService = {
  // Get all contacts
// Fetch contacts with optional query params
getContacts: async ({ search = '', page = 1, pageSize = 10 } = {}) => {
  try {
    const response = await apiClient.get(`/v1/contacts/paged`, {
      params: {
        search,
        page,
        pageSize
      }
    });

    return response.data; // Must return: { data: [...], totalCount: number }
  } catch (error) {
    console.error('Error fetching paged contacts:', error);
    throw error;
  }
},

  
  // Get a single contact by ID
  getContact: async (id) => {
    try {
      const response = await apiClient.get(`/${API_VERSION}/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new contact
  createContact: async (contactData) => {
    try {
      const response = await apiClient.post(`/${API_VERSION}/contacts`, contactData);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },
  
  // Update an existing contact
  updateContact: async (id, contactData) => {
    try {
      const response = await apiClient.put(`/${API_VERSION}/contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      console.error(`Error updating contact ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a contact
  deleteContact: async (id) => {
    try {
      const response = await apiClient.delete(`/${API_VERSION}/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error);
      throw error;
    }
  }
};

export default contactsService;