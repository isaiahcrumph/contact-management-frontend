// src/services/empty-contacts-service.js
import api from './api-client';

const ENDPOINT = '/api/v1/emptyContacts';

// Get all empty contacts
export const getAllEmptyContacts = async () => {
    try {
      const response = await api.get(ENDPOINT);
      // If the response is successful but empty, return an empty array
      return response.data || [];
    } catch (error) {
      console.error('Error fetching empty contacts:', error);
      
      // If it's a 404 Not Found error, that's still an "empty" result
      if (error.response && error.response.status === 404) {
        // Return an object with a flag indicating it's empty but accessible
        return { isEmpty: true, contacts: [] };
      }
      
      // For other errors, throw with a flag indicating database access issue
      throw {
        isAccessError: true,
        message: 'Failed to connect to database',
        userMessage: 'Unable to connect to the contacts database. Please try again later.',
        error
      };
    }
  };

// Get a specific empty contact by ID
export const getEmptyContactById = async (id) => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching empty contact with id ${id}:`, error);
    throw {
      message: `Failed to get contact with ID: ${id}`,
      userMessage: 'Unable to load contact details. Please try again.',
      error
    };
  }
};

// Create a new empty contact
export const createEmptyContact = async (contact) => {
  try {
    const response = await api.post(ENDPOINT, contact);
    return response.data;
  } catch (error) {
    console.error('Error creating empty contact:', error);
    throw {
      message: 'Failed to create contact',
      userMessage: 'Unable to create contact. Please check your form and try again.',
      error
    };
  }
};

// Update an existing empty contact
export const updateEmptyContact = async (contact) => {
  try {
    const response = await api.put(`${ENDPOINT}/${contact.id}`, contact);
    return response.data;
  } catch (error) {
    console.error(`Error updating empty contact with id ${contact.id}:`, error);
    throw {
      message: `Failed to update contact with ID: ${contact.id}`,
      userMessage: 'Unable to update contact. Please check your form and try again.',
      error
    };
  }
};

// Delete an empty contact
export const deleteEmptyContact = async (id) => {
  try {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting empty contact with id ${id}:`, error);
    throw {
      message: `Failed to delete contact with ID: ${id}`,
      userMessage: 'Unable to delete contact. Please try again.',
      error
    };
  }
};

// Search empty contacts
export const searchEmptyContacts = async (query) => {
  try {
    const response = await api.get(`${ENDPOINT}/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching empty contacts with query "${query}":`, error);
    throw {
      message: 'Failed to search contacts',
      userMessage: 'Unable to search contacts. Please try again.',
      error
    };
  }
};

// Get filtered and sorted empty contacts
export const getFilteredEmptyContacts = async (filters) => {
  try {
    // Build query string from filters
    const queryParams = Object.entries(filters)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const response = await api.get(`${ENDPOINT}?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered empty contacts:', error);
    throw {
      message: 'Failed to load filtered contacts',
      userMessage: 'Unable to load contacts with the specified filters. Please try again.',
      error
    };
  }
};