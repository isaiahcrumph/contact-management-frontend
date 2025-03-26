// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import CrudButton from '../components/buttons/CrudButton';
import ContactsTable from '../components/tables/ContactsTable';
import ContactForm from '../components/forms/ContactForm';
import { contactService, authService } from '../services/api';
import ContactDetailsModal from '../components/modals/ContactDetailsModal';

const HomePage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const navigate = useNavigate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingContact, setViewingContact] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  


  // In your existing HomePage.jsx, add this useEffect after your state declarations
useEffect(() => {
  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    navigate('/login');
    return;
  }

  // Load contacts
  fetchContacts();
}, [navigate]);

// Add this useEffect in your HomePage.jsx
// Place it near your other useEffect hooks
useEffect(() => {
  // If there's a message showing, set a timer to clear it
  if (message) {
    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000); // Message will disappear after 3 seconds
    
    // Clean up the timer when component unmounts or message changes
    return () => clearTimeout(timer);
  }
}, [message]); // This effect runs whenever message changes

  // Check authentication and load contacts on mount
// Modified useEffect in HomePage.jsx
// Updated isAuthenticated function for api.js
isAuthenticated: () => {
  const token = localStorage.getItem('token');
  console.log('Authentication check - token exists:', !!token);
  
  // For now, just check if the token exists
  return !!token;
}

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllContacts();
      setContacts(Array.isArray(data) ? data : (data.contacts || []));
      setError(null);
    } catch (err) {
      setError('Failed to load contacts. Please try again.');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // CRUD Operations
  const handleCreate = () => {
    setCurrentContact(null);
    setShowForm(true);
  };

  const handleRead = () => {
    fetchContacts();
    setShowForm(false);
    setCurrentContact(null);
    setSelectedContactId(null);
  };

  const handleUpdate = async () => {
    if (!selectedContactId) {
      setMessage({ type: 'warning', message: 'Please select a contact to update' });
      return;
    }

    try {
      setLoading(true);
      const contact = await contactService.getContactById(selectedContactId);
      setCurrentContact(contact);
      setShowForm(true);
    } catch (err) {
      setError('Failed to load the selected contact.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!selectedContactId) {
      setMessage({ type: 'warning', message: 'Please select a contact to delete' });
      return;
    }
  
    // Show confirmation dialog instead of deleting immediately
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    try {
      setLoading(true);
      await contactService.deleteContact(selectedContactId);
      setMessage({ type: 'success', message: 'Contact deleted successfully' });
      setSelectedContactId(null);
      setShowDeleteConfirm(false);
      await fetchContacts();
    } catch (err) {
      setError('Failed to delete the contact.');
    } finally {
      setLoading(false);
    }
  };

  // Sort contacts based on current sort settings
  const getSortedContacts = () => {
    return [...contacts].sort((a, b) => {
      // Special handling for name field to sort by last name first
      if (sortField === 'name') {
        // Sort by lastName, then by firstName
        const lastNameCompare = sortDirection === 'asc' 
          ? a.lastName.localeCompare(b.lastName)
          : b.lastName.localeCompare(a.lastName);
          
        // If last names are the same, sort by first name
        if (lastNameCompare === 0) {
          return sortDirection === 'asc'
            ? a.firstName.localeCompare(b.firstName)
            : b.firstName.localeCompare(a.firstName);
        }
        
        return lastNameCompare;
      }
      
      // For other fields, use standard sorting
      const fieldA = a[sortField] || '';
      const fieldB = b[sortField] || '';
      
      // Handle string sorting
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        if (sortDirection === 'asc') {
          return fieldA.localeCompare(fieldB);
        } else {
          return fieldB.localeCompare(fieldA);
        }
      }
      
      // Handle numeric sorting
      if (sortDirection === 'asc') {
        return fieldA - fieldB;
      } else {
        return fieldB - fieldA;
      }
    });
  };

const handleSort = (field) => {
  // If clicking same field, toggle direction
  if (field === sortField) {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    // New field, default to ascending
    setSortField(field);
    setSortDirection('asc');
  }
};

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      if (formData.id) {
        // Update
        await contactService.updateContact(formData);
        setMessage({ type: 'success', message: 'Contact updated successfully' });
      } else {
        // Create
        await contactService.createContact(formData);
        setMessage({ type: 'success', message: 'Contact created successfully' });
      }
      setShowForm(false);
      setCurrentContact(null);
      await fetchContacts();
    } catch (err) {
      // Use our enhanced error messages from the API service
      setError(err.userMessage || 'Failed to save the contact.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentContact(null);
  };

  const handleSelectContact = (id) => {
    // Just handle row selection, no fetching details
    setSelectedContactId(id === selectedContactId ? null : id);
  };

  const handleViewContact = async (id) => {
    console.log("handleViewContact called with id:", id);
    try {
      setLoading(true);
      console.log("Fetching contact details...");
      const contact = await contactService.getContactById(id);
      console.log("Fetched contact:", contact);
      setViewingContact(contact);
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Error fetching contact:", err);
      setError('Failed to load contact details.');
    } finally {
      setLoading(false);
    }
  };

  


  // Display message component
  const MessageDisplay = ({ type, text }) => (
    <div className={`mt-4 mb-4 p-4 rounded ${
      type === 'error' ? 'bg-red-100 text-red-800' : 
      type === 'success' ? 'bg-green-100 text-green-800' :
      'bg-yellow-100 text-yellow-800'
    }`}>
      {text}
    </div>
  );

  const currentUser = authService.getCurrentUser();

  return (
// In your HomePage.jsx, modify the top section:
<PageLayout>
  {/* Login in the upper right corner */}
  <div className="flex justify-end">
    <div className="flex items-center">
      <span className="text-gray-300 mr-4">
        Logged in as: <strong>{currentUser?.username}</strong>
      </span>
      <button 
        onClick={handleLogout}
        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Logout
      </button>
    </div>
  </div>
  
  {/* Title above the buttons with spacing */}
  <h1 className="text-3xl font-bold text-white text-center mb-8">Contact Management</h1>
  
{/* Button area */}
<div className="flex justify-center mb-6">
  {currentUser?.role === 'Admin' ? (
    <div className="w-full">
      <div className="flex justify-center gap-2">
        <CrudButton type="create" onClick={handleCreate} label="Create Contact" />
        <CrudButton 
          type="update" 
          onClick={handleUpdate} 
          label="Update Contact" 
          disabled={!selectedContactId}
        />
        <CrudButton 
          type="delete" 
          onClick={handleDelete} 
          label="Delete Contact" 
          disabled={!selectedContactId}
        />
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleRead}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded"
          title="Refresh Contacts"
        >
          {/* SVG Refresh Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  ) : (
    <div className="w-full flex justify-end">
      <button
        onClick={handleRead}
        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded"
        title="Refresh Contacts"
      >
        {/* SVG Refresh Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  )}
</div>
  
  <hr className="my-6 border-gray-600" />
  
  {message && <MessageDisplay type={message.type} text={message.message} />}
  {error && <MessageDisplay type="error" text={error} />}
  
  <div className="bg-gray-800 p-6 rounded-lg shadow-md">

  {!showForm && (
  <div className="flex justify-end mb-4">
    <div className="flex items-center">
      <label htmlFor="sort-field" className="text-gray-300 mr-2">Sort by:</label>
      <select
        id="sort-field"
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
        className="bg-gray-700 text-white px-3 py-2 rounded mr-2"
      >
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="phoneNumber">Phone</option>
        <option value="city">City</option>
        <option value="state">State</option>
      </select>
      
      <button
        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded flex items-center"
        title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
      >
        {sortDirection === 'asc' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </div>
  </div>
)}

    {showForm ? (
      <ContactForm 
        contact={currentContact} 
        onSubmit={handleFormSubmit} 
        onCancel={handleFormCancel} 
      />
    ) : (

      
      <ContactsTable 
  contacts={getSortedContacts()} 
  loading={loading} 
  error={error}
  selectedContactId={selectedContactId}
  onSelectContact={handleSelectContact}
  onViewContact={handleViewContact}
  onSort={handleSort}
  sortField={sortField}
  sortDirection={sortDirection}
/>
    )}
  </div>
{/* Add the modal */}
{showDetailsModal && (
      <ContactDetailsModal 
        contact={viewingContact}
        onClose={() => setShowDetailsModal(false)}
      />
    )}

{/* Delete Confirmation Dialog */}
{showDeleteConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
      <h2 className="text-xl font-semibold text-white mb-4">Confirm Delete</h2>
      <p className="text-gray-300 mb-6">Are you sure you want to delete this contact? <br/> <br/>This action cannot be undone.</p>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={confirmDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


  </PageLayout>
);
};

export default HomePage;