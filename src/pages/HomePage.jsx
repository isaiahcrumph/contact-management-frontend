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

  const handleDelete = async () => {
    if (!selectedContactId) {
      setMessage({ type: 'warning', message: 'Please select a contact to delete' });
      return;
    }

    try {
      setLoading(true);
      await contactService.deleteContact(selectedContactId);
      setMessage({ type: 'success', message: 'Contact deleted successfully' });
      setSelectedContactId(null);
      await fetchContacts();
    } catch (err) {
      setError('Failed to delete the contact.');
    } finally {
      setLoading(false);
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
  
  {/* Center the buttons */}
  <div className="flex justify-center mb-6">
    <div className="flex flex-wrap gap-2">
      <CrudButton type="create" onClick={handleCreate} label="Create Contact" />
      <CrudButton type="read" onClick={handleRead} label="View Contacts" />
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
      {/* Add this right after your CrudButtons */}
<div className="flex justify-center mt-4">
  <button 
    onClick={() => {
      console.log("Test button clicked");
      if (contacts.length > 0) {
        handleViewContact(contacts[0].id);
      }
    }}
    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >
    Test View First Contact
  </button>
</div>
    </div>
  </div>
  
  <hr className="my-6 border-gray-600" />
  
  {message && <MessageDisplay type={message.type} text={message.message} />}
  {error && <MessageDisplay type="error" text={error} />}
  
  <div className="bg-gray-800 p-6 rounded-lg shadow-md">
    {showForm ? (
      <ContactForm 
        contact={currentContact} 
        onSubmit={handleFormSubmit} 
        onCancel={handleFormCancel} 
      />
    ) : (
      <ContactsTable 
        contacts={contacts} 
        loading={loading} 
        error={error}
        selectedContactId={selectedContactId}
        onSelectContact={handleSelectContact}
        onViewContact={handleViewContact}
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
  </PageLayout>
);
};

export default HomePage;