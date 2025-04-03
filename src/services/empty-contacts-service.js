// src/services/emptyContacts-service.js
import apiClient from './api-client';

// You can choose which API version to use
const API_VERSION = 'v1';

const contactsService = {
  // Get all emptyContacts
  getEmptyContacts: async () => {
    try {
      const response = await apiClient.get(`/${API_VERSION}/emptyContacts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching empty contacts:', error);
      throw error;
    }
  },
  
  // Get a single empty contact by ID
  getEmptyContact: async (id) => {
    try {
      const response = await apiClient.get(`/${API_VERSION}/emptyContacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching empty contact ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new empty contact
  createEmptyContact: async (emptyContactData) => {
    try {
      const response = await apiClient.post(`/${API_VERSION}/emptyContacts`, emptyContactData);
      return response.data;
    } catch (error) {
      console.error('Error creating empty contact:', error);
      throw error;
    }
  },
  
  // Update an existing empty contact
  updateEmptyContact: async (id, emptyContactData) => {
    try {
      const response = await apiClient.put(`/${API_VERSION}/emptyContacts/${id}`, emptyContactData);
      return response.data;
    } catch (error) {
      console.error(`Error updating empty contact ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a empty contact
  deleteEmptyContact: async (id) => {
    try {
      const response = await apiClient.delete(`/${API_VERSION}/emptyContacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting empty contact ${id}:`, error);
      throw error;
    }
  }
};

export default contactsService;